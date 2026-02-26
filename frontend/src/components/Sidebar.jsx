import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Calendar, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <aside className="sidebar" style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--sidebar-bg)',
            color: 'var(--sidebar-text)',
            height: '100vh',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            borderRight: '1px solid var(--border)',
            zIndex: 100
        }}>
            <div className="sidebar-header" style={{ marginBottom: '3.5rem', padding: '0 0.5rem' }}>
                <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'white',
                    letterSpacing: '1px',
                    fontFamily: 'var(--font-body)'
                }}>
                    RENTAL<span style={{ color: 'var(--primary)' }}>ADMIN</span>
                </h1>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SidebarItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <SidebarItem to="/admin/vehicles" icon={<Car size={18} />} label="Vehicles" />
                <SidebarItem to="/admin/bookings" icon={<Calendar size={18} />} label="Bookings" />
                <SidebarItem to="/admin/users" icon={<Users size={18} />} label="Users" />
            </nav>

            <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    width: '100%'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--error)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

const SidebarItem = ({ to, icon, label }) => {
    return (
        <NavLink
            to={to}
            end={to === '/admin'}
            style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? 'white' : 'var(--sidebar-text)',
                backgroundColor: isActive ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'var(--transition-fast)',
                textDecoration: 'none'
            })}
        >
            <span style={{ color: 'inherit' }}>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
};

export default Sidebar;

