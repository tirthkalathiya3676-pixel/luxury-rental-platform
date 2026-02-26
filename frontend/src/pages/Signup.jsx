import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="auth-container" style={{ background: 'radial-gradient(circle at bottom left, rgba(197, 160, 89, 0.05) 0%, #050505 50%)' }}>
            <div className="card glass-premium p-4 animate-reveal" style={{ width: '100%', maxWidth: '450px', borderRadius: '4px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>Join the Collection</span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 400 }}>Create <span className="text-gold">Account</span></h2>
                </div>

                {error && <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--error)',
                    padding: '1rem',
                    borderRadius: '2px',
                    marginBottom: '2rem',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Full Name</label>
                        <input
                            type="text"
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '2px',
                                fontSize: '1rem',
                                color: 'white'
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="John Doe"
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Email Address</label>
                        <input
                            type="email"
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '2px',
                                fontSize: '1rem',
                                color: 'white'
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                        />
                    </div>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Secure Password</label>
                        <input
                            type="password"
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '1.1rem',
                                border: '1px solid var(--border)',
                                borderRadius: '2px',
                                fontSize: '1rem',
                                color: 'white'
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '60px' }}>
                        INITIALIZE MEMBERSHIP
                    </button>
                </form>

                <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '0.5rem' }}>SIGN IN</Link>
                </p>
            </div>
            <style jsx>{`
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default Signup;
