import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  // Si le chargement est en cours, afficher le spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Pour la démo, on sait que l'utilisateur est toujours un pharmacien
  // mais on garde la vérification des rôles pour la structure
  if (roles && !roles.includes("pharmacien")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
