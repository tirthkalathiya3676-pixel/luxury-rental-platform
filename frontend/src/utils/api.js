import axios from 'axios';

const getBaseURL = () => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Changed default to not include /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true
});

// Add a request interceptor to include the auth token and tenant slug in all requests
api.interceptors.request.use((config) => {
    // Auth Token
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant Identification (matches TenantContext.jsx logic)
    const host = window.location.hostname;
    const slug = host.includes('.') ? host.split('.')[0] : 'default';
    const urlParams = new URLSearchParams(window.location.search);
    const tenantSlug = urlParams.get('tenant') || slug;

    config.headers['X-Tenant-Slug'] = tenantSlug;

    return config;
});

export default api;
