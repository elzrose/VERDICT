import { useState } from 'react';
import { loginWithGoogle, registerWithEmail, loginWithEmail } from '../firebase';

export default function AuthModal({ onClose }) {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoginView) {
            await loginWithEmail(email, password);
        } else {
            await registerWithEmail(email, password);
        }
        onClose(); // Close modal after success
    };

    const handleGoogle = async () => {
        await loginWithGoogle();
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
            <div style={{
                backgroundColor: '#111', padding: '2rem', borderRadius: '12px',
                width: '400px', border: '1px solid #333', color: 'white'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, color: '#ff004cff' }}>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'gray', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: 'white' }}
                        required
                    />
                    <button type="submit" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#ff004cff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isLoginView ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', margin: '1rem 0', color: 'gray' }}>or</div>

                <button onClick={handleGoogle} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: 'white', color: 'black', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                    Continue with Google
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'gray', fontSize: '0.9rem' }}>
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLoginView(!isLoginView)} style={{ color: '#00ffc8', cursor: 'pointer', textDecoration: 'underline' }}>
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </span>
                </p>
            </div>
        </div>
    );
}
