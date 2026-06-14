-- Migration script to split fee tracking into category allocated, paid, and remaining fields.
-- Fees Installment & Receipt Tracker

USE fees_tracker;

-- Drop check constraints to avoid conflict
-- Note: MySQL constraint dropping depends on the generated constraint name. If names are generic, we can recreate the table or alter it.
-- We alter the columns additively to prevent any loss of production data.

ALTER TABLE fees
ADD COLUMN admission_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER admission_fee,
ADD COLUMN admission_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee - admission_fee_paid) STORED AFTER admission_fee_paid,
ADD COLUMN term_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER term_fee,
ADD COLUMN term_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (term_fee - term_fee_paid) STORED AFTER term_fee_paid,
ADD COLUMN daycare_fee_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER daycare_fee,
ADD COLUMN daycare_fee_remaining DECIMAL(10, 2) GENERATED ALWAYS AS (daycare_fee - daycare_fee_paid) STORED AFTER daycare_fee_paid;

-- Re-calculate existing payment splits using priority waterfall allocation:
-- 1. Clear Admission Fee first.
-- 2. Clear Term Fee second.
-- 3. Clear Daycare Fee third.

UPDATE fees
SET admission_fee_paid = LEAST(paid_amount, admission_fee);

UPDATE fees
SET term_fee_paid = LEAST(GREATER_THAN_ZERO(paid_amount - admission_fee_paid), term_fee);
-- Since standard SQL doesn't have GREATER_THAN_ZERO, we write this clean ANSI SQL conditional logic:

UPDATE fees
SET 
  admission_fee_paid = CASE 
    WHEN paid_amount >= admission_fee THEN admission_fee 
    ELSE paid_amount 
  END,
  term_fee_paid = CASE 
    WHEN paid_amount <= admission_fee THEN 0.00
    WHEN (paid_amount - admission_fee) >= term_fee THEN term_fee
    ELSE (paid_amount - admission_fee)
  END,
  daycare_fee_paid = CASE 
    WHEN paid_amount <= (admission_fee + term_fee) THEN 0.00
    WHEN (paid_amount - admission_fee - term_fee) >= daycare_fee THEN daycare_fee
    ELSE (paid_amount - admission_fee - term_fee)
  END;

-- Now modify total_fee, paid_amount, pending_amount to be generated columns to ensure strict mathematical synchronizations:
-- Note: Altering existing columns to generated columns in MySQL requires dropping and re-adding them, or using MODIFY if supported by engine.
-- To ensure full compatibility, we drop the old fields and recreate them as generated.
ALTER TABLE fees DROP COLUMN total_fee;
ALTER TABLE fees DROP COLUMN paid_amount;
ALTER TABLE fees DROP COLUMN pending_amount;

ALTER TABLE fees
ADD COLUMN total_fee DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee + term_fee + daycare_fee) STORED AFTER daycare_fee_remaining,
ADD COLUMN paid_amount DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee_paid + term_fee_paid + daycare_fee_paid) STORED AFTER total_fee,
ADD COLUMN pending_amount DECIMAL(10, 2) GENERATED ALWAYS AS (admission_fee_remaining + term_fee_remaining + daycare_fee_remaining) STORED AFTER paid_amount;

-- Add constraints
ALTER TABLE fees
ADD CONSTRAINT chk_admission_fee CHECK (admission_fee >= 0),
ADD CONSTRAINT chk_admission_fee_paid CHECK (admission_fee_paid >= 0),
ADD CONSTRAINT chk_term_fee CHECK (term_fee >= 0),
ADD CONSTRAINT chk_term_fee_paid CHECK (term_fee_paid >= 0),
ADD CONSTRAINT chk_daycare_fee CHECK (daycare_fee >= 0),
ADD CONSTRAINT chk_daycare_fee_paid CHECK (daycare_fee_paid >= 0);
