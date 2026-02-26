import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, MessageCircle, ArrowLeft, Calendar, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        api.get(`/vehicles/${id}`)
            .then(res => {
                setVehicle(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
        window.scrollTo(0, 0);
    }, [id]);

    const handleBooking = async () => {
        if (!user) return navigate('/login');
        if (!startDate || !endDate) return alert('Please select your preferred dates.');

        const bookingData = {
            user_id: user.id,
            vehicle_id: vehicle.id,
            start_time: startDate,
            end_time: endDate,
            total_price: vehicle.price_per_hr * 24 // Simple calculation for now
        };

        try {
            await api.post('/bookings', bookingData);
            alert('Your reservation request has been received. Our elite concierge will contact you shortly.');
            navigate('/dashboard');
        } catch (err) {
            alert('Service error. Please contact our support line.');
        }
    };

    if (loading) return (
        <div className="flex justify-center align-center" style={{ height: '80vh' }}>
            <div className="loader"></div>
        </div>
    );

    if (!vehicle) return (
        <div className="container mt-4 text-center">
            <h1 style={{ fontSize: '3rem' }}>Vehicle Not Found</h1>
            <button className="btn-primary mt-2" onClick={() => navigate('/')}>Return to Collection</button>
        </div>
    );

    return (
        <div className="vehicle-details animate-reveal" style={{ paddingBottom: '12rem', paddingTop: '2rem' }}>
            <div className="container">
                <button
                    onClick={() => navigate(-1)}
                    className="flex align-center gap-05 mb-3"
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', padding: 0 }}
                >
                    <ArrowLeft size={16} /> <span style={{ marginLeft: '0.5rem' }}>Back to Collection</span>
                </button>
            </div>

            <div className="container flex flex-col-mobile gap-4">
                <div style={{ flex: 1.8 }}>
                    <div style={{ position: 'relative', height: '100%', minHeight: '600px', maxHeight: '800px', overflow: 'hidden', borderRadius: '2px' }}>
                        <img
                            src={vehicle.image_url || 'https://via.placeholder.com/1200x800?text=Premium+Vehicle'}
                            alt={vehicle.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(5,5,5,0.8)', padding: '1rem 2rem', borderLeft: '3px solid var(--primary)' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Fleet No. {vehicle.id}</span>
                            <h2 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 400 }}>Reference Model</h2>
                        </div>
                    </div>

                    <div className="mt-4">
                        <header className="flex justify-between align-end mb-3">
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.4em' }}>
                                    Automotive Excellence
                                </span>
                                <h1 style={{ fontSize: '5.5rem', marginTop: '0.5rem', fontWeight: 500, lineHeight: 0.9, color: 'white' }}>{vehicle.name}</h1>
                            </div>
                            <div className="flex align-center gap-1 glass" style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderRadius: '2px' }}>
                                <MapPin size={20} className="text-gold" />
                                <span style={{ fontWeight: 600 }}>{vehicle.location}</span>
                            </div>
                        </header>

                        <div style={{ height: '3px', width: '80px', background: 'var(--primary)', marginBottom: '4rem' }}></div>

                        <div className="grid-listing" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem', padding: '0 0 4rem 0' }}>
                            <FeatureItem
                                icon={<ShieldCheck size={28} />}
                                title="Bespoke Insurance"
                                description="Comprehensive platinum coverage tailored for elite journeys."
                            />
                            <FeatureItem
                                icon={<Zap size={28} />}
                                title="Priority Service"
                                description="Immediate concierge verification and automated processing."
                            />
                            <FeatureItem
                                icon={<MapPin size={28} />}
                                title="Premium Location"
                                description="Available for collection at our exclusive city hubs."
                            />
                        </div>

                        <div className="glass p-3 mb-4" style={{ borderRadius: '2px', borderLeft: '4px solid var(--primary)' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 500 }}>Technical <span className="text-gold">Specifications</span></h3>
                            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '2', fontWeight: 300 }}>
                                {vehicle.description || 'This meticulously maintained masterpiece represents the absolute pinnacle of automotive engineering and craftsmanship. Experience unparalleled comfort and performance as you command the road in unrivaled style. Every detail has been curated to ensure a world-class journey from departure to destination.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div className="card glass" style={{ position: 'sticky', top: '120px', padding: '3.5rem', borderRadius: '4px', border: '1px solid var(--primary)' }}>
                        <div className="mb-4">
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>Private Reservation</span>
                            <div className="flex align-end gap-05 mt-1">
                                <h2 style={{ fontSize: '3.5rem', fontWeight: 500, lineHeight: 1 }}>₹{vehicle.price_per_hr.toLocaleString()}</h2>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '1px', marginBottom: '0.5rem' }}>/ HOUR</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-3">
                            <div className="booking-field">
                                <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Commencement</label>
                                <input
                                    type="datetime-local"
                                    className="glass"
                                    style={{ width: '100%', padding: '1.25rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>

                            <div className="booking-field">
                                <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Conclusion</label>
                                <input
                                    type="datetime-local"
                                    className="glass"
                                    style={{ width: '100%', padding: '1.25rem', border: '1px solid var(--border)', color: 'white', borderRadius: '2px' }}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <button onClick={handleBooking} className="btn-primary" style={{ width: '100%', height: '70px', fontSize: '0.8rem', transition: 'var(--transition-smooth)' }}>
                            REQUEST ACCESS <ArrowRight size={18} style={{ marginLeft: '1rem' }} />
                        </button>

                        <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                            <a
                                href={`https://wa.me/1234567890?text=Hi, I am interested in booking the ${vehicle.name}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex align-center justify-center gap-1"
                                style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}
                            >
                                <MessageCircle size={20} className="text-gold" /> CONTACT CONCIERGE
                            </a>
                        </div>
                    </div>
                </div>
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
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @media (max-width: 1024px) {
                    .flex-col-mobile { flex-direction: column; }
                    h1 { font-size: 3.5rem !important; }
                }
            `}</style>
        </div>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <div className="flex align-start gap-1">
        <div className="p-1" style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--primary)', borderRadius: '2px' }}>
            {icon}
        </div>
        <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 500, color: 'white' }}>{title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{description}</p>
        </div>
    </div>
);


export default VehicleDetails;
