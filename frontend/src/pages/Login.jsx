import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container" style={{ background: 'radial-gradient(circle at top right, rgba(197, 160, 89, 0.05) 0%, #050505 50%)' }}>
            <div className="card glass-premium p-4 animate-reveal" style={{ width: '100%', maxWidth: '450px', borderRadius: '4px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>Secure Access</span>
                    <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 400 }}>Welcome <span className="text-gold">Back</span></h2>
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
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Member Email</label>
                        <input
                            type="email"
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '1.25rem',
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
                    <div style={{ marginBottom: '3rem' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Private Password</label>
                        <input
                            type="password"
                            className="glass"
                            style={{
                                width: '100%',
                                padding: '1.25rem',
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
                        AUTHORIZE ACCESS
                    </button>
                </form>

                <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    New to the collection? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginLeft: '0.5rem' }}>CREATE ACCOUNT</Link>
                </p>
            </div>
            <style jsx>{`
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default Login;
