import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Shield, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/users')
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="animate-reveal">
            <header className="mb-3">
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Community</span>
                <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 500 }}>Client <span style={{ color: 'var(--primary)' }}>Base</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Manage registered users, roles, and platform access.</p>
            </header>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '0 1rem' }}>Client</th>
                                <th style={{ padding: '0 1rem' }}>Email Address</th>
                                <th style={{ padding: '0 1rem' }}>Security Role</th>
                                <th style={{ padding: '0 1rem', textAlign: 'right' }}>Client ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'var(--transition-fast)' }}>
                                    <td style={{ padding: '1.25rem 1rem', borderLeft: '2px solid var(--primary)' }}>
                                        <div className="flex align-center gap-1">
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '2px',
                                                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--primary)',
                                                border: '1px solid rgba(197, 160, 89, 0.2)'
                                            }}>
                                                <User size={18} />
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div className="flex align-center gap-05" style={{ color: 'var(--text-muted)' }}>
                                            <Mail size={14} className="text-gold" /> {u.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div className="flex align-center gap-05" style={{
                                            color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: u.role === 'admin' ? 700 : 400,
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px'
                                        }}>
                                            {u.role === 'admin' ? <ShieldCheck size={16} /> : <Shield size={16} />}
                                            <span>{u.role}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'right' }}>#{u.id}</td>
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

export default AdminUsers;
