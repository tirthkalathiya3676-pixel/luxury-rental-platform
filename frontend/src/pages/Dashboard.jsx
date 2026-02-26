import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Clock, CheckCircle, XCircle, Calendar, User, MapPin } from 'lucide-react';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            api.get(`/bookings/user/${user.id}`)
                .then(res => {
                    setBookings(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return { color: 'var(--success)', icon: <CheckCircle size={16} />, bg: 'rgba(16, 185, 129, 0.1)' };
            case 'cancelled': return { color: 'var(--error)', icon: <XCircle size={16} />, bg: 'rgba(239, 68, 68, 0.1)' };
            default: return { color: 'var(--primary)', icon: <Clock size={16} />, bg: 'rgba(197, 160, 89, 0.1)' };
        }
    };

    if (!user) return (
        <div className="auth-container">
            <div className="card glass p-3 text-center" style={{ maxWidth: '400px' }}>
                <User size={48} className="text-gold mb-1" />
                <h2 className="mb-1">Access Restricted</h2>
                <p style={{ color: 'var(--text-muted)' }}>Please sign in to your accounts to access your private concierge and reservations.</p>
                <button className="btn-primary mt-2" onClick={() => window.location.href = '/login'}>Sign In</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-page animate-reveal" style={{
            paddingBottom: '8rem',
            background: 'radial-gradient(circle at 0% 0%, rgba(197, 160, 89, 0.03) 0%, transparent 50%)'
        }}>
            <div className="container mt-4">
                <header className="mb-4" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '200px', height: '200px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}></div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>Member Sanctuary</span>
                    <h1 style={{ fontSize: '4.5rem', marginTop: '0.75rem', fontWeight: 500, lineHeight: 1 }}>Greetings, <span className="text-gold">{user.name}</span></h1>
                    <p style={{ color: 'var(--text-main)', opacity: 0.8, fontSize: '1.25rem', marginTop: '1.5rem', maxWidth: '800px', fontWeight: 300 }}>
                        Your curated portfolio of luxury experiences and upcoming private voyages.
                    </p>
                </header>

                <div className="grid-3-col mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    <div className="card glass-premium p-2 flex align-center gap-2" style={{ borderLeft: '3px solid var(--primary)', padding: '2.5rem' }}>
                        <div className="p-1-5" style={{ background: 'rgba(197, 160, 89, 0.1)', borderRadius: '2px', color: 'var(--primary)' }}>
                            <Calendar size={32} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Active Reservations</h4>
                            <p style={{ fontSize: '3rem', fontWeight: 500, marginTop: '0.25rem' }}>{bookings.filter(b => b.status === 'confirmed').length}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between align-end mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '3rem', fontWeight: 400 }}>Your <span className="text-gold">Journeys</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', letterSpacing: '1px' }}>CHRONICLES OF REFINEMENT</p>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{bookings.length} TOTAL ENTRIES</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-4"><div className="loader"></div></div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {bookings.length === 0 ? (
                            <div className="card glass p-5 text-center" style={{ border: '1px dashed var(--primary)', opacity: 0.8 }}>
                                <MapPin size={64} className="text-gold mb-2" style={{ opacity: 0.5 }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 400 }}>No Expeditions Logged</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>Begin your story by selecting a masterpiece from our exclusive collection.</p>
                                <button className="btn-primary mt-3" onClick={() => window.location.href = '/'}>VIEW COLLECTION</button>
                            </div>
                        ) : bookings.map(booking => {
                            const styles = getStatusStyles(booking.status);
                            return (
                                <div key={booking.id} className="card glass-premium flex align-center justify-between flex-col-mobile" style={{
                                    borderLeft: `4px solid ${styles.color}`,
                                    overflow: 'hidden',
                                    transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                                }}>
                                    <div className="flex align-center gap-3" style={{ flex: 1, padding: '2rem' }}>
                                        <div style={{ position: 'relative', width: '280px', height: '160px', borderRadius: '1px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                            <img
                                                src={booking.image_url || 'https://via.placeholder.com/1200x800?text=Premium+Vehicle'}
                                                alt={booking.vehicle_name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                                className="journey-img"
                                            />
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' }}></div>
                                        </div>
                                        <div>
                                            <div className="flex align-center gap-1 mb-1">
                                                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Log No. {booking.id}</span>
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }}></div>
                                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '1px' }}>{new Date(booking.start_time).getFullYear()}</span>
                                            </div>
                                            <h3 style={{ fontSize: '2.25rem', color: 'white', margin: '0.5rem 0', fontWeight: 400 }}>{booking.vehicle_name}</h3>
                                            <div className="flex align-center gap-2 mt-1-5" style={{ color: 'white', fontSize: '1rem', fontWeight: 300 }}>
                                                <div className="flex align-center gap-05">
                                                    <Calendar size={18} className="text-gold" />
                                                    <span>{new Date(booking.start_time).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex align-center gap-05">
                                                    <Clock size={18} className="text-gold" />
                                                    <span>{new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex align-center gap-4 flex-col-mobile justify-between-mobile" style={{
                                        padding: '2rem 4rem',
                                        background: 'rgba(255,255,255,0.01)',
                                        borderLeft: '1px solid var(--border)',
                                        textAlign: 'right',
                                        minWidth: '400px'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 700 }}>Capital Investment</p>
                                            <p style={{ fontSize: '2.25rem', fontWeight: 500, color: 'var(--primary)', marginTop: '0.5rem' }}>₹{booking.total_price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex align-center gap-1" style={{
                                            padding: '0.8rem 1.75rem',
                                            borderRadius: '1px',
                                            background: styles.bg,
                                            color: styles.color,
                                            fontWeight: 800,
                                            fontSize: '0.8rem',
                                            letterSpacing: '3px',
                                            textTransform: 'uppercase',
                                            border: `1px solid ${styles.color}30`,
                                            boxShadow: `0 4px 20px ${styles.color}15`
                                        }}>
                                            {styles.icon}
                                            <span>{booking.status}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <style jsx>{`
                .loader {
                    border: 3px solid var(--bg-secondary);
                    border-top: 3px solid var(--primary);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                .text-gold { color: var(--primary); }
                .gap-2 { gap: 2rem; }
                .mt-1-5 { margin-top: 1.5rem; }
                .p-1-5 { padding: 1.5rem; }
                .journey-img:hover { transform: scale(1.1); }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @media (max-width: 1024px) {
                    .flex-col-mobile { flex-direction: column; align-items: flex-start !important; text-align: left !important; }
                    .justify-between-mobile { justify-content: space-between; width: 100%; border-left: none !important; border-top: 1px solid var(--border); }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
