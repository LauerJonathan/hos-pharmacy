import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";
import MedicationStats from "../components/medications/MedicationStats";
import MedicationAlerts from "../components/medications/MedicationAlerts";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord</h2>

      {/* Carte de bienvenue et actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue, {user.firstName} !</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Vous êtes connecté en tant que {user?.role}.
          </p>
          {user.role === "pharmacien" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate("/add-medication")}
                >
                  Ajouter un médicament
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/stock")}
                >
                  Voir tous les médicaments
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user.role === "pharmacien" && (
        <>
          {/* Section Alertes */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Colonne de gauche : Aperçu des stocks */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Aperçu des stocks</h3>
              <MedicationStats />
            </div>

            {/* Colonne de droite : Alertes */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Alertes</h3>
              <MedicationAlerts />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;