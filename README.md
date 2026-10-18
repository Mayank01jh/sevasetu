# SevaSetu - Giving That Connects

**SevaSetu** is an Indian statutory-compliant digital bridge connecting donors, civic volunteers, and verified Non-Profit Organizations (NGOs).

Built strictly in accordance with the **SevaSetu Product Requirements Document (PRD v1.0)** using a modern **Next.js 14** frontend and a **Python FastAPI** backend powered by **MongoDB** and **Supabase**.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Framer Motion animations, Lucide React icons.
- **Backend:** Python FastAPI, Uvicorn, Motor (MongoDB client), Supabase Python client, ReportLab.
- **Dual-Database:**
  - **MongoDB Atlas:** Real-time volunteer telemetry, 10-minute ephemeral session OTPs, and unstructured ground audit trails.
  - **Supabase (PostgreSQL):** Relational statutory records, Section 80G tax deductions, and CBDT Form 10BD serial records.
- **Hosting Targets:**
  - **Frontend:** Vercel (configuration in `frontend/vercel.json`).
  - **Backend:** Render (configuration in `render.yaml` & `backend/Dockerfile`).

---

## 🌟 Key Features

1. **🛡️ 4-Tier NGO Statutory Verification:** Tracks NITI Aayog DARPAN IDs, Section 12A/80G orders, PAN, and annual audited accounts.
2. **💳 Section 80G Tax Exemption & Form 10BD:** Generates unique Bill IDs (`SS-2026-XXXX`) with 50% tax deductions, printable stamped receipts, and exportable CBDT Form 10BD CSV returns.
3. **🤝 Volunteer Attendance Telemetry:** Field leads generate unpredictable, 10-minute expiring tokens (e.g. `SEVA-9842`) to eliminate paper-forged volunteer hours.
4. **🔍 Public QR & Document Authenticator:** Zero-login verification for any citizen or auditor to validate Bill IDs and Volunteer Certificate IDs in real time.
5. **🔐 Strict Role-Based Access Control (RBAC):** Public guests see only public routes. Administrative dashboards (`/field-lead`, `/ngo-admin`, `/platform-admin`) are protected by an authentication `RoleGuard`.

---

## 🔑 Demo Role Credentials

Pre-configured accounts with **1-click quick-fill buttons** embedded directly in the frontend login dialog:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Platform Admin** | `admin@sevasetu.org` | `Admin@SevaSetu2026` | Full system audit, dual-DB metrics, global compliance |
| **NGO Admin** | `ngo@akshayaseva.org` | `Ngo@Akshaya2026` | Milestone escrow management, Form 10BD CSV download |
| **Field Lead** | `lead@sevasetu.org` | `Lead@Field2026` | 10-min ephemeral OTP generator, volunteer hours approval |
| **Volunteer** | `volunteer@sevasetu.org` | `Volunteer@2026` | Ground session check-in, certificate download |
| **Donor** | `donor@sevasetu.org` | `Donor@2026` | 80G tax vault, stamped tax invoices, tax calculator |

*(Detailed in [`CREDENTIALS.md`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/CREDENTIALS.md))*

---

## 🚀 Deployment Instructions

Refer to [`DEPLOYMENT_GUIDE.md`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/DEPLOYMENT_GUIDE.md) for step-by-step instructions to:
1. Push to GitHub: `git push -u origin main`
2. Deploy the FastAPI backend on **Render** using `render.yaml`.
3. Deploy the Next.js frontend on **Vercel** with `NEXT_PUBLIC_API_URL`.
