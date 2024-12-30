// src/components/layout/Header.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";

const Header = ({ showBackButton = false }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logique de déconnexion à implémenter
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Partie gauche avec titre et bouton retour */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-primary">
                Pharmacie Hospitalière
              </h1>
            </div>
          </div>

          {/* Partie droite avec infos utilisateur et déconnexion */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
