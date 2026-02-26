import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Edit, Trash, ToggleLeft, ToggleRight, Search, MapPin, Tag } from 'lucide-react';
import VehicleModal from '../components/VehicleModal';

const AdminVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this vehicle? This action cannot be undone.')) {
            await api.delete(`/vehicles/${id}`);
            fetchVehicles();
        }
    };

    const handleToggle = async (id) => {
        await api.patch(`/vehicles/${id}/toggle`);
        fetchVehicles();
    };

    const handleEdit = (vehicle) => {
        setCurrentVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentVehicle(null);
        setIsModalOpen(true);
    };

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-reveal">
            <header className="flex justify-between align-center mb-3">
                <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Fleet Management</span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', fontWeight: 500 }}>Luxury <span style={{ color: 'var(--primary)' }}>Collection</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>Manage your high-end vehicle inventory and availability.</p>
                </div>
                <button onClick={handleAdd} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '0.7rem' }}>
                    <Plus size={18} /> Add Vehicle
                </button>
            </header>

            <div className="card glass mb-2 flex align-center p-1 gap-1" style={{ border: '1px solid var(--border)' }}>
                <Search size={20} color="var(--primary)" style={{ marginLeft: '0.5rem' }} />
                <input
                    type="text"
                    placeholder="Search by name, brand, or location..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '1rem',
                        color: 'white',
                        padding: '0.5rem'
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '0 1rem' }}>Vehicle</th>
                                <th style={{ padding: '0 1rem' }}>Category</th>
                                <th style={{ padding: '0 1rem' }}>Investment/hr</th>
                                <th style={{ padding: '0 1rem' }}>Location</th>
                                <th style={{ padding: '0 1rem' }}>Status</th>
                                <th style={{ padding: '0 1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVehicles.map(v => (
                                <tr key={v.id} style={{ background: 'rgba(255,255,255,0.02)', transition: 'var(--transition-fast)' }}>
                                    <td style={{ padding: '1.25rem 1rem', borderLeft: '2px solid var(--primary)' }}>
                                        <div className="flex align-center gap-1">
                                            <div style={{ width: '80px', height: '50px', borderRadius: '4px', overflow: 'hidden' }}>
                                                <img
                                                    src={v.image_url || 'https://via.placeholder.com/1200x800?text=Premium+Vehicle'}
                                                    alt={v.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{v.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>{v.type}</td>
                                    <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>₹{v.price_per_hr.toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <div className="flex align-center gap-05" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            <MapPin size={14} className="text-gold" /> {v.location}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem' }}>
                                        <button
                                            onClick={() => handleToggle(v.id)}
                                            className="flex align-center gap-05"
                                            style={{
                                                background: v.availability ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                color: v.availability ? 'var(--success)' : 'var(--error)',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '2px',
                                                border: '1px solid currentColor',
                                                cursor: 'pointer',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            {v.availability ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                            <span>{v.availability ? 'Available' : 'Reserved'}</span>
                                        </button>
                                    </td>
                                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                        <div className="flex gap-05 justify-end">
                                            <button
                                                onClick={() => handleEdit(v)}
                                                className="btn-ghost"
                                                title="Edit"
                                                style={{ color: 'var(--primary)', padding: '0.5rem' }}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v.id)}
                                                className="btn-ghost"
                                                title="Delete"
                                                style={{ color: 'var(--error)', padding: '0.5rem' }}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <VehicleModal
                    vehicle={currentVehicle}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchVehicles}
                />
            )}
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
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default AdminVehicles;
