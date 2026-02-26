import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Identify tenant from subdomain or URL
        const host = window.location.hostname;
        const slug = host.includes('.') ? host.split('.')[0] : 'default';

        // For development/testing on localhost, we can use a query param or just stay on 'default'
        const urlParams = new URLSearchParams(window.location.search);
        const testSlug = urlParams.get('tenant') || slug;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        // Fetch tenant branding/settings
        axios.get(`${API_URL}/auth/tenant/${testSlug}`, {
            headers: { 'X-Tenant-Slug': testSlug }
        })
            .then(res => {
                setTenant({ ...res.data, slug: testSlug });
                setLoading(false);
            })
            .catch(() => {
                // Fallback to default if not found
                setTenant({ id: 1, name: 'Luxury Rentals', slug: 'default' });
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center align-center" style={{ height: '100vh', background: '#050505' }}><div className="loader"></div></div>;

    return (
        <TenantContext.Provider value={{ tenant }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
