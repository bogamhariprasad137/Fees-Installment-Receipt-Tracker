// Mock Database Store for Fees Installment & Receipt Tracker
// Matches schema.sql DDL definitions

export let mockUsers = [
  {
    user_id: 1,
    firebase_uid: "uid-admin-1",
    email: "admin@school.com",
    role: "admin",
    created_at: "2025-01-15T08:30:00Z"
  },
  {
    user_id: 2,
    firebase_uid: "uid-parent-2",
    email: "parent@family.com",
    role: "parent",
    created_at: "2025-01-20T10:15:00Z"
  }
];

export let mockStudents = [
  {
    student_id: 1,
    student_name: "Alice Smith",
    parent_name: "John Smith",
    parent_email: "parent@family.com",
    parent_phone: "+1 (555) 019-2834",
    class: "Grade 5-A",
    admission_number: "ADM-2025-001",
    admission_date: "2025-02-01",
    status: "active",
    user_id: 2,
    created_at: "2025-02-01T09:00:00Z"
  },
  {
    student_id: 2,
    student_name: "Bob Smith",
    parent_name: "John Smith",
    parent_email: "parent@family.com",
    parent_phone: "+1 (555) 019-2834",
    class: "Grade 3-C",
    admission_number: "ADM-2025-002",
    admission_date: "2025-02-01",
    status: "active",
    user_id: 2,
    created_at: "2025-02-01T09:05:00Z"
  },
  {
    student_id: 3,
    student_name: "Charlie Brown",
    parent_name: "Lucy Brown",
    parent_email: "charlie.parent@charity.org",
    parent_phone: "+1 (555) 043-9821",
    class: "Grade 6-B",
    admission_number: "ADM-2025-003",
    admission_date: "2025-02-05",
    status: "inactive",
    user_id: null,
    created_at: "2025-02-05T11:20:00Z"
  }
];



export let mockFees = [
  {
    fee_id: 1,
    student_id: 1,
    admission_fee: 1000.00,
    admission_fee_paid: 1000.00,
    admission_fee_remaining: 0.00,
    term_fee: 2500.00,
    term_fee_paid: 1000.00,
    term_fee_remaining: 1500.00,
    daycare_fee: 1500.00,
    daycare_fee_paid: 0.00,
    daycare_fee_remaining: 1500.00,
    total_fee: 5000.00,
    paid_amount: 2000.00,
    pending_amount: 3000.00,
    due_date: "2026-09-01",
    status: "Pending"
  },
  {
    fee_id: 2,
    student_id: 2,
    admission_fee: 1500.00,
    admission_fee_paid: 0.00,
    admission_fee_remaining: 1500.00,
    term_fee: 2000.00,
    term_fee_paid: 0.00,
    term_fee_remaining: 2000.00,
    daycare_fee: 1000.00,
    daycare_fee_paid: 0.00,
    daycare_fee_remaining: 1000.00,
    total_fee: 4500.00,
    paid_amount: 0.00,
    pending_amount: 4500.00,
    due_date: "2026-10-01",
    status: "Pending"
  },
  {
    fee_id: 3,
    student_id: 3,
    admission_fee: 2000.00,
    admission_fee_paid: 0.00,
    admission_fee_remaining: 2000.00,
    term_fee: 3000.00,
    term_fee_paid: 0.00,
    term_fee_remaining: 3000.00,
    daycare_fee: 1000.00,
    daycare_fee_paid: 0.00,
    daycare_fee_remaining: 1000.00,
    total_fee: 6000.00,
    paid_amount: 0.00,
    pending_amount: 6000.00,
    due_date: "2026-05-01",
    status: "Overdue"
  }
];

export let mockInstallments = [
  // Alice Smith (student_id = 1, fee_id = 1)
  {
    installment_id: 1,
    fee_id: 1,
    installment_number: 1,
    amount: 2000.00,
    due_date: "2026-03-01",
    payment_date: "2026-03-01",
    status: "paid"
  },
  {
    installment_id: 2,
    fee_id: 1,
    installment_number: 2,
    amount: 1500.00,
    due_date: "2026-06-01",
    payment_date: null,
    status: "overdue"
  },
  {
    installment_id: 3,
    fee_id: 1,
    installment_number: 3,
    amount: 1500.00,
    due_date: "2026-09-01",
    payment_date: null,
    status: "unpaid"
  },

  // Bob Smith (student_id = 2, fee_id = 2)
  {
    installment_id: 4,
    fee_id: 2,
    installment_number: 1,
    amount: 1500.00,
    due_date: "2026-04-01",
    payment_date: null,
    status: "overdue"
  },
  {
    installment_id: 5,
    fee_id: 2,
    installment_number: 2,
    amount: 1500.00,
    due_date: "2026-07-01",
    payment_date: null,
    status: "unpaid"
  },
  {
    installment_id: 6,
    fee_id: 2,
    installment_number: 3,
    amount: 1500.00,
    due_date: "2026-10-01",
    payment_date: null,
    status: "unpaid"
  },

  // Charlie Brown (student_id = 3, fee_id = 3)
  {
    installment_id: 7,
    fee_id: 3,
    installment_number: 1,
    amount: 3000.00,
    due_date: "2026-01-01",
    payment_date: null,
    status: "overdue"
  },
  {
    installment_id: 8,
    fee_id: 3,
    installment_number: 2,
    amount: 3000.00,
    due_date: "2026-05-01",
    payment_date: null,
    status: "unpaid"
  }
];

export let mockReceipts = [
  {
    receipt_id: 1,
    receipt_number: "REC-2026-0001",
    installment_id: 1,
    installment_number: 1,
    student_id: 1,
    student_name: "Alice Smith",
    amount_paid: 2000.00,
    payment_date: "2026-03-01",
    payment_method: "bank_transfer",
    pdf_path: "/receipts/REC-2026-0001.pdf",
    fee_category: "Admission & Term Fee"
  }
];

// Utility functions to manipulate/query mock database state in-memory
export const getStudentByParentEmail = (email) => {
  return mockStudents.filter(s => s.parent_email.toLowerCase() === email.toLowerCase());
};

export const getStudentDetails = (studentId) => {
  const s = mockStudents.find(student => student.student_id === parseInt(studentId));
  if (!s) return null;
  const f = mockFees.find(fee => fee.student_id === s.student_id);
  const insts = f ? mockInstallments.filter(inst => inst.fee_id === f.fee_id) : [];
  const recs = mockReceipts.filter(rec => rec.student_id === s.student_id);
  return {
    ...s,
    admission_fee: f ? f.admission_fee : 0,
    admission_fee_paid: f ? f.admission_fee_paid : 0,
    admission_fee_remaining: f ? (f.admission_fee_remaining !== undefined ? f.admission_fee_remaining : (f.admission_fee - f.admission_fee_paid)) : 0,
    term_fee: f ? f.term_fee : 0,
    term_fee_paid: f ? f.term_fee_paid : 0,
    term_fee_remaining: f ? (f.term_fee_remaining !== undefined ? f.term_fee_remaining : (f.term_fee - f.term_fee_paid)) : 0,
    daycare_fee: f ? f.daycare_fee : 0,
    daycare_fee_paid: f ? f.daycare_fee_paid : 0,
    daycare_fee_remaining: f ? (f.daycare_fee_remaining !== undefined ? f.daycare_fee_remaining : (f.daycare_fee - f.daycare_fee_paid)) : 0,
    total_fee: f ? f.total_fee : 0,
    paid_amount: f ? f.paid_amount : 0,
    pending_amount: f ? f.pending_amount : 0,
    fee_status: f ? f.status : "Pending",
    feeDetails: f,
    installments: insts,
    receipts: recs
  };
};
