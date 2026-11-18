# PARVAII Atelier — Vercel Multi-Service Deployment & `studio.parvaii.com` Setup Guide

This guide walks you through deploying **PARVAII Studio** to Vercel using the **Vercel Multi-Service Architecture** and connecting your subdomain **`studio.parvaii.com`**.

---

## 1. Architecture Overview (Vercel Multi-Services)
Your project is configured as a **multi-service monorepo** in `vercel.json`:
- **Frontend Service (`frontend`)**:
  - Root: `frontend`
  - Framework: `vite` (React + TypeScript + Tailwind)
  - Output: `frontend/dist`
  - Internal SPA rewrite routes any non-asset page reloads (`/orders`, `/collections`, `/inventory`, etc.) to `/index.html` for React Router.
- **Backend Service (`backend`)**:
  - Root: `backend`
  - Framework: `express` (Node.js + Express + Mongoose)
  - Connects to MongoDB Atlas via connection pooling.
- **Top-level Rewrites**:
  - All `/api/*` and `/api` requests automatically route to the `backend` service.
  - All other routes automatically route to the `frontend` service.
- **Single Subdomain**: `https://studio.parvaii.com` serves both the user interface and API routes seamlessly with zero CORS issues!

---

## 2. Step-by-Step Vercel Deployment

### Step A: Verify Repository on GitHub
The repository is:
- **Repository**: `ALLUT-YT-ZEEKOI/Parvaii-Studio`
- **Branch**: `main`
- **Root Directory**: `./`

---

### Step B: Environment Variables in Vercel Dashboard
In your Vercel Project Dashboard:
1. Go to **Settings** → **Environment Variables**.
2. Add the following server-side environment variables:

| Key | Recommended Value | Scope |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `parvaii_secret_jwt_key_2026_super_secure` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

*(Note: These environment variables are server-side only and never exposed to the client-side bundle).*

---

### Step C: Configure Custom Subdomain `studio.parvaii.com`
1. In your Vercel Project, go to **Settings** → **Domains**.
2. Add:
   ```
   studio.parvaii.com
   ```
3. DNS configuration (Already set up in GoDaddy):
   - **Type**: `CNAME`
   - **Name / Host**: `studio`
   - **Target / Value**: `cname.vercel-dns.com`
4. Once verified, Vercel will automatically provision a free SSL certificate.

---

### Step D: MongoDB Atlas Network Access
Because Vercel functions use dynamic IP addresses:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left menu, click **Security** → **Network Access**.
3. Ensure there is an IP entry for `0.0.0.0/0` (Allow Access from Anywhere).

---

## 3. Local Development (Unchanged)
You can continue working locally anytime:
- **Backend**: `cd backend && node server.js` (runs on `http://127.0.0.1:8000`)
- **Frontend**: `cd frontend && npm run dev` (runs on `http://localhost:3000`)
*(The frontend automatically detects local dev vs production Vercel!)*
