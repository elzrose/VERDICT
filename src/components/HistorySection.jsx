import { useState } from 'react';
import AuthModal from './AuthModal';

// Mock Database of Past Uploads
const mockHistoryData = [
    {
        id: 1,
        name: "Social Media Dashboard V1",
        date: "May 10, 2026",
        status: "Roast Complete",
        roastSummary: "A decent layout, but the color contrast is terrible and the UX is confusing."
    },
    {
        id: 2,
        name: "AI Crypto Trader MVP",
        date: "April 22, 2026",
        status: "Roast Complete",
        roastSummary: "Great backend logic, but the frontend looks like it was made in 1999."
    }
];

export default function HistorySection({ user }) {
    const isLoggedIn = !!user;
    const [selectedProject, setSelectedProject] = useState(null);
    const [isUploadingV2, setIsUploadingV2] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <section style={{ padding: '4rem 2rem', borderTop: '1px solid gray', position: 'relative' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Roast History</h2>

            {/* --- LOGGED OUT OVERLAY --- */}
            {!isLoggedIn && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ textShadow: '0 0 10px red' }}>Sign Up to save and view your progress!</h2>
                    <button onClick={() => setShowAuthModal(true)} style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '8px' }}>
                        Create an Account
                    </button>
                </div>
            )}

            {/* Render the modal if state is true */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

            {/* --- HISTORY GRID (Blurred if logged out) --- */}
            <div style={{
                display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center',
                filter: !isLoggedIn ? 'blur(8px)' : 'none',
                pointerEvents: !isLoggedIn ? 'none' : 'auto'
            }}>

                {/* If no project is selected, show the Grid of Tiles */}
                {!selectedProject ? (
                    mockHistoryData.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            style={{
                                border: '1px solid gray', borderRadius: '12px', padding: '1.5rem', width: '300px',
                                cursor: 'pointer', backgroundColor: '#111', transition: 'transform 0.2s'
                            }}
                        >
                            <h3 style={{ color: 'white' }}>{project.name}</h3>
                            <p style={{ color: 'gray', fontSize: '0.9rem' }}>{project.date}</p>
                            <p style={{ fontStyle: 'italic', marginTop: '1rem', color: 'white' }}>"{project.roastSummary}"</p>
                            <button style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}>View Full Roast</button>
                        </div>
                    ))
                ) : (

                    /* --- DETAILED ROAST VIEW & VERSION 2 UPLOAD --- */
                    <div style={{ border: '1px solid gray', padding: '2rem', width: '100%', maxWidth: '800px', backgroundColor: '#111', color: 'white' }}>
                        <button onClick={() => { setSelectedProject(null); setIsUploadingV2(false); }} style={{ marginBottom: '1rem' }}>← Back to History</button>

                        <h2>Full Roast: {selectedProject.name}</h2>
                        <p style={{ fontStyle: 'italic', color: 'gray' }}>Uploaded on {selectedProject.date}</p>

                        <div style={{ padding: '2rem', backgroundColor: '#222', borderRadius: '8px', margin: '2rem 0' }}>
                            <h3>AI Verdict:</h3>
                            <p>{selectedProject.roastSummary}</p>
                            <p>*(Imagine the detailed charts and scores here from the previous step!)*</p>
                        </div>

                        {/* Version 2 Flow */}
                        <hr style={{ borderColor: '#333' }} />
                        <h3 style={{ marginTop: '2rem' }}>Ready to improve?</h3>

                        {!isUploadingV2 ? (
                            <button
                                onClick={() => setIsUploadingV2(true)}
                                style={{ padding: '1rem', backgroundColor: '#00ffc8', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                Upload Version 2 (Compare Improvements)
                            </button>
                        ) : (
                            <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #00ffc8', borderRadius: '8px' }}>
                                <h4>Upload your V2 files:</h4>
                                <input type="file" style={{ display: 'block', margin: '1rem 0', color: 'white' }} />
                                <button onClick={() => alert("Comparing V1 to V2... Stand by for the new AI Verdict!")} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                                    Submit V2 for Comparison
                                </button>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </section>
    );
}
