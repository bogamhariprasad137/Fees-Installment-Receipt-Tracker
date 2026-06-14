# Product Requirements Document (PRD)
## Fees Installment & Receipt Tracker

---

## 1. Executive Summary
The **Fees Installment & Receipt Tracker** is a production-grade, full-stack administrative and customer-facing portal designed to manage student fee schedules, customized installment timelines, manual payment logging, and automated PDF receipt generation for educational institutions. The application serves two main user demographics: **Administrators (Registrars/Financial Officers)**, who require rapid lookup, bulk updates, payment logging, and administrative reporting; and **Parents**, who require mobile-optimized self-service views of installment schedules, pending balances, and instant downloads of official PDF receipts. By centralizing records in a standard relational database (MySQL) and leveraging industry-standard authentication (Firebase Authentication), the application guarantees zero data discrepancies, secure access, and a reduced administrative load.

This version of the tracker explicitly details and partitions student billing into **Admission Fee**, **Term Fee**, and **Daycare Fee** categories, standardizes all transactions globally to **Indian Rupees (₹/INR)**, and enforces automated calculation checks.

---

## 2. Product Vision
To establish an error-free, auditable, and transparent financial logging platform for schools. The software bridges the information gap between school treasurers and parents, replacing manual spreadsheets, physical invoice books, and back-and-forth email/phone inquiries with a secure, real-time portal.

---

## 3. Problem Statement
Many educational institutions rely on fragmented systems (e.g., spreadsheets, paper receipt books, standalone accounting tools) to track student fees. This results in:
*   **Operational Errors**: Discrepancies between total fees billed, amounts paid, and pending balances.
*   **Lack of Parent Transparency**: Parents do not have real-time visibility into their installment structures, due dates, or historical payments, leading to late payments and query overhead.
*   **Manual Receipt Issuance**: Registrars spend hours generating physical or digital receipts manually upon payment confirmation.
*   **Fragmented Reporting**: Compiling school-wide summaries of outstanding receivables vs. actual collections requires tedious manual data consolidation.

---

## 4. Goals & Business Objectives
*   **Operational Speed**: Reduce time to log payments and generate receipts by 80% through automated forms and on-the-fly PDF creation.
*   **Payment Collection Time**: Accelerate cash flows by presenting parents with explicit installment due dates and automatic "Overdue" visual warnings.
*   **Administrative Relief**: Decrease phone and email inquiries regarding receipt retrieval by 70% by providing self-service parent downloads.
*   **Data Auditability**: Maintain 100% mathematical alignment between transaction ledgers, installment statuses, and the master student fee accounts.

---

## 5. User Personas

### 5.1 Persona A: School Registrar / Administrator (Sarah)
*   **Background**: Sarah manages registration and financial records for a school with 600+ students. She is highly organized but operates under severe time constraints, especially during the start of terms.
*   **Daily Workflow**: Enrolls new students, sets up tuition fee targets (Admission, Term, Daycare), splits billing into custom installments, logs bank transfers/cheques, and prints receipts.
*   **Needs**: Fast, keyboard-friendly search; bulk lists; immediate validation to prevent input errors; instant PDF generation.
*   **Pain Points**: Tired of manually cross-referencing bank statements, copy-pasting numbers into Excel, and typing Word documents to email receipts to parents.

### 5.2 Persona B: Parent (David)
*   **Background**: David is a busy software developer with two children attending the school. He manages household bills primarily on his mobile phone during his commute or late in the evening.
*   **Daily Workflow**: Receives email updates from the school, checks outstanding balances, verifies if his wife already made a payment, and downloads receipts to claim tax deductions or corporate allowances.
*   **Needs**: Fast, mobile-responsive layout; a clear overview of due dates; single-tap PDF downloads of historical receipts; clean navigation.
*   **Pain Points**: Loses paper receipts; forgets installment due dates; finds school portals frustrating to navigate on mobile.

---

## 6. User Roles & Access Control Matrix

The system enforces two strict user roles. The capabilities are partitioned as follows:

| Feature / Capability | Admin Role | Parent Role | Guest (Unauthenticated) |
| :--- | :---: | :---: | :---: |
| **Authenticate (Login / Logout)** | Yes | Yes | Yes |
| **Add / Edit / Archive Students** | Yes | No | No |
| **View Student Roster / Profiles** | Yes | Read-Only (Own Child) | No |
| **Create Base Fee Records** | Yes | No | No |
| **Set Custom Installment Schedules** | Yes | No | No |
| **Log Payments (Mark Paid)** | Yes | No | No |
| **Generate PDF Receipts (ReportLab)** | Yes | No | No |
| **Download PDF Receipts** | Yes | Yes (Own Child) | No |
| **View Dashboard Metrics & Charts** | Yes | No | No |
| **Export Financial Reports (PDF)** | Yes | No | No |

---

## 7. User Stories & Detailed Scenarios

### 7.1 Administrator User Stories (ADM)
*   **ADM-001 [Authentication]**: As an Admin, I want to log in using my school credentials so that I can securely manage the school's financial records.
*   **ADM-002 [Student Registration]**: As an Admin, I want to register a student and input their Admission, Term, and Daycare fees so that the system automatically calculates the Total Fee.
*   **ADM-003 [Installment Setup]**: As an Admin, I want to split a student's total fee into custom installment amounts with specific due dates so that we can accommodate custom payment plans.
*   **ADM-004 [Payment Logging]**: As an Admin, I want to mark an installment as "Paid" with the payment date and method (Cash, Bank Transfer, Card, Cheque) so that the student's ledger balances update in real-time.
*   **ADM-005 [PDF Generation]**: As an Admin, I want the system to generate a tamper-proof PDF receipt automatically upon payment confirmation so that the transaction is officially recorded.
*   **ADM-006 [Global Reporting]**: As an Admin, I want to view overdue summaries, search metrics, and export data in PDF format so that I can report collections progress to the school board.

### 7.2 Parent User Stories (PAR)
*   **PAR-001 [Authentication]**: As a Parent, I want to log in securely with my registered email so that I can access my children's financial records.
*   **PAR-002 [Dashboard Summary]**: As a Parent, I want to view a visual summary of my children's Admission, Term, and Daycare fees, paid amounts, and outstanding balances in Indian Rupees (₹) so that I understand our payment status at a glance.
*   **PAR-003 [Payment Timeline]**: As a Parent, I want to view an interactive vertical timeline of all installments with payment statuses and due dates so that I can plan upcoming payments.
*   **PAR-004 [Self-Service Download]**: As a Parent, I want to download official PDF receipts and statements for all paid installments so that I can print or file them.

---

## 8. Functional Requirements

### 8.1 Authentication & Authorization
*   **FR-1.1**: The system must utilize Firebase Authentication (Email/Password) for core identity verification.
*   **FR-1.2**: User roles (`admin` or `parent`) must be stored in the MySQL database and checked on every API request.
*   **FR-1.3**: Upon successful login, the frontend must intercept the Firebase JWT and request role confirmation from `/api/auth/role` to redirect the user to the correct dashboard.
*   **FR-1.4**: All API routes (except `/api/auth/login` and `/api/auth/reset-password`) must require a valid Firebase ID Token (JWT) in the `Authorization: Bearer <token>` header.
*   **FR-1.5 [Parent Signup/Activation Flow]**: When an Admin registers a student, the backend checks if the parent email is in the `users` table. If not, it creates a placeholder user record with `role = 'parent'` and `firebase_uid = NULL`. When the parent signs up on the frontend, the client logs in with Firebase and sends the JWT token. The backend verifies the email and maps the Firebase UID to the placeholder user record.
*   **FR-1.6 [Password Reset Flow]**: The frontend must provide a "Forgot Password" link on the login screen. This link triggers the Firebase Authentication Client SDK method `sendPasswordResetEmail()` to send a secure recovery link. The system does not store or manage passwords directly.

### 8.2 Student Management & Split Fees
*   **FR-2.1**: The Admin must be able to create new student records. The registration form must require:
    *   **Student Info**: Student Name, Parent Name, Parent Email (must be valid format), Parent Phone (must be valid phone format), Class/Grade, Admission Number (must be unique), Admission Date.
    *   **Fee Info**: Admission Fee, Term Fee, Daycare Fee, Initial Payment.
    *   **Deadline Info**: Fee Due Date, Installment Due Dates, Payment Schedule.
    *   **Additional Notes**.
*   **FR-2.2**: The system must automatically calculate and track separate balances for each category (Admission Fee, Term Fee, Daycare Fee):
    *   `Remaining Admission Fee = Allocated Admission Fee - Paid Admission Fee`
    *   `Remaining Term Fee = Allocated Term Fee - Paid Term Fee`
    *   `Remaining Daycare Fee = Allocated Daycare Fee - Paid Daycare Fee`
    *   `Total Fee = Admission Fee + Term Fee + Daycare Fee`
    *   `Paid Amount = Paid Admission + Paid Term + Paid Daycare`
    *   `Pending Amount = Total Fee - Paid Amount`
*   **FR-2.3**: The system must assign a `Fee Status` according to the following rules:
    *   `Paid`: Pending Amount = 0
    *   `Pending`: Pending Amount > 0 and Due Date not passed
    *   `Overdue`: Pending Amount > 0 and Due Date passed
*   **FR-2.4**: The system must support searching the student database by Student Name, Class, Admission Number, or Parent Email.
*   **FR-2.5 [Student Archival and Soft-Delete]**: Admins cannot delete a student if the student has paid installments or receipts. The system must restrict deletion and enforce soft-deletion (setting status to `Inactive`). If the student has zero payments logged, deletion is allowed, which cascade-deletes outstanding unpaid installments and fee accounts.

### 8.3 Fee & Installment Setup
*   **FR-3.1**: Each student must have a single active fee account configuration defining the split fees (`Admission Fee`, `Term Fee`, `Daycare Fee`), `Total Fee`, and overall `Due Date`.
*   **FR-3.2**: Admins must be able to divide the total fee into custom installment rows (e.g. 1 to 10 parts).
*   **FR-3.3**: The system must enforce that the sum of all installment amounts equals the configured `Total Fee` before saving.
*   **FR-3.4**: If the sum does not match, the transaction must be aborted, and a detailed error message must be returned to the Admin.
*   **FR-3.5 [Partial Installment Configuration Flow]**: If installments are already partially paid, the Admin must not be allowed to modify or delete the `Paid` installments. They may add, remove, or modify `Unpaid` installments, provided that the sum of `Paid` installments plus the new `Unpaid` installments equals the student's `Total Fee`.

### 8.4 Payment Processing & Receipt Engine
*   **FR-4.1**: Admins must be able to log payment for an installment by inputting the `Payment Date` and `Payment Method` (Cash, Bank Transfer, Cheque, Card).
*   **FR-4.2**: The backend must run the payment logic inside a SQL transaction:
    1.  Update the installment status to `Paid` and record the payment date.
    2.  Increment the student's `paid_amount` and decrement the `pending_amount` in the `fees` table.
    3.  Generate a unique receipt number (format: `REC-YYYYMMDD-[InstallmentID]`).
    4.  Invoke the ReportLab service to compile the official PDF receipt and save it to the server static storage.
    5.  Insert a record into the `receipts` table with the generated file path.
*   **FR-4.3**: Both Admins and Parents must be able to query and download the generated PDF receipt through a secured API endpoint `/api/receipts/download/<receipt_id>`.

### 8.5 Reporting & Analytics
*   **FR-5.1**: The Admin dashboard must display dynamic metrics: Total Students, Total Fees Collected, Pending Fees, and Overdue Fees. (Note: Fees Allocated card is deprecated).
*   **FR-5.2**: The Admin dashboard must display fee-management analytics (Admission Fee Collection progress, Term Fee Collection progress, Daycare Fee Collection progress, Paid vs Pending ratio, and Fee Category Distribution). (Note: Monthly Collections chart and generic analytics visuals are removed).
*   **FR-5.3**: The Admin dashboard must display an **Overdue Accounts Table** sorted by most overdue (columns: Student Name, Parent Name, Outstanding Amount, Due Date, Days Overdue, Status), highlighting overdue rows. All legacy widgets (Recent Payments, Upcoming Due Dates, Overdue Accounts list widget, Recent Registrations list) are removed completely.
*   **FR-5.4**: The primary export format for all logs, statements, receipts, and history ledgers must be **PDF**. CSV is deprecated.

---

## 9. Non-Functional Requirements

### 9.1 Security & Compliance
*   **NFR-1.1**: All API endpoints must validate incoming Firebase JWT tokens.
*   **NFR-1.2**: Cross-Origin Resource Sharing (CORS) must be configured to allow requests only from the verified production domain.
*   **NFR-1.3**: SQL Injection protection: Parameterized queries must be used for all database operations (e.g., using PyMySQL parameterized inputs or SQLAlchemy ORM).
*   **NFR-1.4**: Parents must be restricted to viewing and downloading records associated only with their children (verified by comparing the JWT email claim against the student's `parent_email` field).

### 9.2 Performance & Reliability
*   **NFR-2.1**: Page loads and API responses (excluding PDF generation) must resolve in less than 300ms.
*   **NFR-2.2**: ReportLab PDF generation must compile and save in under 800ms.
*   **NFR-2.3**: Database connection pool must support up to 50 concurrent active connections with automatic timeout cleanup.

### NFR-3: Usability & Mobile Layout
*   **NFR-3.1**: The parent portal must be optimized for mobile devices, using responsive flexbox layouts and touch-friendly targets (minimum size 44px x 44px).
*   **NFR-3.2**: Accessibility guidelines: Follow WCAG 2.1 AA standards for colors, contrast, and form layouts.
*   **NFR-3.3**: Visual standardizations: Standardize on Manrope 700 headings and Inter 400/500 body font stack. Currency displays must strictly render the Indian Rupee symbol (₹).

---

## 10. Scope Boundaries

### 10.1 In Scope
*   Firebase Authentication integration for identity verification.
*   CRUD interfaces for Student profiles and Split Fee assignments.
*   Custom installment configurations and manual payment logging.
*   ReportLab backend PDF compilation and secure downloads.
*   Responsive Admin and Parent dashboards with ₹/INR standards.
*   PDF reports export for billing summaries.

### 10.2 Out of Scope
*   Online payment processing gateways (e.g. Stripe, PayPal integration). Payments are received offline and logged manually.
*   Automatic email notifications.
*   Multi-school tenanting support (built for a single school instance).
*   Non-financial student data tracking (e.g., grades, attendance).

---

## 11. Success Metrics
*   **Financial Visibility**: 100% database consistency between installments and master student ledgers.
*   **Administrative Efficiency**: Payment processing time reduced from minutes to seconds.
*   **Self-Service Adoption**: At least 85% of parents download receipts directly instead of requesting them from the office.
*   **System Reliability**: Zero lost transactions during concurrent payment logging.

---

## 12. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| Admin logs wrong payment details. | High | Medium | Implement an "Edit Payment Log" feature that logs edits in an audit history and updates balances accordingly. |
| Multiple admins log payments concurrently, causing race conditions. | High | Low | Enforce InnoDB row-level locking on the `fees` and `students` tables during payment transactions. |
| Firebase service becomes temporarily unavailable. | High | Low | Implement robust API token verification caching and clear user error messages. |

---

## 13. Project Assumptions
*   The school administration uses desktop computers with modern web browsers (Chrome, Edge, Safari, Firefox).
*   Parents have internet access via mobile devices or desktops.
*   Each student profile is registered with a single primary parent email, which is used to match their Firebase account.

---

## 14. Detailed Acceptance Criteria (Gherkin Scenarios)

### Scenario 1: Admin configures fee installments
*   **Given** that the Admin is logged in and viewing the Fee Configuration page for student "Jane Doe" (ID: 5) who has a `Total Fee` of `₹15,000.00`.
*   **When** the Admin adds three installments:
    *   Installment 1: `₹5,000.00`
    *   Installment 2: `₹5,000.00`
    *   Installment 3: `₹5,000.00`
    And clicks the "Save Installments" button.
*   **Then** the system must validate that `₹5,000 + ₹5,000 + ₹5,000 = ₹15,000`, write the three installment rows to the database with status `Unpaid`, and display a success toast: "Installment schedule saved successfully."

### Scenario 2: Admin configures invalid fee installments
*   **Given** that the Admin is logged in and viewing the Fee Configuration page for student "Jane Doe" (ID: 5) who has a `Total Fee` of `₹15,000.00`.
*   **When** the Admin adds two installments:
    *   Installment 1: `₹6,000.00`
    *   Installment 2: `₹8,000.00`
    And clicks the "Save Installments" button.
*   **Then** the system must calculate that `₹6,000 + ₹8,000 = ₹14,000` (does not match `₹15,000`), block the database transaction, keep the configuration screen active, and display a validation error message: "Error: The sum of installments (₹14,000.00) does not match the student's total fee (₹15,000.00)."

### Scenario 3: Admin logs a payment
*   **Given** that the Admin is logged in and viewing the installment details for student "Jane Doe", who has an outstanding installment of `₹5,000.00` with status `Unpaid`.
*   **When** the Admin clicks "Log Payment", enters payment date "2026-06-13", selects "Bank Transfer", and submits.
*   **Then** the system must:
    1.  Update the installment status to `Paid` in the database.
    2.  Increase the student's `paid_amount` by `₹5,000.00` and decrease the `pending_amount` by `₹5,000.00`.
    3.  Generate an official PDF receipt using ReportLab.
    4.  Save the PDF path in the database.
    5.  Display a success message with a download link: "Payment logged. Download Receipt [REC-20260613-24]."
