# Technical Requirements Document (TRD)
## Fees Installment & Receipt Tracker

---

## 1. System Architecture
The application uses a decoupled Client-Server architecture to separate concerns, facilitate deployment, and enforce role-based access controls.

```mermaid
graph TD
    ClientSPA[React Frontend - Vercel] <-->|HTTPS REST API + JWT| FlaskServer[Python Flask API - Render]
    ClientSPA <-->|ID Token Request| FirebaseAuth[Firebase Authentication]
    FlaskServer <-->|verify_id_token| FirebaseAuth
    FlaskServer <-->|SQL Queries / Connection Pool| MySQLDB[(MySQL Database)]
    FlaskServer -->|Generate PDF| ReportLab[ReportLab Engine]
    ReportLab -->|Write PDF File| LocalStorage[/Static Storage/]
```

### Components
1.  **Frontend (React Client SPA)**: Compiles static assets using Vite, handles route navigation, processes form validations, and displays dashboards. Deployed on Vercel.
2.  **Backend (Python Flask REST API)**: Manages core business logic, verifies authentication tokens, executes database transactions, and generates PDF receipts. Runs in a Docker container on Render.
3.  **Database (MySQL Relational DB)**: Stores structural tables (users, students, fees, installments, receipts). Enforces ACID transaction criteria via InnoDB.
4.  **Identity Provider (Firebase Auth)**: Manages secure registration, credential storage, and password reset flows.

---

## 2. Frontend Architecture & Routing Rules
The React frontend is set up as a Single Page Application (SPA).

### 2.1 Technology Stack
*   **Vite**: Frontend toolchain for fast builds and hot module replacement.
*   **React 18**: Dynamic UI rendering.
*   **React Router DOM v6**: Client-side routing with route guards.
*   **Axios**: HTTP client with request/response interceptors.

### 2.2 Route Guard Logical Implementation
All page routes are wrapped in route guards to restrict unauthorized access:
*   `PublicRoute`: Access restricted to unauthenticated users (redirects to dashboard if logged in).
*   `ProtectedRoute`: Access restricted to authenticated users (redirects to `/login` if no JWT is present).
*   `RoleProtectedRoute`: Validates that the user's role match the required page access (e.g., redirecting a Parent to a 403 Forbidden page if they try to access `/admin/*` routes).

```javascript
// Example React Route Guard Logic
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  
  return <Outlet />;
};
```

### 2.3 Axios API Client Interceptor
```javascript
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
```

---

## 3. Backend Architecture & App Layout
The Python backend uses Flask, configured with Blueprints to split routes cleanly.

### 3.1 Directory Layout
```text
/backend
├── app/
│   ├── __init__.py          # Flask Application Factory
│   ├── config.py            # Environment configurations
│   ├── database.py          # SQLAlchemy engine and session pool
│   ├── middleware.py        # Firebase Auth verification decorators
│   ├── routes/              # Blueprint routes
│   │   ├── auth.py
│   │   ├── students.py
│   │   ├── fees.py
│   │   ├── installments.py  # Installment management endpoints
│   │   └── receipts.py
│   └── services/            # Internal business services
│       ├── pdf_service.py   # ReportLab PDF compile
│       └── report_service.py
├── tests/
├── Dockerfile
├── requirements.txt
└── wsgi.py

```

### 3.2 Python Firebase Auth Decorator
The backend verifies the Firebase JWT token on every protected API call using a custom python decorator:

```python
from functools import wraps
from flask import request, jsonify, g
import firebase_admin
from firebase_admin import auth
from app.database import get_db_connection

def require_auth(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Missing token"}}), 401
            
            token = auth_header.split(' ')[1]
            try:
                # Verify JWT token with Firebase Admin SDK
                decoded_token = auth.verify_id_token(token)
                email = decoded_token.get('email')
                
                # Check user profile and role in MySQL database
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    cursor.execute("SELECT user_id, role FROM users WHERE email = %s", (email,))
                    user = cursor.fetchone()
                
                if not user:
                    return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "User profile not registered"}}), 403
                
                g.current_user = {
                    "user_id": user['user_id'],
                    "email": email,
                    "role": user['role']
                }
                
                if allowed_roles and g.current_user['role'] not in allowed_roles:
                    return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Access denied"}}), 403
                
            except Exception as e:
                return jsonify({"success": False, "error": {"code": "UNAUTHORIZED", "message": "Invalid or expired token"}}), 401
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

---

## 4. Database Engine Details
*   **MySQL Version**: 8.0+
*   **Storage Engine**: InnoDB. Uses transactional support, row-level locking, and foreign keys.
*   **Connection Configuration**: SQLAlchemy ORM or PyMySQL connection pooling.
*   **Pool Settings**:
    *   `pool_size`: 15 (Standard pool size)
    *   `max_overflow`: 10 (Allow overflow for concurrent spikes)
    *   `pool_recycle`: 1800 (Recycle connections every 30 minutes to prevent database timeouts)

---

## 5. Firebase Authentication Lifecycle
*   **Storage**: Credentials, hash logic, password recovery, and emails are managed by Firebase.
*   **Authentication Flow**:
    1.  Frontend prompts user for email and password.
    2.  Firebase Client SDK authenticates inputs and returns an ID Token (JWT).
    3.  Frontend stores this token in memory and uses it for subsequent backend requests.
    4.  JWT has a 1-hour expiration; the React client automatically refreshes the token in the background using the Firebase Auth observer.

---

## 6. API Architecture & Standards
All APIs are RESTful, with endpoints structured logically and returning JSON payloads.

### 6.1 Standard Return Headers
*   `Content-Type: application/json`
*   `X-Content-Type-Options: nosniff`
*   `X-Frame-Options: DENY`

### 6.2 Primary REST Endpoints
*   `POST /api/auth/activate-parent` - Exchanges verified Firebase JWT to activate a parent account by mapping `firebase_uid` to the pre-registered student's `parent_email` placeholder.
*   `GET /api/auth/profile` - Retrieve role and profile metadata of the authenticated user.
*   `GET /api/admin/dashboard-stats` - Retrieve administrative dashboard summary metrics (Total Students, Total Fees Collected, Pending Fees, Overdue Fees) and the Overdue Accounts Table records (sorted by most overdue, including Student Name, Parent Name, Outstanding Amount, Due Date, Days Overdue, and Status). The Fees Allocated metric card, Monthly collections chart, and recent registrations/payments widgets are removed.
*   `GET /api/students` - Retrieve student roster for the Student Directory `/admin/students` route (search, class, and status filters supported).
*   `POST /api/students` - Create a student profile. Required payload:
    *   **Student Info**: `student_name`, `parent_name`, `parent_email`, `parent_phone`, `class`, `admission_number`, `admission_date`
    *   **Fee Info**: `admission_fee`, `term_fee`, `daycare_fee`, `initial_payment`
    *   **Schedule/Note**: `due_date`, `installment_due_dates`, `payment_schedule`, `notes`
    *   *Auto-calculated fields on save*: `total_fee` = `admission_fee` + `term_fee` + `daycare_fee`; category splits paid amounts (using strict priority allocation Admission -> Term -> Daycare); `pending_amount` = `total_fee` - `paid_amount`; `status` = `Paid` / `Pending` / `Overdue` based on math rules.
*   `PUT /api/students/<id>` - Update student profile details and fee splits.
*   `DELETE /api/students/<id>` - Hard delete a student. Enforces database constraints: rejects deletion with 400 Bad Request if the student has paid installments or receipts.
*   `GET /api/students/<id>/installments` - Query installment structures for a specific student. Called on the separate Fee Management Route `/admin/fee-management`.
*   `POST /api/fees/installments` - Create or overwrite installment schedules. Validates that the sum of installments matches the total fee. Enforces that Paid installments cannot be deleted or modified.
*   `POST /api/payments` - Log payments against installments and trigger PDF generation. Applies payment using priority allocation engine (Admission first, then Term, then Daycare).
*   `GET /api/receipts` - Retrieve historical log of all generated receipts (Admins only).
*   `GET /api/receipts/download/<id>` - Secure download of a specific PDF receipt (Streams binary file).
*   `GET /api/parent/dashboard` - Fetches all child student records, individual fee splits (`admission_fee`, `term_fee`, `daycare_fee` - Allocated, Paid, and Remaining balances for each), total fees, paid/pending amounts, and installment progress/receipts linked to the parent's email.
*   `GET /api/reports/export` - Compiles and exports institutional billing/receivable reports in PDF format.

---

## 7. Security Implementation
*   **SQL Injection Protection**: The application uses SQLAlchemy ORM or parameterized queries in PyMySQL. Raw SQL string formatting is strictly forbidden.
*   **CORS Policies**: Strict CORS configuration blocks access from unauthorized domains:
    ```python
    from flask_cors import CORS
    CORS(app, resources={r"/api/*": {"origins": ["https://fees-tracker.vercel.app"]}})
    ```
*   **XSS Protection**: HTML inputs are sanitized on the frontend. The backend escapes output rendering to prevent scripting injections.
*   **Role Enforcement**: Every API route enforces the required user role (`admin` or `parent`) using the `require_auth` decorator.
*   **Data Isolation (Parent Ownership Verification)**: When a user with the `parent` role queries student or installment data (e.g. `/api/students/<id>/installments`), the backend must execute an ownership check verifying that the requested `student_id` belongs to a student whose `parent_email` matches the logged-in parent's email:
    ```python
    # Verify Parent ownership before returning child records
    if g.current_user['role'] == 'parent':
        cursor.execute("SELECT parent_email FROM students WHERE student_id = %s", (student_id,))
        student = cursor.fetchone()
        if not student or student['parent_email'] != g.current_user['email']:
            return jsonify({"success": False, "error": {"code": "FORBIDDEN", "message": "Unauthorized student access"}}), 403
    ```
*   **Financial Audit Safeguard (Deletion Block)**: If an Admin calls `DELETE /api/students/<id>`, the backend must query if the student has any logged receipts before executing deletion. If receipts exist, the action is blocked, forcing soft archival instead:
    ```python
    cursor.execute("SELECT COUNT(*) as count FROM receipts WHERE student_id = %s", (student_id,))
    if cursor.fetchone()['count'] > 0:
        return jsonify({"success": False, "error": {"code": "RESTRICTED", "message": "Cannot delete student with transaction history. Set status to Inactive instead."}}), 400
    ```


---

## 8. Deployment Infrastructure
*   **Frontend (Vercel)**:
    *   Deploys static builds generated by Vite.
    *   Uses rewrite rules in `vercel.json` to handle client-side routing fallback:
        ```json
        {
          "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
        }
        ```
*   **Backend (Render)**:
    *   Runs inside a lightweight Docker container built on `python:3.10-slim`.
    *   Managed by Gunicorn, running 3 worker threads.
*   **Database (MySQL)**:
    *   Hosted on a managed MySQL platform with SSL connections enforced.

---

## 9. Environment Variables
To prevent sensitive keys from leaking, the system requires the following environment variables:

### 9.1 Frontend (.env.production)
```env
VITE_FIREBASE_API_KEY=AIzaSyD-exampleKey
VITE_FIREBASE_AUTH_DOMAIN=fees-installment.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fees-installment
VITE_FIREBASE_STORAGE_BUCKET=fees-installment.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321
VITE_FIREBASE_APP_ID=1:987654:web:exampleAppId
VITE_API_BASE_URL=https://api-fees-tracker.render.com/api
```

### 9.2 Backend (.env)
```env
FLASK_ENV=production
FLASK_APP=wsgi.py
PORT=10000
DATABASE_URL=mysql+pymysql://db_admin:secure_password@db-host.com:3306/fees_tracker
FIREBASE_CONFIG_JSON={"type":"service_account","project_id":"fees-installment",...}
ALLOWED_ORIGINS=https://fees-tracker.vercel.app
```

---

## 10. Logging & Error Handling Strategy
*   **Global Error Handler**:
    ```python
    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"Server Error: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred. Please contact support."
            }
        }), 500
    ```
*   **Logging Config**: Standard out logging captured by Render's native logs platform. Includes datetime, log level, request path, and error stack trace for easy debugging.
