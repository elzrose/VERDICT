import FeatureCarousel from "../components/FeatureCarousel";
import Navbar from "../components/Navbar";
import UploadSection from '../components/UploadSection';


export default function Home() {
  return (
    <div className="home-page" style={{ minHeight: '100vh' }}>

      {/* 1. Place the Navbar at the top */}
      <Navbar />
      {/* 2. Main Page Content */}
      <main style={{ padding: '2rem' }}>

        <h1>Welcome to Verdict</h1>
        <p>This website helps you analyze, store, and share your most important data.</p>

        {/* 3. Place the automatic carousel below the intro text */}
        <FeatureCarousel />
      </main>
      <div id="upload">
        <UploadSection />
      </div>
    </div>
  );
}
