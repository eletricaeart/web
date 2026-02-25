// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { signed, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!signed) return <Navigate to="/login" />;

  return children;
};
