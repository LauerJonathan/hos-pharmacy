import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Ajout de l'import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Ajout de l'initialisation

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord</h2>

      <Card>
        <CardHeader>
          <CardTitle>Bienvenue, {user.firstName} !</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vous êtes connecté en tant que {user?.role}.
          </p>
          {user.role === "pharmacien" && (
            <Button
              onClick={() => navigate("/add-medication")}
              className="mb-4"
            >
              Ajouter un médicament
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;