import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import VehicleCard from '../components/VehicleCard';
import { Search, MapPin, Calendar, ChevronDown, MoveRight } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

const Home = () => {
    const { tenant } = useTenant();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/vehicles')
            .then(res => {
                setVehicles(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="home-page">
            <section className="hero" style={{ height: '90vh' }}>
                <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.4) 0%, #050505 100%)' }}></div>
                <img
                    src="/assets/hero.png"
                    alt="Luxury Sport Car"
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }}
                />
                <div className="hero-content animate-reveal" style={{ maxWidth: '1400px', zIndex: 10, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div className="flex align-center gap-1 mb-2">
                            <span style={{ height: '1px', width: '40px', background: 'var(--primary)' }}></span>
                            <span style={{ fontSize: '0.8rem', letterSpacing: '0.6em', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                                ESTABLISHED EXCELLENCE
                            </span>
                            <span style={{ height: '1px', width: '40px', background: 'var(--primary)' }}></span>
                        </div>
                        <h1 className="hero-title" style={{ fontSize: '7rem', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                            {tenant?.name?.toUpperCase() || 'LIMITLESS'} <span className="text-gold">LUXURY.</span>
                        </h1>
                        <p style={{ fontSize: '1.5rem', color: 'white', opacity: 0.9, fontWeight: 300, letterSpacing: '0.05em', maxWidth: '800px', margin: '0 auto 5rem', lineHeight: '1.6' }}>
                            Access the world's most prestigious automotive masterpieces. Curated for those who demand the zenith of performance and style.
                        </p>
                        <div className="flex justify-center gap-2">
                            <button className="btn-primary" onClick={() => document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' })} style={{ padding: '1.5rem 4rem', fontSize: '0.85rem' }}>
                                EXPLORE THE FLEET <MoveRight size={20} style={{ marginLeft: '1rem' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container" style={{ position: 'relative', marginTop: '-100px', zIndex: 100 }}>
                <div className="glass-premium card animate-reveal" style={{ padding: '4rem', borderRadius: '4px' }}>
                    <div className="flex flex-col-mobile gap-4 align-center">
                        <div className="flex flex-col gap-1-5" style={{ flex: 1.5, width: '100%' }}>
                            <div className="flex align-center gap-05">
                                <MapPin size={14} className="text-gold" />
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)' }}>LOCATION</label>
                            </div>
                            <input
                                type="text"
                                placeholder="Where will your journey begin?"
                                style={{ border: 'none', background: 'transparent', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: 300, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', outline: 'none' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1-5" style={{ flex: 1, width: '100%' }}>
                            <div className="flex align-center gap-05">
                                <Calendar size={14} className="text-gold" />
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)' }}>TIMELINE</label>
                            </div>
                            <input type="date" style={{ border: 'none', background: 'transparent', width: '100%', color: 'white', fontSize: '1.5rem', fontWeight: 300, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', outline: 'none' }} />
                        </div>
                        <button className="btn-primary" style={{ height: '85px', minWidth: '280px', borderRadius: '2px' }}>DISCOVER MATCHES</button>
                    </div>
                </div>
            </div>

            <main id="fleet" className="container" style={{ paddingBottom: '12rem', paddingTop: '12rem' }}>
                <div className="animate-reveal mb-5 text-center">
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.5em', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>The Curated Selection</span>
                    <h2 style={{ fontSize: '5rem', marginTop: '1rem', fontWeight: 400 }}>FLEET OF <span className="text-gold">DISTINCTION</span></h2>
                    <div style={{ height: '3px', width: '120px', background: 'var(--primary)', margin: '3rem auto' }}></div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-2"><div className="loader"></div></div>
                ) : (
                    <div className="grid-listing animate-reveal">
                        {filteredVehicles.map(vehicle => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}

                {filteredVehicles.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '10rem 0', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '1.25rem', letterSpacing: '0.15em', fontWeight: 300 }}>NO PRECISION ENGINES MATCH YOUR SEARCH.</p>
                    </div>
                )}
            </main>

            <style jsx>{`
                .animate-bounce { animation: bounce 2.5s infinite; }
                @keyframes bounce { 
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-15px); }
                    60% { transform: translateY(-7px); }
                }
                .loader {
                    border: 2px solid var(--border);
                    border-top: 2px solid var(--primary);
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                }
                .text-gold { color: var(--primary); }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Home;
