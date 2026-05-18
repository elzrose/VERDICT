import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';


export default function Community() {
    const [activeTab, setActiveTab] = useState('Home');
    const [posts, setPosts] = useState([]);

    // User specific state for follows and saves
    const [userData, setUserData] = useState({ following: [], savedPosts: [] });

    // 1. Fetch live posts
    useEffect(() => {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const livePosts = [];
            snapshot.forEach((doc) => {
                livePosts.push({ id: doc.id, ...doc.data() });
            });
            setPosts(livePosts);
        });
        return () => unsubscribe();
    }, []);

    // 2. Fetch user's following & saved posts
    useEffect(() => {
        const fetchUserData = async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                } else {
                    await setDoc(userRef, { following: [], savedPosts: [] });
                }
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            fetchUserData(user);
        });
        return () => unsubscribe();
    }, []);


    // Handle Likes
    const toggleReaction = async (post) => {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, {
            reactions: post.hasReacted ? post.reactions - 1 : post.reactions + 1,
            hasReacted: !post.hasReacted
        });
    };

    // Handle Follow
    const handleFollow = async (authorName) => {
        if (!auth.currentUser) return alert("You must be logged in to follow users!");
        if (authorName === auth.currentUser.displayName || authorName === auth.currentUser.email) {
            return alert("You cannot follow yourself!");
        }
        const isFollowing = userData.following.includes(authorName);
        const newFollowing = isFollowing
            ? userData.following.filter(name => name !== authorName)
            : [...userData.following, authorName];

        // Optimistic UI update
        setUserData({ ...userData, following: newFollowing });

        // Save to DB
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { following: newFollowing });
    };

    // Handle Save to Vault
    const handleSave = async (postId) => {
        if (!auth.currentUser) return alert("You must be logged in to save posts!");

        const isSaved = userData.savedPosts.includes(postId);
        const newSaved = isSaved
            ? userData.savedPosts.filter(id => id !== postId)
            : [...userData.savedPosts, postId];

        // Optimistic UI update
        setUserData({ ...userData, savedPosts: newSaved });

        // Save to DB
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { savedPosts: newSaved });
    };

    // Filter Posts based on Tabs
    let displayedPosts = posts;
    if (activeTab === 'Following') {
        displayedPosts = posts.filter(post => userData.following.includes(post.author));
    } else if (activeTab === 'Vault') {
        displayedPosts = posts.filter(post => userData.savedPosts.includes(post.id));
    } else if (activeTab === 'Trending') {
        // Sort by most reactions
        displayedPosts = [...posts].sort((a, b) => (b.reactions || 0) - (a.reactions || 0));
    }

    // Leaderboard logic (Top 10 highest scores of all time)
    const topPosts = [...posts].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10);

    const mockUserProfile = {
        username: auth.currentUser?.displayName || "User",
        averageScore: 8.7,
        badges: ["Top 10% Frontend", "Roast Survivor", "Early Adopter"],
        uploads: []
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0b10', color: 'white' }}>

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
                <Link to="/home" style={{ color: '#00ffc8', textDecoration: 'none', fontWeight: 'bold', marginBottom: '2rem' }}>
                    ← Back to Verdict
                </Link>

                <h2>Community</h2>

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


            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

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
                    <input
                        type="text"
                        placeholder="Search projects, tags, verdicts..."
                        style={{ padding: '0.5rem 1rem', width: '300px', borderRadius: '20px', border: '1px solid #555', backgroundColor: '#111', color: 'white' }}
                    />

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

                <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                    <h2 style={{ marginBottom: '2rem' }}>{activeTab}</h2>

                    {/* RENDER POSTS for Home, Trending, Following, Vault */}
                    {['Home', 'Trending', 'Following', 'Vault'].includes(activeTab) && (
                        <div>
                            {displayedPosts.length === 0 ? (
                                <p style={{ color: 'gray', textAlign: 'center', marginTop: '3rem' }}>No posts found here yet.</p>
                            ) : (
                                displayedPosts.map((post) => (
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

                                                {post.author !== (auth.currentUser?.displayName || auth.currentUser?.email) && (
                                                    <button
                                                        onClick={() => handleFollow(post.author)}
                                                        style={{
                                                            padding: '0.2rem 1rem', cursor: 'pointer',
                                                            backgroundColor: userData.following.includes(post.author) ? '#00ffc8' : '#333',
                                                            color: userData.following.includes(post.author) ? 'black' : 'white',
                                                            border: 'none', borderRadius: '6px', marginTop: '0.5rem', marginBottom: '0.5rem'
                                                        }}>
                                                        {userData.following.includes(post.author) ? 'FOLLOWING' : 'FOLLOW'}
                                                    </button>
                                                )}


                                                <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>{post.content}</p>
                                                <h3 style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>by {post.author} • {post.date}</h3>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ backgroundColor: '#333', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.5rem', marginRight: '0.3rem' }}>{post.stage}</span>
                                                <span style={{ fontWeight: 'bold', color: post.score >= 8 ? '#00ffc8' : post.score >= 5 ? 'orange' : '#ff004cff' }}>Score: {post.score}/10</span>
                                            </div>
                                        </div>

                                        {/* AI Roast Snippet */}
                                        <div style={{ padding: '1rem', backgroundColor: '#222', borderRadius: '8px', borderLeft: '4px solid #c1004aff', fontStyle: 'italic' }}>
                                            {post.roastSnippet}
                                        </div>

                                        {/* Interactions Footer */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button
                                                    onClick={() => toggleReaction(post)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        background: 'none',
                                                        border: 'none',
                                                        color: post.hasReacted ? '#00ffc8' : 'gray',
                                                        fontWeight: post.hasReacted ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    🔥 {post.reactions || 0}
                                                </button>
                                                <button style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'gray' }}>💬 {post.comments || 0}</button>
                                            </div>

                                            <div>
                                                <button style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '6px' }}>
                                                    View Full Verdict
                                                </button>
                                                <button
                                                    onClick={() => handleSave(post.id)}
                                                    style={{
                                                        padding: '0.5rem 1rem', cursor: 'pointer', marginLeft: '0.5rem',
                                                        backgroundColor: userData.savedPosts.includes(post.id) ? '#ff004cff' : '#333',
                                                        color: 'white', border: 'none', borderRadius: '6px'
                                                    }}>
                                                    {userData.savedPosts.includes(post.id) ? '🔖 SAVED' : '🔖 SAVE'}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* LEADERBOARDS */}
                    {activeTab === 'Leaderboards' && (
                        <div style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ff004cff' }}>🏆 Top 10 Rated Projects</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {topPosts.length === 0 ? (
                                    <p style={{ color: 'gray' }}>No projects rated yet.</p>
                                ) : (
                                    topPosts.map((post, index) => (
                                        <li key={post.id} style={{ padding: '1rem 0', borderBottom: index === topPosts.length - 1 ? 'none' : '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>
                                                <strong>{index + 1}. {post.projectName}</strong> <span style={{ color: 'gray', fontSize: '0.9rem' }}>by {post.author}</span>
                                            </span>
                                            <span style={{ color: post.score >= 8 ? '#00ffc8' : post.score >= 5 ? 'orange' : '#ff004cff', fontWeight: 'bold' }}>
                                                {post.score} / 10
                                            </span>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )}

                    {/* PROFILE */}
                    {activeTab === 'Profile' && (
                        <div style={{ padding: '2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                            <h2 style={{ color: '#00ffc8', margin: 0 }}>👤 {mockUserProfile.username}'s Profile</h2>
                            <p style={{ color: 'gray', marginTop: '0.5rem' }}>Joined May 2026</p>

                            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                                <div style={{ flex: 1, backgroundColor: '#222', padding: '1.5rem', borderRadius: '8px', border: '1px solid #444' }}>
                                    <h3 style={{ color: 'gray', margin: 0 }}>Avg Project Score</h3>
                                    <h1 style={{ color: '#00ffc8', fontSize: '3.5rem', margin: '0.5rem 0' }}>{mockUserProfile.averageScore}</h1>
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
                        </div>
                    )}

                </div >
            </main >

        </div >
    );
}
