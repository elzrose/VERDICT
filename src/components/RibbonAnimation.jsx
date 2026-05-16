import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

const BASE_COLOR = new THREE.Color(252 / 255, 0 / 255, 80 / 255);
const GLITCH_COLORS = [
  new THREE.Color(0, 1, 0),     // bright green
  new THREE.Color(1, 1, 0),     // yellow
  new THREE.Color(1, 1, 1),     // white
];

// Build a flat ribbon strip following a path of points on a sphere surface.
// Each ribbon is a PlaneGeometry-style strip: many quads wide but only 1 quad tall,
// so it looks like a flat band of tape.
function buildRibbonGeometry(curvePts, ribbonHalfWidth = 0.22, segments = 100) {
  const positions = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Get point on curve and tangent direction
    const pt = curvePts[Math.floor(t * (curvePts.length - 1))].clone();
    const next = curvePts[Math.min(Math.floor(t * (curvePts.length - 1)) + 1, curvePts.length - 1)].clone();
    const tangent = next.sub(pt).normalize();

    // Perpendicular to tangent and the view direction
    const up = new THREE.Vector3(0, 1, 0);
    const perp = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (perp.lengthSq() < 0.001) {
      perp.set(1, 0, 0);
    }

    const left = pt.clone().add(perp.clone().multiplyScalar(-ribbonHalfWidth));
    const right = pt.clone().add(perp.clone().multiplyScalar(ribbonHalfWidth));

    positions.push(left.x, left.y, left.z);
    positions.push(right.x, right.y, right.z);

    uvs.push(0, t);
    uvs.push(1, t);
  }

  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, b, c);
    indices.push(b, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// Generate a random path of points that sweeps across a sphere surface
function generateSphereRibbonPath(radius = 5, numPts = 80) {
  const points = [];
  // Start from a random point on sphere surface
  const phi0 = Math.random() * Math.PI;
  const theta0 = Math.random() * Math.PI * 2;

  // Walk along sphere surface with small random steps
  let phi = phi0;
  let theta = theta0;
  for (let i = 0; i < numPts; i++) {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    points.push(new THREE.Vector3(x, y, z));

    // Step along surface with slight random deviation
    phi += (Math.random() - 0.3) * 0.35;
    theta += (Math.random() - 0.3) * 0.45;
    phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));
  }
  return points;
}

export default function RibbonAnimation({ onReady, onGlitch }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    scene.background = new THREE.Color(isDark ? 0x070810 : 0xffffff);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.01, 1000);
    camera.position.set(0, 0, 20);

    // Lighting (keep it subtle — ribbons look better flat-lit)
    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(0, 5, 10);
    scene.add(dLight);

    // ----- BUILD RIBBONS -----
    const NUM_RIBBONS = 35;
    const SPHERE_RADIUS = 5.5;
    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);

    // Create striped canvas texture (like the reference: hatched lines on the ribbon)
    function makeStripeTexture(colorA, colorB, stripes = 12) {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = colorA;
      ctx.fillRect(0, 0, size, size);
      const stripeW = size / stripes;
      ctx.fillStyle = colorB;
      for (let i = 0; i < stripes; i += 2) {
        ctx.fillRect(i * stripeW, 0, stripeW, size);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 6);
      return tex;
    }

    const ribbons = [];

    for (let i = 0; i < NUM_RIBBONS; i++) {
      const rawPts = generateSphereRibbonPath(SPHERE_RADIUS, 100);
      const curve = new THREE.CatmullRomCurve3(rawPts, false, 'catmullrom', 0.5);
      const curvePts = curve.getPoints(120);

      const geo = buildRibbonGeometry(curvePts, 0.26, 120);

      const tex = makeStripeTexture(
        `rgba(252,0,80,1)`,
        `rgba(200,0,60,0.85)`
      );

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      ribbonGroup.add(mesh);

      // Animate draw range for the "tape unrolling" effect
      const totalIdx = geo.index.count;
      geo.setDrawRange(0, totalIdx); // full ribbon visible from start

      ribbons.push({
        mesh,
        geo,
        totalIdx,
        offset: Math.random(), // random phase for scrolling texture
        scrollSpeed: (Math.random() > 0.5 ? 1 : -1) * (0.003 + Math.random() * 0.004),
        color: BASE_COLOR.clone(),
        texRef: tex,
      });
    }

    // ----- LOAD FONT FOR TEXT MORPH -----
    let textTargets = null;
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
      const textGeo = new TextGeometry('verdict', {
        font,
        size: 3.5,
        depth: 0.4,
        curveSegments: 8,
        bevelEnabled: false,
      });
      textGeo.center();

      const tmpMesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial());
      const sampler = new MeshSurfaceSampler(tmpMesh).build();
      const tmp = new THREE.Vector3();
      textTargets = [];
      for (let i = 0; i < NUM_RIBBONS; i++) {
        sampler.sample(tmp);
        textTargets.push(tmp.clone());
      }
    });

    // ----- STATE -----
    const clock = new THREE.Clock();
    let phase = 'sphere'; // 'sphere' | 'morphing' | 'text'
    let readyCalled = false;
    let lastGlitchState = false;

    // Glitch state
    let nextGlitchAt = 1.5 + Math.random() * 2;
    let glitchEndAt = 0;

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Phase transition
      if (t > 5 && textTargets && phase === 'sphere') {
        phase = 'morphing';
      }

      // Glitch schedule
      const isGlitching = t < glitchEndAt;
      if (!isGlitching && t > nextGlitchAt) {
        glitchEndAt = t + 0.12 + Math.random() * 0.35;
        nextGlitchAt = t + 1.2 + Math.random() * 2.5;
      }

      // Notify parent of glitch state change
      if (isGlitching !== lastGlitchState) {
        lastGlitchState = isGlitching;
        if (onGlitch) onGlitch(isGlitching);
      }

      // Rotate entire sphere slowly
      ribbonGroup.rotation.y += 0.004;
      ribbonGroup.rotation.x = Math.sin(t * 0.18) * 0.15;

      // Per-ribbon updates
      let allSettled = true;
      ribbons.forEach((r, i) => {
        // Scroll UV texture to give "tape moving" feel
        r.texRef.offset.y = (r.texRef.offset.y + r.scrollSpeed) % 1;

        // Glitch color
        if (isGlitching && Math.random() > 0.45) {
          const gc = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];
          r.mesh.material.color.copy(gc);
          // Screen-space jitter
          if (Math.random() > 0.6) {
            r.mesh.position.x = (Math.random() - 0.5) * 0.5;
            r.mesh.position.y = (Math.random() - 0.5) * 0.5;
          }
        } else {
          r.mesh.material.color.lerp(BASE_COLOR, 0.12);
          r.mesh.position.lerp(new THREE.Vector3(0, 0, 0), 0.25);
        }

        // Morphing: lerp ribbon center toward text target
        if (phase === 'morphing' && textTargets) {
          const target = textTargets[i];
          const pos = r.mesh.position;
          const diff = target.clone().sub(pos);
          if (diff.length() > 0.05) {
            pos.lerp(target, 0.03);
            allSettled = false;
          }
        }
      });

      if (phase === 'morphing' && allSettled) {
        phase = 'text';
        if (!readyCalled && onReady) {
          readyCalled = true;
          onReady();
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}
