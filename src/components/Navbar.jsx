import { Link } from "react-router-dom";
import { auth } from '../firebase';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);
    const handleSignOut = () => {
        signOut(auth).then(() => {
            alert("Signed out successfully!");
        });
    };
    return (
        <>
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
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: '#00ffc8', fontWeight: 'bold' }}></span>
                            <button onClick={handleSignOut} style={{ cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ff004cff', backgroundColor: 'transparent', color: '#ff004cff', fontWeight: 'bold' }}>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: '#00ffc8', color: 'black', fontWeight: 'bold' }}>
                            Sign Up / Log In
                        </button>
                    )}

                </div>
            </nav>

            {/* Render the modal if state is true */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </>
    );
}