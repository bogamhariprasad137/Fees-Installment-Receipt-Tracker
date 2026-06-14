import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F2E6B3',
        color: '#4B2E21',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        fontFamily: "'Geist', sans-serif"
      }}>
        Loading Session Details...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect role violations back to login
    return <Navigate to="/login" replace />;
  }

  return children;
};
