import { useAuth } from "../../context/AuthContext";
import { User, ShieldAlert, Award, Calendar, Contact, Phone, Mail } from "lucide-react";

export default function ParentProfile() {
  const { activeStudent } = useAuth();

  if (!activeStudent) return null;

  return (
    <div className="content-pane">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Child Profile Sheet</h1>
        <p style={{ color: "var(--warm-muted)", fontSize: "14px" }}>
          Registered profile and emergency contacts details.
        </p>
      </div>

      <div className="grid-2">
        {/* Student Data */}
        <div className="card">
          <div className="card-title">
            <span>Student Registration Info</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #FFF8DC", paddingBottom: "0.75rem" }}>
              <User size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Student Full Name</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{activeStudent.student_name}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #FFF8DC", paddingBottom: "0.75rem" }}>
              <Award size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Admission Number</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }} className="mono-data">{activeStudent.admission_number}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #FFF8DC", paddingBottom: "0.75rem" }}>
              <Calendar size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Admission Date</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }} className="mono-data">{activeStudent.admission_date}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Contact size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Registered Class</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{activeStudent.class}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Data */}
        <div className="card">
          <div className="card-title">
            <span>Primary Guardian Contact</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #FFF8DC", paddingBottom: "0.75rem" }}>
              <User size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Guardian Full Name</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{activeStudent.parent_name}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #FFF8DC", paddingBottom: "0.75rem" }}>
              <Mail size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Registered Email Address</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{activeStudent.parent_email}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Phone size={18} color="var(--warm-muted)" />
              <div>
                <div style={{ fontSize: "11px", color: "var(--warm-muted)", textTransform: "uppercase", fontWeight: "700" }}>Guardian Contact Phone</div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>{activeStudent.parent_phone || "No phone registered"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown Splits */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-title">
          <span>Fee Account Breakdown (Splits)</span>
        </div>
        <div className="table-responsive">
          <table className="table" style={{ fontSize: "14px", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: "transparent", color: "var(--warm-muted)", borderBottom: "1px solid var(--structure-border)" }}>Fee Category</th>
                <th style={{ backgroundColor: "transparent", color: "var(--warm-muted)", borderBottom: "1px solid var(--structure-border)", textAlign: "right" }}>Allocated</th>
                <th style={{ backgroundColor: "transparent", color: "var(--warm-muted)", borderBottom: "1px solid var(--structure-border)", textAlign: "right" }}>Paid</th>
                <th style={{ backgroundColor: "transparent", color: "var(--warm-muted)", borderBottom: "1px solid var(--structure-border)", textAlign: "right" }}>Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: "600", borderBottom: "1px solid var(--structure-border)" }}>Admission Fee</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right" }}>₹{(activeStudent.admission_fee || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right", color: "var(--status-paid-text)", fontWeight: "600" }}>₹{(activeStudent.admission_fee_paid || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right", color: (activeStudent.admission_fee_remaining || 0) > 0 ? "var(--status-pending-text)" : "inherit", fontWeight: "600" }}>₹{(activeStudent.admission_fee_remaining || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "600", borderBottom: "1px solid var(--structure-border)" }}>Term Fee</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right" }}>₹{(activeStudent.term_fee || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right", color: "var(--status-paid-text)", fontWeight: "600" }}>₹{(activeStudent.term_fee_paid || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderBottom: "1px solid var(--structure-border)", textAlign: "right", color: (activeStudent.term_fee_remaining || 0) > 0 ? "var(--status-pending-text)" : "inherit", fontWeight: "600" }}>₹{(activeStudent.term_fee_remaining || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "600" }}>Daycare Fee</td>
                <td className="mono-data" style={{ textAlign: "right" }}>₹{(activeStudent.daycare_fee || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ textAlign: "right", color: "var(--status-paid-text)", fontWeight: "600" }}>₹{(activeStudent.daycare_fee_paid || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ textAlign: "right", color: (activeStudent.daycare_fee_remaining || 0) > 0 ? "var(--status-pending-text)" : "inherit", fontWeight: "600" }}>₹{(activeStudent.daycare_fee_remaining || 0).toLocaleString("en-IN")}</td>
              </tr>
              <tr style={{ backgroundColor: "#FFFDF7", fontWeight: "700" }}>
                <td style={{ borderTop: "2px solid var(--structure-border)" }}>Total Billing</td>
                <td className="mono-data" style={{ borderTop: "2px solid var(--structure-border)", textAlign: "right" }}>₹{(activeStudent.total_fee || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderTop: "2px solid var(--structure-border)", textAlign: "right", color: "var(--status-paid-text)" }}>₹{(activeStudent.paid_amount || 0).toLocaleString("en-IN")}</td>
                <td className="mono-data" style={{ borderTop: "2px solid var(--structure-border)", textAlign: "right", color: (activeStudent.pending_amount || 0) > 0 ? "var(--status-pending-text)" : "inherit" }}>₹{(activeStudent.pending_amount || 0).toLocaleString("en-IN")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
