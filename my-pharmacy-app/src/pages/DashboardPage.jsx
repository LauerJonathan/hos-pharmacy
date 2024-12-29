import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
