import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Community from './components/Community';
import './index.css';

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
        <Route path="/community" element={<Community user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
