import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '1rem 2rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(10, 11, 16, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="logo">
                <h2>VERDICT</h2>
            </div>
            <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span
                    onClick={() => document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Home
                </span>
                <span
                    onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Upload
                </span>

                <span
                    onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                    History
                </span>
                <a href="/community">Community</a>
                <button>Sign Up</button>
            </div>

        </nav>
    );
} 