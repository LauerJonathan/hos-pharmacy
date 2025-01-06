// src/components/layout/Header.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ showBackButton = false }) => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

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
              <p className="font-medium">Dr. Smith</p>
              <p className="text-sm text-muted-foreground">pharmacien</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
