import { useAuth } from "../context/AuthContext";
import { Menu, UserCheck } from "lucide-react";

export default function Header({ title, mobileOpen, setMobileOpen }) {
  const { currentUser, connectedStudents, activeStudent, selectActiveStudent } = useAuth();

  const handleBurgerClick = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <header className="top-header">
      <div className="header-title">
        <button className="burger-menu" onClick={handleBurgerClick} aria-label="Toggle Sidebar">
          <Menu size={24} color="#4B2E21" />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="header-right">
        {currentUser?.role === "parent" && connectedStudents.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label
              htmlFor="student-switcher"
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "var(--warm-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Viewing Child:
            </label>
            <select
              id="student-switcher"
              className="form-control"
              style={{
                padding: "0.25rem 2rem 0.25rem 0.75rem",
                width: "auto",
                height: "32px",
                borderColor: "var(--structure-border)",
                backgroundColor: "#FFFDF7",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer"
              }}
              value={activeStudent?.student_id || ""}
              onChange={(e) => selectActiveStudent(e.target.value)}
            >
              {connectedStudents.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.student_name} ({student.class})
                </option>
              ))}
            </select>
          </div>
        )}

        {currentUser?.role === "parent" && activeStudent && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              backgroundColor: "rgba(13, 148, 136, 0.1)",
              border: "1px solid rgba(13, 148, 136, 0.2)"
            }}
          >
            <UserCheck size={14} color="#0D9488" />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#0D9488"
              }}
            >
              {activeStudent.student_name}
            </span>
          </div>
        )}

        <div style={{ fontSize: "13px", color: "var(--warm-muted)", fontWeight: "500" }}>
          Term: <strong className="mono-data">2026 Academic Year</strong>
        </div>
      </div>
    </header>
  );
}
