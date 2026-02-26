import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    return (
        <div className="card glass animate-reveal" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '2px', transition: 'var(--transition-smooth)' }}>
            <div style={{ position: 'relative', overflow: 'hidden', height: '350px' }}>
                <img
                    src={vehicle.image_url || 'https://via.placeholder.com/600x400?text=Premium+Vehicle'}
                    alt={vehicle.name}
                    className="card-img"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(5,5,5,0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2px',
                    borderLeft: '3px solid var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: 'white'
                }}>
                    <span style={{ color: 'var(--primary)', marginRight: '0.25rem' }}>₹</span>{vehicle.price_per_hr.toLocaleString()}<span style={{ fontSize: '0.6rem', opacity: 0.6, marginLeft: '0.25rem' }}>/HR</span>
                </div>
            </div>
            <div className="p-3" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3.5rem' }}>
                <div className="flex align-center gap-1 mb-1">
                    <span style={{ height: '1px', width: '20px', background: 'var(--primary)' }}></span>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.3em' }}>
                        {vehicle.type}
                    </span>
                </div>
                <h3 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', fontWeight: 400, lineHeight: 1.1 }}>{vehicle.name}</h3>

                <div className="flex align-center gap-05" style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    <MapPin size={18} className="text-gold" />
                    <span style={{ fontWeight: 500 }}>{vehicle.location}</span>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <Link to={`/vehicle/${vehicle.id}`} className="card-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none' }}>
                        THE EXPERIENCE <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
            <style jsx>{`
                .card:hover { border-color: var(--primary); transform: translateY(-10px); }
                .card:hover .card-img { transform: scale(1.1); }
                .card-link { transition: var(--transition-smooth); }
                .card-link:hover { transform: translateX(10px); color: #white; }
                .text-gold { color: var(--primary); }
            `}</style>
        </div>
    );
};

export default VehicleCard;
