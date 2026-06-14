import { useState } from "react";
import { Save, ShieldCheck, CheckCircle } from "lucide-react";

export default function Settings() {
  const [success, setSuccess] = useState(false);
  const [terms, setTerms] = useState("3");

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="content-pane">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>System Settings</h1>
        <p style={{ color: "var(--warm-muted)", fontSize: "14px" }}>
          Configure payment terms parameters and academic fee defaults.
        </p>
      </div>

      {success && (
        <div
          className="badge badge-paid"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1.5rem",
            textTransform: "none",
            fontSize: "13px"
          }}
        >
          <CheckCircle size={16} />
          <div>System parameters saved successfully.</div>
        </div>
      )}

      <div className="card" style={{ maxWidth: "600px" }}>
        <div className="card-title">
          <span>Billing Rules Configuration</span>
        </div>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label" htmlFor="settings-terms">Default Installments Count</label>
            <select
              id="settings-terms"
              className="form-control"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            >
              <option value="2">2 Splits (Semester-wise)</option>
              <option value="3">3 Splits (Term-wise)</option>
              <option value="4">4 Splits (Quarterly)</option>
              <option value="10">10 Splits (Monthly)</option>
            </select>
          </div>


          <div
            style={{
              padding: "1rem",
              backgroundColor: "#FFFDF7",
              border: "1px dashed var(--structure-border)",
              borderRadius: "6px",
              fontSize: "13px",
              color: "var(--warm-muted)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <ShieldCheck size={18} color="var(--status-paid-text)" />
            <span>Changes will apply automatically to all newly registered students.</span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Save size={16} />
              <span>Save System Variables</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
