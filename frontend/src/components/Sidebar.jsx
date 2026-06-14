import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  User,
  History,
  Download,
  LogOut,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Settings,
  Plus
} from "lucide-react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMobileSidebar = () => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  };

  if (!currentUser) return null;

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      {/* Brand logo */}
      <div className="sidebar-brand">
        <GraduationCap size={28} color="#F2E6B3" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: "1.2" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#F2E6B3" }}>FirstCry Intellitots</span>
          <span style={{ fontSize: "12px", opacity: 0.8, color: "#FFFFFF" }}>Portal</span>
        </div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", justifyBetween: "space-between" }}>
        {currentUser.role === "admin" ? (
          <div>
            <div className="sidebar-section-title">Administration</div>
            <ul className="sidebar-menu">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/students"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <Users />
                  <span>Students</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/fee-management"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                  title="Manage Installment Plans"
                >
                  <CreditCard />
                  <span>Fee Management</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/receipts"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <FileText />
                  <span>Receipts</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/reports"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <TrendingUp />
                  <span>Reports</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <Settings />
                  <span>Settings</span>
                </NavLink>
              </li>
            </ul>

            <button
              onClick={() => {
                closeMobileSidebar();
                navigate("/admin/dashboard?logPayment=true");
              }}
              className="btn"
              style={{
                width: "100%",
                backgroundColor: "var(--pure-surface)",
                color: "var(--sidebar-brown)",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.625rem",
                borderRadius: "6px",
                marginTop: "1.5rem",
                border: "none",
                fontSize: "13px"
              }}
            >
              <Plus size={16} />
              <span>New Transaction</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="sidebar-section-title">Parent Portal</div>
            <ul className="sidebar-menu">
              <li>
                <NavLink
                  to="/parent/dashboard"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <LayoutDashboard />
                  <span>Overview</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/parent/profile"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <User />
                  <span>Child Profile</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/parent/history"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <History />
                  <span>Payment History</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/parent/receipts"
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={closeMobileSidebar}
                >
                  <Download />
                  <span>Receipt Downloads</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge" style={{ marginBottom: '1rem' }}>
          <div className="user-avatar">
            {currentUser.email.slice(0, 2).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-email">{currentUser.email}</div>
            <div className="user-role">{currentUser.role === 'admin' ? 'Administrator' : 'Parent Account'}</div>
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: "#FFFFFF",
            borderColor: "rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
