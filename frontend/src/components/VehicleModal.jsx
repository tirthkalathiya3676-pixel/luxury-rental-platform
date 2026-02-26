import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const VehicleModal = ({ vehicle, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'car',
        price_per_hr: '',
        location: '',
        image_url: '',
        description: '',
        availability: 1
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
        }
    }, [vehicle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (vehicle) {
                await api.put(`/vehicles/${vehicle.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/vehicles', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSave();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="card glass animate-reveal" style={{ width: '100%', maxWidth: '700px', border: '1px solid var(--primary)', padding: 0, overflow: 'hidden' }}>
                <div className="p-2 flex justify-between align-center" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Fleet Database</span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 500, marginTop: '0.25rem' }}>
                            {vehicle ? 'Edit Collection Item' : 'Add New Masterpiece'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="btn-ghost" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-3">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        <div className="flex flex-col gap-05">
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Vehicle Designation</label>
                            <input
                                className="glass"
                                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g. Rolls-Royce Phantom"
                            />
                        </div>
                        <div className="flex flex-col gap-05">
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Classification</label>
                            <select
                                className="glass"
                                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px', appearance: 'none' }}
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="car" style={{ background: '#111' }}>Luxury Car</option>
                                <option value="bike" style={{ background: '#111' }}>Premium Bike</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-05">
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Investment per Hour (₹)</label>
                            <input
                                type="number"
                                className="glass"
                                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                value={formData.price_per_hr}
                                onChange={e => setFormData({ ...formData, price_per_hr: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-05">
                            <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location Hub</label>
                            <input
                                className="glass"
                                style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="e.g. South Mumbai"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-05 mb-2">
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Visual Asset</label>
                        <div className="flex gap-1 align-center">
                            <input
                                type="file"
                                id="vehicle-image"
                                style={{ display: 'none' }}
                                onChange={e => setImageFile(e.target.files[0])}
                                accept="image/*"
                            />
                            <label htmlFor="vehicle-image" className="glass flex align-center gap-1" style={{ cursor: 'pointer', flex: 1, padding: '1rem', border: '1px dashed var(--primary)', textAlign: 'center', justifyContent: 'center' }}>
                                <Upload size={18} className="text-gold" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{imageFile ? imageFile.name : 'Upload High-Res Image'}</span>
                            </label>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.5 }}>OR</span>
                            <input
                                className="glass"
                                style={{ flex: 1.5, padding: '1rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="Direct Image URL"
                            />
                        </div>
                    </div>

                    {(imageFile || formData.image_url) && (
                        <div className="mb-2">
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                                alt="Preview"
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--border)' }}
                                onError={(e) => { if (!imageFile) e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Asset+URL' }}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-05 mb-3">
                        <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Experience Description</label>
                        <textarea
                            className="glass"
                            style={{ width: '100%', padding: '1rem', minHeight: '100px', fontFamily: 'inherit', color: 'white', border: '1px solid var(--border)', borderRadius: '2px', resize: 'vertical' }}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the unique luxury and performance characteristics..."
                        />
                    </div>

                    <div className="flex justify-end gap-1.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                        <button type="button" onClick={onClose} className="btn-ghost" style={{ padding: '1rem 2rem', fontSize: '0.8rem', letterSpacing: '1px' }}>CANCEL</button>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '0.8rem', letterSpacing: '1px' }}>
                            {loading ? 'PROCESSING...' : (vehicle ? 'UPDATE ASSET' : 'PUBLISH MASTERPIECE')}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default VehicleModal;
