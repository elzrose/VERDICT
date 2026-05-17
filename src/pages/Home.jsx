import FeatureCarousel from "../components/FeatureCarousel";
import Navbar from "../components/Navbar";
import UploadSection from '../components/UploadSection';
import HistorySection from '../components/HistorySection';
import { Link } from 'react-router-dom';



export default function Home({ user }) {
  return (
    <div className="home-page" style={{ minHeight: '100vh' }}>


      <Navbar />

      <main id="intro" style={{ padding: '2rem', paddingTop: '6rem' }}>

        <h1>Welcome to Verdict</h1>
        <p>This website helps you analyze, store, and share your most important data.</p>

        <FeatureCarousel />
      </main>
      <div id="upload">
        <UploadSection />
      </div>
      <div id="history">
        <HistorySection user={user} />
      </div>

      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid gray',
        backgroundColor: '#0a0b10',
        color: 'white'
      }}>
        <h2>See What Others Are Building</h2>
        <p style={{ color: 'gray', marginBottom: '2rem' }}>Join the Verdict community to see live roasts, discover trending projects, and connect with other builders.</p>

        <Link to="/community" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            backgroundColor: '#c1004aff',
            color: 'black',
            border: 'none',
            borderRadius: '50px'
          }}>
            Enter Community →
          </button>
        </Link>
      </section>

    </div>
  );
}
