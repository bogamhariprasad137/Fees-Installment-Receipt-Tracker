# Backend Schema Document
## Fees Installment & Receipt Tracker

---

## 1. Entity Relationship (ER) Diagram Description
The database is structured as a relational schema inside a MySQL database engine.

```text
  +-------------+             +--------------+             +----------+
  |    users    | 1         N |   students   | 1         1 |   fees   |
  +-------------+ ------------+--------------+ ------------+----------+
  | user_id (PK)|             |student_id(PK)|             |fee_id(PK)|
  | firebase_uid|             |parent_email  |             |student_id|
  | email       |             |user_id (FK)  |             |total_fee |
  | role        |             +--------------+             +----------+
  +-------------+                    | 1                        | 1
                                     |                          |
                                     | N                        | N
                              +--------------+             +--------------+
                              +------------------+             +--------------+
                              |     receipts     | N         1 | installments |
                              +------------------+ ------------+--------------+
                              |receipt_id (PK)   |             |install_id(PK)|
                              |installment_id(FK)|             |fee_id (FK)   |
                              |student_id (FK)   |             |amount        |
                              |student_name      |             +--------------+
                              +------------------+

```

### Cardinality Summary
*   `users` to `students` (**1:N**): One parent user profile can be linked to multiple student records matching by `parent_email`.
*   `students` to `fees` (**1:1**): Each student has exactly one active fee account tracker.
*   `fees` to `installments` (**1:N**): One student fee account is divided into multiple installment lines.
*   `installments` to `receipts` (**1:1**): Each paid installment produces exactly one payment receipt.
*   `students` to `receipts` (**1:N**): One student profile can accumulate multiple receipts.

---

## 2. Table Schemas & Definitions

### 2.1 Table: `users`
Tracks authorized users (Admins and Parents) registered in the system.
*   **Field: `user_id`** (INT, Primary Key, Auto Increment, Required)
*   **Field: `firebase_uid`** (VARCHAR(128), Unique, Required) - Maps to Firebase Authentication user record.
*   **Field: `email`** (VARCHAR(255), Unique, Required) - Registered login email address.
*   **Field: `role`** (ENUM('admin', 'parent'), Required, Default 'parent') - User role.
*   **Field: `created_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP`)
*   **Field: `updated_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)

### 2.2 Table: `students`
Stores personal and administrative profiles of enrolled students.
*   **Field: `student_id`** (INT, Primary Key, Auto Increment, Required)
*   **Field: `student_name`** (VARCHAR(255), Required)
*   **Field: `parent_name`** (VARCHAR(255), Required)
*   **Field: `parent_email`** (VARCHAR(255), Required) - Matching field to map parent login access.
*   **Field: `parent_phone`** (VARCHAR(20), Optional)
*   **Field: `class`** (VARCHAR(50), Required) - e.g., "Grade 5-A".
*   **Field: `admission_number`** (VARCHAR(100), Unique, Required) - Unique identifier.
*   **Field: `admission_date`** (DATE, Required)
*   **Field: `status`** (ENUM('active', 'inactive'), Required, Default 'active') - Roster visibility status.
*   **Field: `user_id`** (INT, Optional, Foreign Key references `users.user_id` ON DELETE SET NULL)
*   **Field: `created_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP`)
*   **Field: `updated_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)

### 2.3 Table: `fees`
Tracks the total fee balance accounts and category breakdowns (Admission, Term, Daycare) configured for students.
*   **Field: `fee_id`** (INT, Primary Key, Auto Increment, Required)
*   **Field: `student_id`** (INT, Unique, Required, Foreign Key references `students.student_id` ON DELETE CASCADE)
*   **Field: `admission_fee`** (DECIMAL(10, 2), Required, Validation: >= 0) - Allocated Admission Fee.
*   **Field: `admission_fee_paid`** (DECIMAL(10, 2), Required, Default 0.00, Validation: >= 0) - Paid Admission Fee.
*   **Field: `admission_fee_remaining`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `admission_fee - admission_fee_paid`.
*   **Field: `term_fee`** (DECIMAL(10, 2), Required, Validation: >= 0) - Allocated Term Fee.
*   **Field: `term_fee_paid`** (DECIMAL(10, 2), Required, Default 0.00, Validation: >= 0) - Paid Term Fee.
*   **Field: `term_fee_remaining`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `term_fee - term_fee_paid`.
*   **Field: `daycare_fee`** (DECIMAL(10, 2), Required, Validation: >= 0) - Allocated Daycare Fee.
*   **Field: `daycare_fee_paid`** (DECIMAL(10, 2), Required, Default 0.00, Validation: >= 0) - Paid Daycare Fee.
*   **Field: `daycare_fee_remaining`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `daycare_fee - daycare_fee_paid`.
*   **Field: `total_fee`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `admission_fee + term_fee + daycare_fee`.
*   **Field: `paid_amount`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `admission_fee_paid + term_fee_paid + daycare_fee_paid`.
*   **Field: `pending_amount`** (DECIMAL(10, 2), Generated/Stored, Validation: >= 0) - Calculated as `total_fee - paid_amount`.
*   **Field: `due_date`** (DATE, Required) - Core overall payment deadline.
*   **Field: `status`** (ENUM('paid', 'pending', 'overdue'), Required, Default 'pending')
*   **Field: `created_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP`)
*   **Field: `updated_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)

### 2.4 Table: `installments`
Breakdown schedules of student fees.
*   **Field: `installment_id`** (INT, Primary Key, Auto Increment, Required)
*   **Field: `fee_id`** (INT, Required, Foreign Key references `fees.fee_id` ON DELETE CASCADE)
*   **Field: `installment_number`** (INT, Required, Validation: > 0) - Segment order (e.g. 1, 2, 3).
*   **Field: `amount`** (DECIMAL(10, 2), Required, Validation: > 0)
*   **Field: `due_date`** (DATE, Required) - Payment deadline.
*   **Field: `payment_date`** (DATE, Optional, Default NULL) - Logged date when payment was verified.
*   **Field: `status`** (ENUM('unpaid', 'paid', 'overdue'), Required, Default 'unpaid')
*   **Field: `created_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP`)
*   **Field: `updated_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
*   **Constraint**: Unique combination of `(fee_id, installment_number)`.

### 2.5 Table: `receipts`
Transaction receipts generated upon logging installment payments.
*   **Field: `receipt_id`** (INT, Primary Key, Auto Increment, Required)
*   **Field: `receipt_number`** (VARCHAR(100), Unique, Required) - Audit code (format: `REC-YYYYMMDD-[InstallmentID]`).
*   **Field: `installment_id`** (INT, Unique, Required, Foreign Key references `installments.installment_id` ON DELETE RESTRICT)
*   **Field: `student_id`** (INT, Required, Foreign Key references `students.student_id` ON DELETE RESTRICT)
*   **Field: `student_name`** (VARCHAR(255), Required) - Stores an immutable snapshot of the student's name when the receipt is generated.
*   **Field: `amount_paid`** (DECIMAL(10, 2), Required, Validation: > 0)
*   **Field: `payment_date`** (DATE, Required) - Logged date of transaction.
*   **Field: `payment_method`** (ENUM('cash', 'bank_transfer', 'cheque', 'card'), Required)
*   **Field: `pdf_path`** (VARCHAR(512), Required) - Server-side path of the static PDF file.
*   **Field: `created_at`** (TIMESTAMP, Required, Default `CURRENT_TIMESTAMP`)

---

## 3. SQL DDL Generation Script

```sql
-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(128) DEFAULT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'parent') NOT NULL DEFAULT 'parent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) DEFAULT NULL,
    class VARCHAR(50) NOT NULL,
    admission_number VARCHAR(100) NOT NULL UNIQUE,
    admission_date DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    user_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_student_parent_email (parent_email),
    INDEX idx_student_admission (admission_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Fees Table
CREATE TABLE IF NOT EXISTS fees (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    admission_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    admission_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    admission_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee - admission_fee_paid) STORED,
    term_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    term_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    term_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (term_fee - term_fee_paid) STORED,
    daycare_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    daycare_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    daycare_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (daycare_fee - daycare_fee_paid) STORED,
    total_fee DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee + term_fee + daycare_fee) STORED,
    paid_amount DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee_paid + term_fee_paid + daycare_fee_paid) STORED,
    pending_amount DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee_remaining + term_fee_remaining + daycare_fee_remaining) STORED,
    due_date DATE NOT NULL,
    status ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CHECK (admission_fee >= 0),
    CHECK (admission_fee_paid >= 0),
    CHECK (term_fee >= 0),
    CHECK (term_fee_paid >= 0),
    CHECK (daycare_fee >= 0),
    CHECK (daycare_fee_paid >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Installments Table
CREATE TABLE IF NOT EXISTS installments (
    installment_id INT AUTO_INCREMENT PRIMARY KEY,
    fee_id INT NOT NULL,
    installment_number INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE DEFAULT NULL,
    status ENUM('unpaid', 'paid', 'overdue') NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fee_id) REFERENCES fees(fee_id) ON DELETE CASCADE,
    CHECK (amount > 0),
    UNIQUE KEY uq_fee_installment (fee_id, installment_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    installment_id INT NOT NULL UNIQUE,
    student_id INT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'cheque', 'card') NOT NULL,
    pdf_path VARCHAR(512) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (installment_id) REFERENCES installments(installment_id) ON DELETE RESTRICT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE RESTRICT,
    CHECK (amount_paid > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


---

## 4. API Request & Response JSON Schemas

### 4.1 Create Student (POST `/api/students`)
*   **Request Schema**:
    ```json
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "OBJECT",
      "properties": {
        "student_name": { "type": "STRING", "minLength": 2 },
        "parent_name": { "type": "STRING", "minLength": 2 },
        "parent_email": { "type": "STRING", "format": "email" },
        "parent_phone": { "type": "STRING", "pattern": "^[0-9+\\-\\s()]{7,20}$" },
        "class": { "type": "STRING", "minLength": 1 },
        "admission_number": { "type": "STRING", "minLength": 3 },
        "admission_date": { "type": "STRING", "format": "date" },
        "admission_fee": { "type": "NUMBER", "minimum": 0 },
        "term_fee": { "type": "NUMBER", "minimum": 0 },
        "daycare_fee": { "type": "NUMBER", "minimum": 0 },
        "initial_payment": { "type": "NUMBER", "minimum": 0 },
        "due_date": { "type": "STRING", "format": "date" },
        "installment_due_dates": { "type": "ARRAY", "items": { "type": "STRING", "format": "date" } },
        "payment_schedule": { "type": "STRING" },
        "notes": { "type": "STRING" }
      },
      "required": [
        "student_name", "parent_name", "parent_email", "class", 
        "admission_number", "admission_date", "admission_fee", 
        "term_fee", "daycare_fee", "initial_payment", "due_date"
      ]
    }
    ```
*   **Response Schema (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "student_id": 1,
        "student_name": "Alice Smith",
        "parent_name": "John Smith",
        "parent_email": "john.smith@family.com",
        "parent_phone": "+919876543210",
        "class": "Grade 5",
        "admission_number": "ADM5002",
        "admission_date": "2026-06-01",
        "status": "active",
        "fees": {
          "admission_fee": 5000.00,
          "term_fee": 15000.00,
          "daycare_fee": 10000.00,
          "total_fee": 30000.00,
          "paid_amount": 5000.00,
          "pending_amount": 25000.00,
          "due_date": "2026-07-01",
          "status": "pending"
        }
      }
    }
    ```

### 4.2 Split Installments (POST `/api/fees/installments`)
*   **Request Schema**:
    ```json
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "OBJECT",
      "properties": {
        "fee_id": { "type": "INTEGER" },
        "installments": {
          "type": "ARRAY",
          "minItems": 1,
          "items": {
            "type": "OBJECT",
            "properties": {
              "installment_number": { "type": "INTEGER", "minimum": 1 },
              "amount": { "type": "NUMBER", "minimum": 0.01 },
              "due_date": { "type": "STRING", "format": "date" }
            },
            "required": ["installment_number", "amount", "due_date"]
          }
        }
      },
      "required": ["fee_id", "installments"]
    }
    ```
*   **Response Schema (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "fee_id": 12,
        "total_fee": 1500.00,
        "installments_count": 3,
        "installments": [
          { "installment_id": 31, "installment_number": 1, "amount": 500.00, "status": "unpaid" },
          { "installment_id": 32, "installment_number": 2, "amount": 500.00, "status": "unpaid" },
          { "installment_id": 33, "installment_number": 3, "amount": 500.00, "status": "unpaid" }
        ]
      }
    }
    ```

### 4.3 Log Payment (POST `/api/payments`)
*   **Request Schema**:
    ```json
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "OBJECT",
      "properties": {
        "installment_id": { "type": "INTEGER" },
        "payment_date": { "type": "STRING", "format": "date" },
        "payment_method": { "type": "STRING", "enum": ["cash", "bank_transfer", "cheque", "card"] }
      },
      "required": ["installment_id", "payment_date", "payment_method"]
    }
    ```
*   **Response Schema (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "receipt_id": 45,
        "receipt_number": "REC-20260613-31",
        "installment_id": 31,
        "student_id": 12,
        "student_name": "Alice Smith",
        "amount_paid": 500.00,
        "payment_date": "2026-06-13",
        "payment_method": "bank_transfer",
        "pdf_url": "/api/receipts/download/45"
      }
    }
    ```

### 4.4 Parent Activation (POST `/api/auth/activate-parent`)
This endpoint verifies the parent user's profile during first-time self-signup and updates their Firebase UID.
*   **Request Schema**:
    ```json
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "OBJECT",
      "properties": {
        "email": { "type": "STRING", "format": "email" }
      },
      "required": ["email"]
    }
    ```
*   **Response Schema (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "user_id": 8,
        "email": "parent@example.com",
        "role": "parent",
        "status": "activated"
      }
    }
    ```

### 4.5 Admin Dashboard Stats (GET `/api/admin/dashboard-stats`)
Returns financial aggregations, active school roster size, and chart data.
*   **Request Schema**: None (Authorized Admin Token required in Header).
*   **Response Schema (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "total_students": 142,
        "total_fees_allocated": 120500.00,
        "total_fees_collected": 84500.00,
        "pending_fees": 36000.00,
        "overdue_fees": 15600.00,
        "charts": {
          "admission_fee_collection": { "allocated": 30000.00, "collected": 25000.00 },
          "term_fee_collection": { "allocated": 60500.00, "collected": 44500.00 },
          "daycare_fee_collection": { "allocated": 30000.00, "collected": 15000.00 },
          "monthly_collections": [
            { "month": "Jan", "amount": 12000.00 },
            { "month": "Feb", "amount": 15000.00 },
            { "month": "Mar", "amount": 18000.00 },
            { "month": "Apr", "amount": 10000.00 },
            { "month": "May", "amount": 14500.00 },
            { "month": "Jun", "amount": 15000.00 }
          ],
          "paid_vs_pending": { "paid": 84500.00, "pending": 36000.00 },
          "category_distribution": { "admission": 25000.00, "term": 44500.00, "daycare": 15000.00 }
        }
      }
    }
    ```

