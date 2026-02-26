import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Car, BookOpen, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="card stat-card glass" style={{ borderLeft: `3px solid ${color}` }}>
        <div className="stat-icon" style={{ backgroundColor: bg, color: color }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 500, marginTop: '0.25rem' }}>{value}</h3>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        pending: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
        confirmed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
        cancelled: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' }
    };
    const current = styles[status] || styles.pending;

    return (
        <span style={{
            backgroundColor: current.bg,
            color: current.text,
            padding: '0.4rem 1rem',
            borderRadius: '2px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: `1px solid ${current.text}20`
        }}>
            {status}
        </span>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center align-center" style={{ height: '50vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="animate-reveal">
            <header style={{ marginBottom: '3rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Overview</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 500 }}>System <span style={{ color: 'var(--primary)' }}>Performance</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Real-time analytics and fleet management overview.</p>
            </header>

            <div className="stats-grid">
                <StatCard
                    label="Total Vehicles"
                    value={stats.totalVehicles}
                    icon={<Car size={20} />}
                    color="var(--primary)"
                    bg="rgba(197, 160, 89, 0.1)"
                />
                <StatCard
                    label="Total Bookings"
                    value={stats.totalBookings}
                    icon={<BookOpen size={20} />}
                    color="#10b981"
                    bg="rgba(16, 185, 129, 0.1)"
                />
                <StatCard
                    label="Active Users"
                    value={stats.totalUsers}
                    icon={<Users size={20} />}
                    color="#6366f1"
                    bg="rgba(99, 102, 241, 0.1)"
                />
                <StatCard
                    label="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign size={20} />}
                    color="#f59e0b"
                    bg="rgba(245, 158, 11, 0.1)"
                />
            </div>

            <section className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <div className="flex justify-between align-center mb-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Recent Activity</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>The latest 5 bookings across the entire fleet.</p>
                    </div>
                    <Link to="/admin/bookings" className="btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.7rem' }}>
                        View all <ArrowRight size={14} style={{ marginLeft: '0.5rem' }} />
                    </Link>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '0 1rem' }}>Vehicle</th>
                                <th style={{ padding: '0 1rem' }}>Client</th>
                                <th style={{ padding: '0 1rem' }}>Date</th>
                                <th style={{ padding: '0 1rem' }}>Investment</th>
                                <th style={{ padding: '0 1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentBookings.map(booking => (
                                <tr key={booking.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'var(--transition-fast)' }}>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 600, borderLeft: '2px solid var(--primary)' }}>{booking.vehicle_name}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{booking.user_name}</td>
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>
                                        {new Date(booking.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>₹{booking.total_price.toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <StatusBadge status={booking.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            <style jsx>{`
                .loader {
                    border: 3px solid var(--bg-secondary);
                    border-top: 3px solid var(--primary);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
