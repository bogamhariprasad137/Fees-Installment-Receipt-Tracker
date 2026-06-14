# Implementation Plan
## Fees Installment & Receipt Tracker

---

## 1. Project Directory Structure
The workspace will use a clean, decoupled directory structure:

```text
/fees-installment-receipt-tracker
├── docs/                           # Architecture and planning documentation
│   ├── PRD.md
│   ├── TRD.md
│   ├── App-Flow.md
│   ├── UI-UX-Design-Brief.md
│   ├── Backend-Schema.md
│   └── Implementation-Plan.md

├── frontend/                       # React Client (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/             # Reusable UI components (Buttons, inputs, tables)
│   │   ├── context/                # AuthContext
│   │   ├── layouts/                # Navbars, Sidebars
│   │   ├── pages/                  # Route screens (Login, Admin Dashboard, Parent Dashboard)
│   │   ├── services/               # API clients (Axios configs)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/                        # Flask Backend API
    ├── app/
    │   ├── __init__.py             # Flask App Factory setup
    │   ├── config.py               # Config parameters
    │   ├── database.py             # DB connection pool configurations
    │   ├── middleware.py           # Authentication and roles check decorators
    │   ├── models.py               # ORM mapping and tables configuration
    │   ├── routes/                 # Blueprint endpoints
    │   └── services/               # Business logic (PDF generator, reports compile)
    ├── Dockerfile
    ├── requirements.txt
    └── wsgi.py
```

---

## 2. Development Methodology (Backend-First Strategy)
We will follow a **Backend-First Development Strategy**:
1.  **Database Stability**: The database schema must be established before designing forms, ensuring clear validation rules (e.g. installments must sum to the total fee).
2.  **API Verification**: Establishing backend REST API endpoints first allows for thorough validation. Developers can use tool chains (like Postman or curl) to verify endpoints before building the frontend interfaces.
3.  **Role Guard Confidence**: Creating security middleware first ensures role-based route guards function correctly on the client side.

---

## 3. Sprint Plan & Milestones

```mermaid
gantt
    title Fees Installment & Receipt Tracker Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1: Core Setup
    Workspace Configuration & Firebase Setup :active, p1, 2026-06-15, 3d
    MySQL Migrations Deployment              :active, p2, after p1, 2d
    section Phase 2: Backend REST API
    Auth & Security Middleware Development   :p3, after p2, 3d
    Student & Fees CRUD Endpoints            :p4, after p3, 4d
    Installment Management & Payment Logs    :p5, after p4, 5d
    ReportLab PDF Generation Service         :p6, after p5, 4d
    section Phase 3: Frontend Web
    Firebase Client Auth & Router Setup      :p7, after p6, 3d
    Admin Dashboard UI & Forms Hookup        :p8, after p7, 5d
    Parent Dashboard UI & Receipt Downloads  :p9, after p8, 4d
    section Phase 4: Release
    Security Vulnerability Audit & QA Checks :p10, after p9, 3d
    Production Deployment (Vercel & Render)  :p11, after p10, 2d
```

### Milestones Summary
*   **Milestone 1 [Backend Operational]**: Database schema deployed; Firebase token authentication verified; Student, Fee, and Installment APIs functioning.
*   **Milestone 2 [Payment Engine Ready]**: Transaction logs update MySQL balances correctly; ReportLab generates receipt PDFs and saves them to disk.
*   **Milestone 3 [Frontend Fully Connected]**: React client router enforces route protection; all dashboard UI components load data from the backend.
*   **Milestone 4 [Production Release]**: Application successfully deployed to Vercel and Render; database verified on staging cloud.

---

## 4. Testing & QA Matrix

### 4.1 Backend Test Structure
*   **Unit Tests (`pytest`)**: Verify modeling calculations, validation rules (e.g. installment sums), and error response formats.
*   **Integration Tests**: Mock Firebase tokens and verify API endpoints return expected data.
*   **Execution Command**:
    ```bash
    cd backend
    pytest --cov=app tests/
    ```

### 4.2 Quality Assurance Checklist
- [ ] Verify that invalid email inputs throw standard validation errors.
- [ ] Confirm that parent users are blocked from accessing Admin dashboards (redirects to 403 Forbidden).
- [ ] Verify that parent users are blocked from viewing other children's profiles (test Parent Data Isolation by calling `/api/students/<id>/installments` for a student not belonging to the logged-in parent; confirm it returns 403 Forbidden).
- [ ] Set up a student fee account with split categories (Admission Fee, Term Fee, Daycare Fee) and verify that the system automatically calculates `Total Fee = Admission + Term + Daycare` and `Remaining Balance = Total Fee - Initial Payment`.
- [ ] Verify that saving installment schedules is blocked if the sum of installments does not match the computed `Total Fee`.
- [ ] Verify Partial Installment Editing Safeties: Edit the installment config of a student who has already paid a portion; check that paid installment rows are read-only and cannot be changed or removed, and modifying unpaid rows is accepted only if the final sum balances.
- [ ] Log a payment and verify that the student's paid amount increases, pending amount decreases, and overall status is correctly updated according to rules.
- [ ] Confirm that student hard-deletion is blocked if any paid installment or receipt logs exist (must return 400 Bad Request, suggesting profile deactivation/archival instead).
- [ ] Test Parent Self-Signup Activation: Register a parent via Firebase Auth using an email not pre-registered by the admin; confirm it returns 403 Forbidden. Register using a pre-registered email; confirm it links the profile and grants child dashboard views.
- [ ] Verify that the Admin Dashboard compiles metrics and displays all six CSS bar charts/distribution grids cleanly with ₹ symbols.
- [ ] Confirm that generated PDF receipts and statements can be downloaded and viewed from both Admin and Parent dashboards, and verify that CSV exports are fully deprecated in favor of PDF-first.


---

## 5. Deployment Procedures

### 5.1 Frontend (Vercel)
1.  Connect the Git repository to the Vercel dashboard.
2.  Set Build Command: `npm run build`
3.  Set Output Directory: `dist`
4.  Configure Vercel Environment Variables: Add Firebase config parameters and set `VITE_API_BASE_URL` to point to the production backend API on Render.
5.  Deploy the frontend application.

### 5.2 Backend (Render)
1.  Create a new Web Service on Render and point it to the `/backend` folder.
2.  Select Runtime: `Docker`.
3.  Add Backend Environment Variables: Configure the database connection string, Allowed Origins (set to the production Vercel URL), and the Firebase credentials JSON.
4.  Deploy the backend service.

---

## 6. Git Workflow & Guidelines
*   **Main Branches**:
    *   `main`: Holds the stable production code.
    *   `develop`: Integration branch for developers.
*   **Supporting Branches**:
    *   `feature/<name>`: For new features (e.g. `feature/firebase-auth`).
    *   `bugfix/<name>`: For bug fixes.
*   **Guidelines**:
    *   Direct commits to the `main` or `develop` branches are prohibited.
    *   All code changes must be submitted via a Pull Request (PR) to the `develop` branch.
    *   PRs must pass all automated test suites before being merged.

---

## 7. Environment Variables Setup Template

### Frontend (`.env.production`)
```env
VITE_FIREBASE_API_KEY=AIzaSyD-exampleKey
VITE_FIREBASE_AUTH_DOMAIN=fees-installment.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fees-installment
VITE_FIREBASE_STORAGE_BUCKET=fees-installment.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654:web:exampleAppId
VITE_API_BASE_URL=https://api-fees-tracker.render.com/api
```

### Backend (`.env`)
```env
FLASK_ENV=production
FLASK_APP=wsgi.py
PORT=10000
DATABASE_URL=mysql+pymysql://db_admin:secure_password@db-host.com:3306/fees_tracker
FIREBASE_CONFIG_JSON={"type":"service_account","project_id":"fees-installment",...}
ALLOWED_ORIGINS=https://fees-tracker.vercel.app
```

---

## 8. Risk Management & Mitigation

| Potential Risk | Severity | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Data Inconsistency**: Discrepancies between installment totals and total fee accounts. | Critical | Low | Enforce database check constraints and wrap payment changes in MySQL database transactions. |
| **System Downtime**: Flask service becomes unresponsive. | High | Low | Enable health check endpoints and configure auto-restart parameters on Render. |
| **Security Breach**: Unauthorized database access. | Critical | Low | Restrict database access to SSL connections only, configure firewall rules, and validate Firebase JWTs on every API endpoint. |
