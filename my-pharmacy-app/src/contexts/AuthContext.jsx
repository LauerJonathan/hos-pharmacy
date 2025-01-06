// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Vérifier l'état d'authentification au chargement
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");
    setLoading(false);
  }, []);

  // Simulation d'un délai d'API
  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await simulateApiCall();

      if (email === "pharmacien@test.fr" && password === "123456") {
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);
        // Ajout d'un petit délai pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
        return true;
      } else {
        setError("Identifiants incorrects");
        return false;
      }
    } catch (error) {
      setError("Une erreur est survenue");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await simulateApiCall();
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      setError("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    // Pour la démo, on peut ajouter des informations utilisateur statiques
    user: isAuthenticated
      ? {
          name: "Dr. Smith",
          role: "pharmacien",
          email: "pharmacien@test.fr",
        }
      : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
