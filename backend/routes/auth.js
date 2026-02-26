const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (tenant_id, name, email, password) VALUES (?, ?, ?, ?)",
        [req.tenant_id, name, email, hashedPassword],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Email already exists in this business' });
            }
            res.json({ id: this.lastID, message: 'Client registered successfully' });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ? AND tenant_id = ?", [email, req.tenant_id], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid credentials for this business' });
        }

        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, tenant_id: req.tenant_id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                tenant_id: user.tenant_id
            }
        });
    });
});

// Get Tenant Info
router.get('/tenant/:slug', (req, res) => {
    db.get("SELECT name, logo_url, settings FROM tenants WHERE slug = ?", [req.params.slug], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Business not found' });
        res.json(row);
    });
});

module.exports = router;
