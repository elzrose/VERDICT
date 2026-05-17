import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Home from './pages/Home';
import Community from './components/Community';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
}

export default App;
