const express = require('express');
const db = require('../db');
const router = express.Router();

const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Error: File upload only supports images!"));
    }
});

// Get all vehicles for current tenant
router.get('/', (req, res) => {
    console.log('Vehicles: Fetching for tenant ID:', req.tenant_id);
    db.all("SELECT * FROM vehicles WHERE tenant_id = ?", [req.tenant_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(`Vehicles: Found ${rows.length} vehicles.`);
        res.json(rows);
    });
});

// Get single vehicle (must belong to tenant)
router.get('/:id', (req, res) => {
    db.get("SELECT * FROM vehicles WHERE id = ? AND tenant_id = ?", [req.params.id, req.tenant_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Vehicle not found in your business fleet' });
        res.json(row);
    });
});

// Add vehicle (Admin Only)
router.post('/', upload.single('image'), (req, res) => {
    const { name, type, price_per_hr, location, description } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        image_url = `${backendUrl}/uploads/${req.file.filename}`;
    }

    db.run(`INSERT INTO vehicles (tenant_id, name, type, price_per_hr, image_url, location, description) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.tenant_id, name, type, price_per_hr, image_url, location, description],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Vehicle added to your fleet', image_url });
        }
    );
});

// Update vehicle
router.put('/:id', upload.single('image'), (req, res) => {
    const { name, type, price_per_hr, location, description, availability } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        image_url = `${backendUrl}/uploads/${req.file.filename}`;
    }

    db.run(`UPDATE vehicles SET name=?, type=?, price_per_hr=?, image_url=?, location=?, description=?, availability=? WHERE id=? AND tenant_id=?`,
        [name, type, price_per_hr, image_url, location, description, availability, req.params.id, req.tenant_id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: 'Fleet item updated', image_url });
        }
    );
});

// Delete vehicle
router.delete('/:id', (req, res) => {
    db.run("DELETE FROM vehicles WHERE id = ? AND tenant_id = ?", [req.params.id, req.tenant_id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Fleet item deleted' });
    });
});

// Toggle availability
router.patch('/:id/toggle', (req, res) => {
    db.get("SELECT availability FROM vehicles WHERE id = ? AND tenant_id = ?", [req.params.id, req.tenant_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Vehicle not found' });

        const newAvailability = row.availability ? 0 : 1;
        db.run("UPDATE vehicles SET availability = ? WHERE id = ? AND tenant_id = ?", [newAvailability, req.params.id, req.tenant_id], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ availability: newAvailability, message: 'Availability toggled' });
        });
    });
});

module.exports = router;
