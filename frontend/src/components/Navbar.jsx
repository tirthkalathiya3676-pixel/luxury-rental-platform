import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, User, LogOut, Menu, ArrowRight } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

const Navbar = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`flex align-center ${isScrolled ? 'glass' : ''}`}
            style={{
                height: isScrolled ? '80px' : '110px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                transition: 'var(--transition-smooth)',
                backgroundColor: isScrolled ? 'rgba(5,5,5,0.98)' : 'transparent',
                borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
                padding: '0 4rem'
            }}
        >
            <div className="container flex justify-between align-center" style={{ width: '100%', maxWidth: '1400px', padding: 0 }}>
                <Link to="/" className="flex align-center gap-1" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'var(--primary)',
                        color: '#000',
                        padding: '0.4rem',
                        borderRadius: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Car size={22} weight="bold" />
                    </div>
                    <span style={{
                        letterSpacing: '5px',
                        color: 'white',
                        textTransform: 'uppercase',
                        fontSize: '1.25rem',
                        fontWeight: 300,
                        fontFamily: 'var(--font-heading)'
                    }}>
                        {tenant?.name?.split(' ')[0] || ''}<span style={{ fontWeight: 700, color: 'var(--primary)' }}>{tenant?.name?.split(' ').slice(1).join('') || ''}</span>
                    </span>
                </Link>

                <div className="flex align-center gap-4">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>FLEET</Link>
                    {user ? (
                        <div className="flex align-center gap-3">
                            <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className={`nav-link ${isActive('/admin') || isActive('/dashboard') ? 'active' : ''}`}>
                                {user.role === 'admin' ? 'CONSOLE' : 'CONCIERGE'}
                            </Link>
                            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                            <button onClick={handleLogout} className="flex align-center gap-05" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', transition: 'var(--transition-fast)' }}>
                                SIGN OUT <LogOut size={14} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '0.75rem', borderRadius: '2px' }}>
                            SIGN IN <ArrowRight size={16} style={{ marginLeft: '0.75rem' }} />
                        </Link>
                    )}
                </div>
            </div>
            <style jsx>{`
                .nav-link {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.3em;
                    color: rgba(255,255,255,0.4);
                    transition: var(--transition-smooth);
                    position: relative;
                    text-decoration: none;
                }
                .nav-link:hover, .nav-link.active {
                    color: white;
                }
                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 40%;
                    height: 1px;
                    background: var(--primary);
                    transition: var(--transition-smooth);
                }
                .nav-link:hover::after {
                    width: 100%;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
