import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Check, X, Clock, Calendar } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        await api.patch(`/bookings/${id}`, { status });
        fetchBookings();
    };

    return (
        <div className="animate-reveal">
            <header className="mb-3">
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Reservations</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 500 }}>Booking <span style={{ color: 'var(--primary)' }}>Logs</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Review and manage all active and past customer reservations.</p>
            </header>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '0 1rem' }}>ID</th>
                                <th style={{ padding: '0 1rem' }}>Vehicle</th>
                                <th style={{ padding: '0 1rem' }}>Client</th>
                                <th style={{ padding: '0 1rem' }}>Duration</th>
                                <th style={{ padding: '0 1rem' }}>Investment</th>
                                <th style={{ padding: '0 1rem' }}>Status</th>
                                <th style={{ padding: '0 1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'var(--transition-fast)' }}>
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem', borderLeft: '2px solid var(--primary)' }}>#{b.id}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{b.vehicle_name}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>{b.user_name}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem' }}>
                                        <div className="flex align-center gap-05" style={{ color: 'var(--text-muted)' }}>
                                            <Calendar size={14} className="text-gold" />
                                            {new Date(b.start_time).toLocaleDateString()} — {new Date(b.end_time).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>₹{b.total_price.toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <StatusBadge status={b.status} />
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                        {b.status === 'pending' && (
                                            <div className="flex gap-05 justify-end">
                                                <button
                                                    onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                                    className="btn-ghost"
                                                    style={{ color: 'var(--success)', padding: '0.5rem' }}
                                                    title="Approve"
                                                >
                                                    <Check size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                                    className="btn-ghost"
                                                    style={{ color: 'var(--error)', padding: '0.5rem' }}
                                                    title="Reject"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style jsx>{`
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        pending: { bg: '#fffbeb', text: '#d97706', icon: <Clock size={12} /> },
        confirmed: { bg: '#ecfdf5', text: '#059669', icon: <Check size={12} /> },
        cancelled: { bg: '#fef2f2', text: '#dc2626', icon: <X size={12} /> }
    };
    const current = styles[status] || styles.pending;

    return (
        <span style={{
            backgroundColor: current.bg,
            color: current.text,
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem'
        }}>
            {current.icon}
            {status}
        </span>
    );
}

export default AdminBookings;
