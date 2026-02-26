# DriveEase - Car & Bike Rental Booking Application

## Project Overview
DriveEase is a premium rental booking system featuring a modern UI, real-time availability checking, and a comprehensive management system for both customers and administrators.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, JWT, Bcrypt, Multer.
- **Database**: SQLite (No configuration required).

## Features
- ✅ User Registration & Login
- ✅ Admin Dashboard for Fleet Management
- ✅ Customer Dashboard for Booking Tracking
- ✅ WhatsApp Direct Contact
- ✅ Responsive Design
- ✅ Dynamic Search & Filtering

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js  # Add initial sample vehicles
npm start     # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Runs on http://localhost:5173
```

## Admin Credentials
- **Email**: `admin@rental.com`
- **Password**: `admin123`

## Usage Tips
- Direct WhatsApp button on vehicle details page for quick inquiries.
- Admin panel allows status updates for all bookings (Confirm/Cancel).
- Mobile-first CSS ensures smooth usage on all devices.
