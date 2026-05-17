import { Link } from "react-router-dom";

export default function Community() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
            <Link to="/home">Home</Link>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
                <h1 style={{ fontSize: '4rem', textShadow: '0 0 20px #ff0048ff' }}>VERDICT COMMUNITY</h1>
                <p style={{ fontSize: '1.5rem', color: 'gray' }}>Coming Soon...</p>
            </div>
        </div>
    );
}
