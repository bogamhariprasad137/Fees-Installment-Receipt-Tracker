import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to load parent's children
  const loadParentData = async (email) => {
    try {
      const students = await api.students.getByParentEmail(email);
      setConnectedStudents(students);
      if (students.length > 0) {
        // Set first student as active by default
        setActiveStudent(students[0]);
      } else {
        setActiveStudent(null);
      }
    } catch (err) {
      console.error("Failed to load connected students:", err);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const user = api.auth.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.role === "parent") {
          await loadParentData(user.email);
        }
      }
      setLoading(false);
    };
    initSession();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.auth.login(email, password, role);
      setCurrentUser(user);
      if (user.role === "parent") {
        await loadParentData(user.email);
      } else {
        setConnectedStudents([]);
        setActiveStudent(null);
      }
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.auth.signup(email, password);
      setCurrentUser(user);
      if (user.role === "parent") {
        await loadParentData(user.email);
      }
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.auth.logout();
      setCurrentUser(null);
      setConnectedStudents([]);
      setActiveStudent(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectActiveStudent = (studentId) => {
    const student = connectedStudents.find(s => s.student_id === parseInt(studentId));
    if (student) {
      setActiveStudent(student);
    }
  };

  const refreshActiveStudent = async () => {
    if (activeStudent && currentUser && currentUser.role === "parent") {
      const students = await api.students.getByParentEmail(currentUser.email);
      setConnectedStudents(students);
      const updated = students.find(s => s.student_id === activeStudent.student_id);
      if (updated) {
        setActiveStudent(updated);
      }
    }
  };

  const resetPassword = async (email) => {
    setError(null);
    try {
      return await api.auth.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    connectedStudents,
    activeStudent,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    selectActiveStudent,
    refreshActiveStudent
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
