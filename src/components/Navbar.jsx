import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
            <div className="logo">
                <h2>VERDICT</h2>
            </div>
            <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span
                    onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Upload
                </span>

                <Link to="/history">History</Link>
                <Link to="/community">Community</Link>
                <button>Sign Up</button>
            </div>

        </nav>
    );
} 