-- MySQL relational database DDL initialization script
-- Fees Installment & Receipt Tracker

CREATE DATABASE IF NOT EXISTS fees_tracker;
USE fees_tracker;

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

-- Audit Indices for Performance Optimization
CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_installments_fee ON installments(fee_id);
CREATE INDEX idx_receipts_installment ON receipts(installment_id);
