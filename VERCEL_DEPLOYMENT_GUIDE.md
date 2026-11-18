# PARVAII Atelier — Vercel Deployment & `studio.parvaii.com` Setup Guide

This guide walks you through deploying **PARVAII Studio** to Vercel and connecting your subdomain **`studio.parvaii.com`**.

---

## 1. Architecture Overview
Your project is now configured as a **unified Vercel project**:
- **Frontend**: React + TypeScript + Tailwind (Vite builds to `frontend/dist`).
- **Backend**: Node.js + Express.js running as a serverless function via `api/index.js`.
- **Database**: MongoDB Atlas (`parvaii` database).
- **Single Subdomain**: `https://studio.parvaii.com` serves both the user interface and API routes (`/api/v1/...`) with zero CORS issues!

---

## 2. Step-by-Step Vercel Deployment

### Step A: Push Your Project to GitHub / GitLab
In your project root:
```bash
git init
git add .
git commit -m "feat: complete Parvaii Studio Node.js + Express backend and Vercel setup"
git remote add origin https://github.com/<your-username>/parvaii-studio.git
git push -u origin main
```

*(Note: `.env` and `node_modules` are automatically ignored by `.gitignore` to keep credentials safe).*

---

### Step B: Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your `parvaii-studio` repository.
4. **Project Settings**:
   - **Framework Preset**: Other (or Vite)
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm --prefix frontend install && npm --prefix frontend run build` *(Already pre-configured in `vercel.json`)*
   - **Output Directory**: `frontend/dist` *(Already pre-configured in `vercel.json`)*
5. **Environment Variables**:
   Add the following variables:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | `mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `parvaii_secret_jwt_key_2026_super_secure` |
   | `NODE_ENV` | `production` |
6. Click **Deploy**.

---

### Step C: Configure Subdomain `studio.parvaii.com`
1. In your Vercel Project, go to **Settings** → **Domains**.
2. In the input box, type:
   ```
   studio.parvaii.com
   ```
   and click **Add**.
3. Vercel will show the required DNS record:
   - **Type**: `CNAME`
   - **Name / Host**: `studio`
   - **Value / Points to**: `cname.vercel-dns.com`

---

### Step D: Add CNAME in Your DNS Provider (Where `parvaii.com` is registered)
Go to your DNS management dashboard (e.g. GoDaddy, Cloudflare, Namecheap, Hostinger, BigRock):
1. Navigate to **DNS Records** / **DNS Management** for `parvaii.com`.
2. Add a new record:
   - **Type**: `CNAME`
   - **Host / Name**: `studio` (or `studio.parvaii.com`)
   - **Target / Value**: `cname.vercel-dns.com`
   - **TTL**: Auto or 1 hour
   *(If using Cloudflare: Set Proxy status to **DNS Only** (Grey cloud) during initial SSL verification).*
3. Save the record.
4. Return to Vercel: Vercel will automatically verify the record and issue a free SSL certificate (`https://`).

---

### Step E: MongoDB Atlas Network Access (Important)
Because Vercel serverless functions use dynamic IP addresses:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left menu, click **Security** → **Network Access**.
3. Ensure there is an entry with IP `0.0.0.0/0` (Allow Access from Anywhere).
4. Status will show **Active**.

---

## 3. Local Development (Unchanged)
You can continue working locally anytime:
- **Backend**: `cd backend && node server.js` (runs on `http://127.0.0.1:8000`)
- **Frontend**: `cd frontend && npm run dev` (runs on `http://localhost:3000`)
*(The frontend automatically detects local dev vs production Vercel!)*
