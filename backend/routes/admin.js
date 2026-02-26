const express = require('express');
const db = require('../db');
const router = express.Router();

// Get admin stats
router.get('/stats', (req, res) => {
    const stats = {};

    db.get("SELECT COUNT(*) as totalVehicles FROM vehicles WHERE tenant_id = ?", [req.tenant_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalVehicles = row.totalVehicles;

        db.get("SELECT COUNT(*) as totalBookings FROM bookings WHERE tenant_id = ?", [req.tenant_id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.totalBookings = row.totalBookings;

            db.get("SELECT COUNT(*) as totalUsers FROM users WHERE tenant_id = ?", [req.tenant_id], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.totalUsers = row.totalUsers;

                db.get("SELECT SUM(total_price) as totalRevenue FROM bookings WHERE status != 'cancelled' AND tenant_id = ?", [req.tenant_id], (err, row) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.totalRevenue = row.totalRevenue || 0;

                    db.all(`SELECT b.*, v.name as vehicle_name, u.name as user_name 
                            FROM bookings b 
                            JOIN vehicles v ON b.vehicle_id = v.id 
                            JOIN users u ON b.user_id = u.id 
                            WHERE b.tenant_id = ?
                            ORDER BY b.id DESC LIMIT 5`, [req.tenant_id], (err, rows) => {
                        if (err) return res.status(500).json({ error: err.message });
                        stats.recentBookings = rows;
                        res.json(stats);
                    });
                });
            });
        });
    });
});

// Get all users for this tenant
router.get('/users', (req, res) => {
    db.all("SELECT id, name, email, role FROM users WHERE tenant_id = ?", [req.tenant_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
