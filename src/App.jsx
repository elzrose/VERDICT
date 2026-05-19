import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Community from './components/Community';
import './index.css';

// If not logged in, show a message instead of silently redirecting
function ProtectedRoute({ user, children }) {
  if (user === undefined) return null; // still loading

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#0a0b10', color: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', gap: '1.5rem', textAlign: 'center', padding: '2rem'
      }}>
        <h1 style={{ fontSize: '3rem', color: '#00ffc8' }}>🔒 Members Only</h1>
        <p style={{ color: 'gray', fontSize: '1.2rem', maxWidth: '400px' }}>
          You need to be signed in to visit the Community. Join the conversation — it's free!
        </p>
        <Navigate to="/home" state={{ openAuth: true }} replace />
      </div>
    );
  }

  return children;
}



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed. Current User:", currentUser?.email);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/community" element={
          <ProtectedRoute user={user}>
            <Community user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
