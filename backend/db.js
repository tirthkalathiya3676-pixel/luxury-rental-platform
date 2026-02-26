const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const isProduction = !!process.env.DATABASE_URL;

let db;

if (isProduction) {
    console.log('Using PostgreSQL database.');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for some cloud providers like Render/DigitalOcean
        }
    });

    // Wrapper for pg to match sqlite3 API
    db = {
        run: function (sql, params, callback) {
            // Replace ? with $1, $2, etc.
            let counter = 1;
            const pgSql = sql.replace(/\?/g, () => `$${counter++}`);

            // For INSERT, we need RETURNING id to get lastID
            const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
            const finalSql = isInsert ? `${pgSql} RETURNING id` : pgSql;

            pool.query(finalSql, params, (err, res) => {
                const context = {
                    lastID: res && res.rows && res.rows[0] ? res.rows[0].id : null,
                    changes: res ? res.rowCount : 0
                };
                if (callback) callback.call(context, err);
            });
        },
        get: function (sql, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            let counter = 1;
            const pgSql = sql.replace(/\?/g, () => `$${counter++}`);
            pool.query(pgSql, params, (err, res) => {
                if (callback) callback(err, res ? res.rows[0] : null);
            });
        },
        all: function (sql, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = [];
            }
            let counter = 1;
            const pgSql = sql.replace(/\?/g, () => `$${counter++}`);
            pool.query(pgSql, params, (err, res) => {
                if (callback) callback(err, res ? res.rows : []);
            });
        },
        serialize: function (fn) {
            fn(); // No serialization needed for Pool
        }
    };

    // Initialize DB tables for PG
    initializeDb(db);
} else {
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

    const sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
        } else {
            console.log('Connected to SQLite database.');
            initializeDb(sqliteDb);
        }
    });

    db = sqliteDb;
}

function initializeDb(database) {
    database.serialize(() => {
        const autoInc = isProduction ? 'SERIAL' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
        const idType = isProduction ? `id ${autoInc}` : 'id INTEGER PRIMARY KEY AUTOINCREMENT';

        // Tenants Table
        database.run(`CREATE TABLE IF NOT EXISTS tenants (
            ${idType},
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            logo_url TEXT,
            settings TEXT
        )`);

        // Insert Default Tenant if none exists (Migration Step)
        database.get("SELECT * FROM tenants WHERE id = 1", (err, row) => {
            if (!row) {
                database.run("INSERT INTO tenants (id, name, slug) VALUES (1, ?, ?)", ['Default Luxury', 'default']);
            }
        });

        // Users Table (Refactored for Multi-Tenancy)
        database.run(`CREATE TABLE IF NOT EXISTS users (
            ${idType},
            tenant_id INTEGER DEFAULT 1,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'customer',
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        )`);

        // Vehicles Table (Refactored for Multi-Tenancy)
        database.run(`CREATE TABLE IF NOT EXISTS vehicles (
            ${idType},
            tenant_id INTEGER DEFAULT 1,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price_per_hr REAL NOT NULL,
            image_url TEXT,
            availability BOOLEAN DEFAULT ${isProduction ? 'TRUE' : '1'},
            location TEXT,
            description TEXT,
            FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        )`);

        // Bookings Table (Refactored for Multi-Tenancy)
        database.run(`CREATE TABLE IF NOT EXISTS bookings (
            ${idType},
            tenant_id INTEGER DEFAULT 1,
            user_id INTEGER,
            vehicle_id INTEGER,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (tenant_id) REFERENCES tenants(id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )`);

        // Migration: Add tenant_id column if it doesn't exist (for existing SQLite databases)
        if (!isProduction) {
            const tables = ['users', 'vehicles', 'bookings'];
            tables.forEach(table => {
                database.all(`PRAGMA table_info(${table})`, (err, rows) => {
                    if (rows && !rows.find(r => r.name === 'tenant_id')) {
                        database.run(`ALTER TABLE ${table} ADD COLUMN tenant_id INTEGER DEFAULT 1`);
                    }
                });
            });
        }

        // Add admin user to default tenant if not exists
        database.get("SELECT * FROM users WHERE email = 'admin@rental.com' AND tenant_id = 1", (err, row) => {
            if (!row) {
                const hashedPass = '$2a$10$ggKcnakomf1zvRMa3tVH5.ZPA2tMRodVPEj1jTfjA6wTG.qBfFlvu';
                database.run("INSERT INTO users (tenant_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
                    [1, 'Admin', 'admin@rental.com', hashedPass, 'admin']);
            }
        });
    });
}

module.exports = db;
