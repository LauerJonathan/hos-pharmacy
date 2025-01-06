import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">Pharmacie Hospitalière</h1>
            <nav className="hidden md:flex gap-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              {user?.role === "admin" && (
                <Button variant="ghost" onClick={() => navigate("/register")}>
                  Créer un utilisateur
                </Button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default MainLayout;
