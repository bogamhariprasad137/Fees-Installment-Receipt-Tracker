// Production REST API Client for Fees Installment & Receipt Tracker
// Connects to Flask REST server on http://localhost:5000/api

const API_BASE = "http://localhost:5000/api";

const handleResponse = async (res) => {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `API Request failed with status ${res.status}`);
  }
  return res.json();
};

export const api = {
  // --- Auth Services ---
  auth: {
    login: async (email, password, expectedRole) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: expectedRole })
      });
      const data = await handleResponse(res);
      if (data.user) {
        localStorage.setItem("session_user", JSON.stringify(data.user));
        return data.user;
      }
      throw new Error("Invalid response format from login API.");
    },

    signup: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await handleResponse(res);
      if (data.user) {
        localStorage.setItem("session_user", JSON.stringify(data.user));
        return data.user;
      }
      throw new Error("Invalid response format from signup API.");
    },

    logout: async () => {
      localStorage.removeItem("session_user");
      return true;
    },

    getCurrentUser: () => {
      const stored = localStorage.getItem("session_user");
      return stored ? JSON.parse(stored) : null;
    },

    resetPassword: async (email) => {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      return handleResponse(res);
    }
  },

  // --- Students Services ---
  students: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/students`);
      return handleResponse(res);
    },

    getById: async (id) => {
      const res = await fetch(`${API_BASE}/students/${id}`);
      return handleResponse(res);
    },

    getByParentEmail: async (email) => {
      const res = await fetch(`${API_BASE}/students/parent/${encodeURIComponent(email)}`);
      return handleResponse(res);
    },

    create: async (studentData) => {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      const data = await handleResponse(res);
      return data.student;
    },

    update: async (id, studentData) => {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
      });
      return handleResponse(res);
    },

    delete: async (id) => {
      const res = await fetch(`${API_BASE}/students/${id}`, {
        method: "DELETE"
      });
      return handleResponse(res);
    }
  },

  // --- Installments Services ---
  installments: {
    getByFeeId: async (studentId) => {
      const res = await fetch(`${API_BASE}/installments/${studentId}`);
      return handleResponse(res);
    },

    save: async (feeId, installments) => {
      const res = await fetch(`${API_BASE}/installments/${feeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installments })
      });
      return handleResponse(res);
    }
  },

  // --- Payment & Receipts Services ---
  receipts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/receipts`);
      return handleResponse(res);
    },

    logPayment: async (paymentData) => {
      const res = await fetch(`${API_BASE}/receipts/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });
      const data = await handleResponse(res);
      return data.receipt;
    },

    download: async (receipt) => {
      const res = await fetch(`${API_BASE}/receipts/download/${receipt.receipt_id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch binary receipt PDF from backend.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Receipt_${receipt.receipt_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
};
