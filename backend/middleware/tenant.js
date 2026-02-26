const db = require('../db');

const tenantMiddleware = (req, res, next) => {
    // Look for tenant slug in header or subdomain
    const tenantSlug = req.headers['x-tenant-slug'] || (req.get('host').split('.')[0]);

    if (!tenantSlug || tenantSlug === 'localhost' || tenantSlug === 'www') {
        // Fallback to default tenant if no slug provided
        console.log('Middleware: Fallback to default tenant (ID: 1) for slug:', tenantSlug);
        req.tenant_id = 1;
        return next();
    }

    console.log('Middleware: Searching for tenant with slug:', tenantSlug);

    db.get("SELECT id FROM tenants WHERE slug = ?", [tenantSlug], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error identifying tenant' });

        if (!row) {
            return res.status(404).json({ error: `Business with identifier '${tenantSlug}' not found.` });
        }

        req.tenant_id = row.id;
        console.log('Middleware: Identified tenant ID:', req.tenant_id);
        next();
    });
};

module.exports = tenantMiddleware;
