# SevaSetu - Giving That Connects

**SevaSetu** is a transparent, statutory-compliant digital bridge connecting donors, civic volunteers, and verified Indian Non-Profit Organizations (NGOs).

Built strictly in accordance with the **SevaSetu Product Requirements Document (PRD v1.0)**.

---

## 🌟 Key Product Capabilities

### 1. 🛡️ Statutory Verification & Credibility Engine
- **NITI Aayog Darpan & Section 12A/80G Verification**: Every NGO profile displays verified Darpan registration, PAN, 80G order numbers, and FCRA statuses.
- **Dossier Inspector**: Full transparency into statutory approvals without implying government endorsement.
- **Transparency Score**: Dynamic rating based on independent audits, reporting freshness, and document compliance.

### 2. 💳 Donation Lifecycle & 100% Bill Traceability
- **Instant Immutable Bill ID**: Every transaction generates a permanent Bill ID (e.g. `SS-BILL-2026-XXXXXX`) and reconciliation provider reference.
- **Section 80G Tax Exemption**: Real-time PAN format validation (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) with 50% tax deduction calculation.
- **Dynamic UPI Payment Simulator**: Real-time QR generator compatible with any UPI app (`upi://pay?pa=sevasetu@icici...`), along with Card and Netbanking options.
- **Anonymous Giving**: Allows contributors to mask their identity on public campaign leaderboards while preserving legal tax records.

### 3. 🏛️ The Bill Vault & Official 80G Receipts
- **Centralized Vault**: Searchable repository of all contributions, filterable by Bill ID, date, or NGO.
- **Official Section 80G Certificate**: Printable, PDF-ready official tax exemption receipt featuring authorized signatures, statutory order details, and signed QR verification codes.
- **Form 10BD Export Assistant**: One-click generation of statutory Form 10BD donor statements in CSV format ready for direct Income Tax filing.

### 4. 🤝 Volunteer Management & On-Ground Code Attendance
- **Opportunity Discovery**: Browse community food packing, medical support, afforestation, and digital STEM drives.
- **Temporary 6-Character Attendance Codes**: Field leads generate unpredictable, 10-minute expiring tokens (e.g. `SETU-7492`) with emergency revocation controls.
- **Real-Time Check-In & Check-Out**: Volunteers enter attendance codes to record arrival and departure times.
- **Official Certificate of Volunteering**: Approved volunteers receive verifiable service certificates complete with unique Certificate IDs and verification QR codes.

### 5. 🔍 Public QR & Document Authenticator
- **Zero-Login Verification**: Anyone can scan a QR code or enter a Bill ID or Certificate ID on `verify.html` to validate authenticity in real time without exposing sensitive donor PAN data.

### 6. 🔐 Role-Based Access Control & Protected Dashboards
Features and dashboards are strictly gated based on authentication:
- **Public Visitors (Not Logged In)**: View Causes & Campaigns, Verified NGOs, Volunteering opportunities, and the Public QR Authenticator.
- **Protected Dashboards**: Visiting protected operational portals (`/field-lead`, `/ngo-admin`, `/platform-admin`, or `/vault`) triggers an **Authentication Guard** requiring valid sign-in.
- **Role-Specific Navigation**: Once signed in, the top navigation adapts to show only the tools and records relevant to that specific user.
- **Login Credentials**: Ready-to-use accounts for all roles are provided in [`CREDENTIALS.md`](file:///c:/Users/mayan/Downloads/PROJECTS/sevasetu/CREDENTIALS.md), with convenient 1-click demo logins integrated directly into the login modal.

---

## 🎨 Visual System & Brand Guidelines
- **Official Logo**: Integrated with high fidelity (`assets/sevasetu-logo.png`).
- **60-30-10 Color Allocation**:
  - **60% Canvas / Neutral Surfaces**: `#F8FAFC` (Dark mode: `#0B131A`)
  - **30% Structural Cards & Surfaces**: Pure white cards with soft shadows (`#FFFFFF`, Dark mode: `#14202B`)
  - **10% Action & Highlights**:
    - Primary Teal: `#107361`
    - Warm Amber: `#D97706`
    - Navy Slate: `#162836`
- **WCAG 2.2 AA Contrast Compliant**: Minimum 4.5:1 text contrast and accessible `:focus-visible` states.
- **Zero Heavy Build Dependencies**: Built using modern HTML5, Vanilla CSS3, and ES6 JavaScript.

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: PowerShell Local Web Server
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
This automatically hosts the application at `http://localhost:8080/` and opens your default browser.
