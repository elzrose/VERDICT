import { Link } from "react-router-dom";
import { useState } from 'react';

export default function Community() {
    // State to track which sidebar tab is active
    const [activeTab, setActiveTab] = useState('Home');

    // State for posts to allow interactivity (like reactions)
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "CodeNinja99",
            projectName: "TaskMaster Pro",
            content: "This is my MVP for my new app called TaskMaster Pro. It is a task management app that helps you stay organized and on top of your tasks. It has a simple and user-friendly interface that makes it easy to use. It also has a variety of features that help you stay organized and on top of your tasks.",
            stage: "MVP",
            score: 8.5,
            roastSnippet: "Verdict AI: 'A solid attempt, but your color palette is aggressive enough to wake the dead.'",
            reactions: 142,
            hasReacted: false,
            comments: 34,
            date: "2 hours ago"
        },
        {
            id: 2,
            author: "DesignGuru",
            projectName: "Zenith UI Kit",
            content: "This is my UI design for my new app called Zenith UI Kit. It is a UI kit that helps you create beautiful and user-friendly interfaces. It has a simple and user-friendly interface that makes it easy to use. It also has a variety of features that help you create beautiful and user-friendly interfaces.",
            stage: "UI/UX",
            score: 9.2,
            roastSnippet: "Verdict AI: 'Beautifully crafted. If only your backend existed.'",
            reactions: 89,
            hasReacted: false,
            comments: 12,
            date: "5 hours ago"
        }
    ]);

    // Function to handle reactions
    const toggleReaction = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    reactions: post.hasReacted ? post.reactions - 1 : post.reactions + 1,
                    hasReacted: !post.hasReacted
                };
            }
            return post;
        }));
    };

    // Mock User Profile Data
    const mockUserProfile = {
        username: "CodeNinja99",
        averageScore: 8.7,
        badges: ["Top 10% Frontend", "Roast Survivor", "Early Adopter"],
        uploads: [posts[0]] // Reference to TaskMaster Pro
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0b10', color: 'white' }}>

            {/* ======================================= */}
            {/* 1. FIXED LEFT SIDEBAR                     */}
            {/* ======================================= */}
            <aside style={{
                width: '250px',
                borderRight: '1px solid #333',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                {/* Back to Home Link */}
                <Link to="/home" style={{ color: '#00ffc8', textDecoration: 'none', fontWeight: 'bold', marginBottom: '2rem' }}>
                    ← Back to Verdict
                </Link>

                <h2>Community</h2>

                {/* Sidebar Navigation */}
                {['Home', 'Trending', 'Leaderboards', 'Following', 'Vault'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem',
                            textAlign: 'left',
                            backgroundColor: activeTab === tab ? '#333' : 'transparent',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </aside>

            {/* ======================================= */}
            {/* 2. MAIN CENTER AREA                       */}
            {/* ======================================= */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* TOP BAR (Search, Alerts, Profile) */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 2rem',
                    borderBottom: '1px solid #333',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(10, 11, 16, 0.9)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 10
                }}>
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search projects, tags, verdicts..."
                        style={{ padding: '0.5rem 1rem', width: '300px', borderRadius: '20px', border: '1px solid #555', backgroundColor: '#111', color: 'white' }}
                    />

                    {/* Right side icons */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: 'white' }}>🔔 Alerts</button>
                        <button
                            onClick={() => setActiveTab('Profile')}
                            style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'Profile' ? '#00ffc8' : '#333', color: activeTab === 'Profile' ? 'black' : 'white' }}
                        >
                            👤 Profile
                        </button>
                    </div>
                </header>

                {/* FEED CONTENT */}
                <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                    <h2 style={{ marginBottom: '2rem' }}>{activeTab}</h2>

                    {/* conditionally render based on the active tab */}
                    {(activeTab === 'Home' || activeTab === 'Trending' || activeTab === 'Following') && (
                        <div>
                            {posts.map((post) => (
                                <div key={post.id} style={{
                                    border: '1px solid #333',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem',
                                    backgroundColor: '#111'
                                }}>

                                    {/* Post Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: '#ff004cff' }}>{post.projectName}</h3>

                                            <button style={{ padding: '0.2rem 1rem', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px' }}>
                                                FOLLOW
                                            </button>

                                            <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>{post.content}</p>
                                            <h3 style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>by {post.author} • {post.date}</h3>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ backgroundColor: '#333', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.5rem', marginRight: '0.3rem' }}>{post.stage}</span>
                                            <span style={{ fontWeight: 'bold', color: post.score >= 8 ? 'green' : 'orange' }}>Score: {post.score}/10</span>
                                        </div>
                                    </div>

                                    {/* AI Roast Snippet */}
                                    < div style={{ padding: '1rem', backgroundColor: '#222', borderRadius: '8px', borderLeft: '4px solid #c1004aff', fontStyle: 'italic' }}>
                                        {post.roastSnippet}
                                    </div>

                                    {/* Interactions Footer */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => toggleReaction(post.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: post.hasReacted ? '#00ffc8' : 'gray',
                                                    fontWeight: post.hasReacted ? 'bold' : 'normal'
                                                }}
                                            >
                                                🔥 {post.reactions}
                                            </button>
                                            <button style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'gray' }}>💬 {post.comments}</button>
                                        </div>
                                        <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px' }}>
                                            View Full Verdict
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Leaderboards' && (
                        <div style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ff004cff' }}>🏆 Top Rated Projects This Week</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li style={{ padding: '1rem 0', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>1. Zenith UI Kit</span> <span style={{ color: 'green', fontWeight: 'bold' }}>9.2 / 10</span>
                                </li>
                                <li style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>2. TaskMaster Pro</span> <span style={{ color: 'green', fontWeight: 'bold' }}>8.5 / 10</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'Vault' && (
                        <div style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
                            <h3>🔒 Your Private Vault</h3>
                            <p style={{ color: 'gray' }}>You haven't saved any community roasts yet.</p>
                        </div>
                    )}

                    {activeTab === 'Profile' && (
                        <div style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                            <h2 style={{ color: '#00ffc8', margin: 0 }}>👤 {mockUserProfile.username}'s Profile</h2>
                            <p style={{ color: 'gray', marginTop: '0.5rem' }}>Joined May 2026</p>

                            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                                <div style={{ flex: 1, backgroundColor: '#222', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444' }}>
                                    <h3 style={{ color: 'gray', margin: 0 }}>Avg Project Score</h3>
                                    <h1 style={{ color: 'green', fontSize: '3.5rem', margin: '0.5rem 0' }}>{mockUserProfile.averageScore}</h1>
                                </div>
                                <div style={{ flex: 2, backgroundColor: '#222', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444' }}>
                                    <h3 style={{ color: 'gray', margin: 0 }}>Badges & Achievements</h3>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                                        {mockUserProfile.badges.map(b => (
                                            <span key={b} style={{ backgroundColor: '#c1004aff', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>🏅 {b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '3rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Past Uploads</h3>
                            <div style={{ marginTop: '1rem' }}>
                                {mockUserProfile.uploads.map(post => (
                                    <div key={post.id} style={{ padding: '1rem', backgroundColor: '#222', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid #00ffc8' }}>
                                        <h4 style={{ margin: 0 }}>{post.projectName} <span style={{ color: 'gray', fontWeight: 'normal', fontSize: '0.8rem' }}>({post.stage})</span></h4>
                                        <p style={{ margin: '0.5rem 0 0 0', color: 'gray' }}>Score: {post.score}/10</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div >
            </main >

        </div >
    );
}
