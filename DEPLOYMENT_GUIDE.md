# SevaSetu Deployment & Live Hosting Guide

This guide provides step-by-step instructions to push the repository to **GitHub**, deploy the **Python FastAPI Backend on Render**, and deploy the **Next.js Frontend on Vercel**.

---

## 1. Push to GitHub

The local repository is already initialized and committed to the `main` branch.

### Step 1.1: Create a New GitHub Repository
1. Go to [GitHub.com](https://github.com/new).
2. Set the repository name to `sevasetu` (or your preferred name).
3. Keep it **Public** (or **Private**). Do **not** initialize with a README, .gitignore, or license (these are already configured in this codebase).
4. Click **Create repository**.

### Step 1.2: Add Remote and Push
Run the following commands in your terminal from `c:\Users\mayan\Downloads\PROJECTS\sevasetu`:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/sevasetu.git
git push -u origin main
```

*(Replace `<YOUR_GITHUB_USERNAME>` with your GitHub handle).*

---

## 2. Deploy Backend on Render

The repository includes a ready-to-use [`render.yaml`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/render.yaml) blueprint and [`backend/Dockerfile`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/backend/Dockerfile).

### Option A: 1-Click Blueprint (Recommended)
1. Sign in to [Render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository `sevasetu`.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/render.yaml) and configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/api/health`
5. Click **Apply**.

### Option B: Manual Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Select your `sevasetu` GitHub repository.
3. Configure settings:
   - **Name:** `sevasetu-backend`
   - **Region:** Singapore / Oregon / Frankfurt (closest to your audience)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `ENVIRONMENT` = `production`
   - `JWT_SECRET` = `(Click generate or enter a 32+ character random string)`
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority` *(Optional: backend boots with in-memory fallback if empty)*
   - `MONGODB_DB_NAME` = `sevasetu_prod`
   - `SUPABASE_URL` = `https://<your-project>.supabase.co` *(Optional)*
   - `SUPABASE_KEY` = `your_supabase_anon_or_service_key` *(Optional)*
5. Click **Create Web Service**.
6. Once deployed, copy your Render service URL (e.g., `https://sevasetu-backend.onrender.com`).

---

## 3. Deploy Frontend on Vercel

The frontend is built with **Next.js 14 App Router** in the [`frontend/`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/frontend) directory.

1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `sevasetu` GitHub repository.
4. In the **Project Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select `frontend`.
5. Under **Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://sevasetu-backend.onrender.com`)
6. Click **Deploy**.
7. Vercel will build and deploy your app. Your live domain will look like `https://sevasetu.vercel.app`.

---

## 4. Connecting MongoDB & Supabase

The backend operates with a resilient **Dual-Database** architecture:
- **MongoDB Atlas:** Stores ephemeral 10-minute session telemetry, real-time ground logs, and campaign milestones.
- **Supabase (PostgreSQL):** Stores statutory records, Section 80G tax receipts, and Form 10BD income tax schedules.

### MongoDB Setup (Atlas - Free Tier)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. In **Database Access**, create a user with read/write privileges.
3. In **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so Render can connect.
4. In **Clusters** -> **Connect** -> **Connect your application**, copy the connection string.
5. Paste it as `MONGODB_URI` in Render.

### Supabase Setup (Free Tier)
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings** -> **API**, copy:
   - **Project URL** -> set as `SUPABASE_URL` in Render.
   - **anon / public key** -> set as `SUPABASE_KEY` in Render.

---

## 5. Pre-Configured Demo Credentials

For quick role switching during client presentations or evaluator walkthroughs, refer to [`CREDENTIALS.md`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/CREDENTIALS.md):

| Role | Email | Password |
|---|---|---|
| **Platform Admin** | `admin@sevasetu.org` | `Admin@SevaSetu2026` |
| **NGO Admin** | `ngo@akshayaseva.org` | `Ngo@Akshaya2026` |
| **Field Lead** | `lead@sevasetu.org` | `Lead@Field2026` |
| **Volunteer** | `volunteer@sevasetu.org` | `Volunteer@2026` |
| **Donor** | `donor@sevasetu.org` | `Donor@2026` |

All roles have **1-click Quick Login** buttons embedded right inside the frontend authentication dialog!
