import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Download, FileText, Calendar, Wallet } from "lucide-react";

export default function ParentReceipts() {
  const { activeStudent } = useAuth();

  if (!activeStudent) return null;

  const handleReceiptDownload = (rec) => {
    api.receipts.download(rec);
  };

  const receipts = activeStudent.receipts || [];

  return (
    <div className="content-pane">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Receipt Downloads</h1>
        <p style={{ color: "var(--warm-muted)", fontSize: "14px" }}>
          Download printable transaction receipt vouchers.
        </p>
      </div>

      {receipts.length > 0 ? (
        <div className="grid-3">
          {receipts.map(rec => (
            <div className="card" key={rec.receipt_id} style={{ display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "6px",
                      backgroundColor: "rgba(75, 46, 33, 0.05)",
                      border: "1px solid var(--structure-border)"
                    }}
                  >
                    <FileText size={20} color="var(--sidebar-brown)" />
                  </div>
                  <span className="badge badge-paid" style={{ fontSize: "10px" }}>
                    Verified Paid
                  </span>
                </div>

                <h4 style={{ fontSize: "15px", marginBottom: "0.25rem" }}>
                  Receipt No: <span className="mono-data">{rec.receipt_number}</span>
                </h4>
                
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--sidebar-brown)", marginBottom: "0.75rem" }}>
                  Student: {activeStudent.student_name}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "13px", color: "var(--warm-muted)", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={14} />
                    <span>Paid Date: <strong className="mono-data">{rec.payment_date}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Wallet size={14} />
                    <span>Amount: <strong className="mono-data" style={{ color: "var(--academic-charcoal)" }}>₹{rec.amount_paid.toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: "100%", fontSize: "13px", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}
                onClick={() => handleReceiptDownload(rec)}
              >
                <Download size={14} />
                <span>Download Invoice File</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <FileText size={40} color="var(--warm-muted)" style={{ marginBottom: "1rem" }} />
          <h3>No downloadable receipts</h3>
          <p style={{ color: "var(--warm-muted)", marginTop: "0.25rem" }}>
            Payment receipt records will appear here once installments are settled and verified by administrators.
          </p>
        </div>
      )}
    </div>
  );
}
