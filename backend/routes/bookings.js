const express = require('express');
const db = require('../db');
const router = express.Router();

// Create booking for specific tenant
router.post('/', (req, res) => {
    const { user_id, vehicle_id, start_time, end_time, total_price } = req.body;
    db.run(`INSERT INTO bookings (tenant_id, user_id, vehicle_id, start_time, end_time, total_price) 
            VALUES (?, ?, ?, ?, ?, ?)`,
        [req.tenant_id, user_id, vehicle_id, start_time, end_time, total_price],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Reservation logged in our ledger.' });
        }
    );
});

// Get user bookings (filtered by tenant)
router.get('/user/:userId', (req, res) => {
    db.all(`SELECT b.*, v.name as vehicle_name, v.image_url 
            FROM bookings b 
            JOIN vehicles v ON b.vehicle_id = v.id 
            WHERE b.user_id = ? AND b.tenant_id = ?`,
        [req.params.userId, req.tenant_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Get all bookings (Admin - filtered by tenant)
router.get('/', (req, res) => {
    db.all(`SELECT b.*, v.name as vehicle_name, u.name as user_name 
            FROM bookings b 
            JOIN vehicles v ON b.vehicle_id = v.id 
            JOIN users u ON b.user_id = u.id
            WHERE b.tenant_id = ?`,
        [req.tenant_id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Update booking status (tenant isolated)
router.patch('/:id', (req, res) => {
    const { status } = req.body;
    db.run("UPDATE bookings SET status = ? WHERE id = ? AND tenant_id = ?", [status, req.params.id, req.tenant_id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Reservation status updated' });
    });
});

module.exports = router;
