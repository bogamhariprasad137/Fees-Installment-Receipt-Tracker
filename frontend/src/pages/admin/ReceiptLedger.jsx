import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Search, Printer, FileSpreadsheet, FileText, CheckCircle } from "lucide-react";

export default function ReceiptLedger() {
  const [receipts, setReceipts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const loadReceipts = async () => {
    try {
      const data = await api.receipts.getAll();
      setReceipts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleMethodChange = (e) => setMethodFilter(e.target.value);

  // Filter receipt logs
  const filteredReceipts = receipts.filter(rec => {
    const matchesSearch =
      rec.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.receipt_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "" || rec.payment_method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const handleReceiptDownload = (rec) => {
    api.receipts.download(rec);
  };

  return (
    <div className="content-pane">
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Receipt Ledger</h1>
          <p style={{ color: "var(--warm-muted)", fontSize: "14px" }}>
            Audit registry for all student transaction payments and printable invoices.
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        <div className="search-action-grid">
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              color="var(--warm-muted)"
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by student name or receipt number..."
              style={{ paddingLeft: "38px" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <select className="form-control" value={methodFilter} onChange={handleMethodChange}>
              <option value="">All Methods</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash Settlement</option>
              <option value="cheque">Cheque Draft</option>
              <option value="card">Card Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Ledger */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student</th>
                <th>Date Paid</th>
                <th>Method</th>
                <th>Amount Paid</th>
                <th style={{ textAlign: "right" }}>Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map(rec => (
                  <tr key={rec.receipt_id}>
                    <td className="mono-data" style={{ fontWeight: "700" }}>{rec.receipt_number}</td>
                    <td style={{ fontWeight: "600" }}>{rec.student_name}</td>
                    <td className="mono-data">{rec.payment_date}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {rec.payment_method.replace("_", " ")}
                    </td>
                    <td className="mono-data" style={{ fontWeight: "600", color: "var(--status-paid-text)" }}>
                      ₹{rec.amount_paid.toLocaleString("en-IN")}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: "0.25rem 0.5rem", fontSize: "12px", height: "auto" }}
                        onClick={() => handleReceiptDownload(rec)}
                        title="Download Invoice"
                      >
                        <Printer size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", color: "var(--warm-muted)", padding: "2.5rem" }}>
                    No receipt entries found matching the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
