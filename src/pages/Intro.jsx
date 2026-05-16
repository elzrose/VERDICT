import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './Intro.css';

export default function Intro() {
  const navigate = useNavigate();
  const [isGlitching, setIsGlitching] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const glitchTimeoutRef = useRef(null);

  // Initial glitch on mount and random small glitches
  useEffect(() => {
    // Initial entrance glitch
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 800);

    // Random periodic glitches
    const interval = setInterval(() => {
      // 25% chance to glitch every 4 seconds
      if (Math.random() > 0.75) {
        setIsGlitching(true);
        clearTimeout(glitchTimeoutRef.current);
        // Glitch duration between 400ms and 1000ms
        const duration = 400 + Math.random() * 600;
        glitchTimeoutRef.current = setTimeout(() => setIsGlitching(false), duration);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(glitchTimeoutRef.current);
    };
  }, []);

  // Scroll handler for zoom
  useEffect(() => {
    const handleScroll = (e) => {
      if (isZooming) return;
      if (e.type === 'wheel' && e.deltaY > 0) {
        triggerZoom();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      if (isZooming) return;
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 30) { // Swiped up (scrolled down)
        triggerZoom();
      }
    };

    const triggerZoom = () => {
      setIsZooming(true);
      // Wait for zoom transition (1.5s) then navigate
      setTimeout(() => {
        navigate('/home');
      }, 1500); 
    };

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isZooming, navigate]);

  return (
    <div
      id="intro-screen"
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}
    >
      {/* Glitchy VERDICT title */}
      <div className={`verdict-glitch-wrap ${isGlitching ? 'glitching' : ''} ${isZooming ? 'zooming' : ''}`} aria-label="VERDICT">
        <span className="verdict-main" data-text="VERDICT">VERDICT</span>
        <span className="verdict-r" aria-hidden="true">VERDICT</span>
        <span className="verdict-b" aria-hidden="true">VERDICT</span>
        <span className="verdict-scanlines" aria-hidden="true" />
      </div>

      {/* Scroll indicator - hidden when zooming */}
      <div className={`scroll-indicator ${isZooming ? 'fade-out' : ''}`}>
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrows">
          <span className="arrow"></span>
          <span className="arrow"></span>
          <span className="arrow"></span>
        </div>
        <div className="scroll-text">SCROLL</div>
      </div>
    </div>
  );
}
