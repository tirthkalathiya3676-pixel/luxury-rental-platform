# Deployment Guide: Luxury Rental Platform

This guide outlines the steps to deploy your production-ready luxury car rental application.

## 1. Backend Deployment (Render)

### Prerequisites
- A [Render](https://render.com) account.
- A GitHub repository containing your code.

### Deployment Steps
1. **Connect Repository**: In Render, click **New** > **Blueprint**.
2. **Connect GitHub**: Select your repository.
3. **Approve Blueprint**: Render will detect `backend/render.yaml`. It will automatically setup:
   - A Node.js Web Service.
   - A Managed PostgreSQL Database.
4. **Environment Variables**:
   - `JWT_SECRET`: Random secure string (generated automatically).
   - `FRONTEND_URL`: Set this to your Vercel URL after deploying the frontend.
   - `BACKEND_URL`: Set this to the URL Render provides for your backend.
   - `DATABASE_URL`: Automatically linked from the managed PG instance.

---

## 2. Frontend Deployment (Vercel)

### Prerequisites
- A [Vercel](https://vercel.com) account.

### Deployment Steps
1. **Import Project**: Click **Add New** > **Project** and import your repository.
2. **Framework Preset**: Select **Vite**.
3. **Root Directory**: Select `frontend`.
4. **Environment Variables**:
   - `VITE_API_URL`: Set this to your Render backend URL (e.g., `https://rental-backend.onrender.com/api`).
5. **Deploy**: Click **Deploy**. Vercel will use `vercel.json` to handle SPA routing correctly.

---

## 3. Database Migration (PostgreSQL)

The application is designed to automatically create the necessary tables on first run when connected to PostgreSQL. No manual migration scripts are required.

### Initial Admin Credentials
- **Email**: `admin@rental.com`
- **Password**: `admin123`

---

## 4. Optimization & Security
- **CORS**: The backend only allows requests from your `FRONTEND_URL`.
- **Rate Limiting**: API routes are protected against brute force (100 requests per 15 mins per IP).
- **Security Headers**: `helmet` is configured to protect against common web vulnerabilities.
- **Payload Limits**: Image uploads are capped at 5MB.

---

## 5. Custom Domain
- **Render**: Add your domain in the "Settings" tab of your web service. Update the backend's `BACKEND_URL` environment variable.
- **Vercel**: Add your domain in the "Domains" tab and point it to Vercel's DNS.

---

> [!IMPORTANT]
> Ensure that `FRONTEND_URL` in Render and `VITE_API_URL` in Vercel are kept in sync to allow the application to communicate securely.
