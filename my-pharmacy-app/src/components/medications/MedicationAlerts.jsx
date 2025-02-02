import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMedications } from "../../store/features/medications/medicationThunks";
import { selectAllMedications } from "../../store/features/medications/medicationSlice";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, PackageOpen, AlertTriangle, Calendar } from "lucide-react";

const MedicationAlerts = () => {
  const dispatch = useDispatch();
  const medications = useSelector(selectAllMedications);

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

  const alerts = {
    lowStock: medications.filter((med) => med.currentStock <= med.minQuantity),
    expiringSoon: medications.filter((med) => {
      return med.lots.some((lot) => {
        const expirationDate = new Date(lot.expirationDate);
        return (
          expirationDate <= threeMonthsFromNow && expirationDate > new Date()
        );
      });
    }),
    expired: medications.filter((med) =>
      med.lots.some((lot) => new Date(lot.expirationDate) < new Date())
    ),
  };

  if (
    !alerts.lowStock.length &&
    !alerts.expiringSoon.length &&
    !alerts.expired.length
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            État du stock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert
            variant="default"
            className="border-green-500 text-green-500 bg-green-50">
            <div className="flex gap-4">
              <div className="flex-grow">
                <AlertTitle>Tout va bien !</AlertTitle>
                <AlertDescription>
                  Aucune alerte aujourd'hui, bonne journée ! 🌟
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getExpiringLotsInfo = (med) => {
    const expiringLots = med.lots.filter((lot) => {
      const expirationDate = new Date(lot.expirationDate);
      return (
        expirationDate <= threeMonthsFromNow && expirationDate > new Date()
      );
    });
    const totalUnits = expiringLots.reduce((sum, lot) => sum + lot.quantity, 0);
    return { count: expiringLots.length, units: totalUnits };
  };

  const getExpiredLotsInfo = (med) => {
    const expiredLots = med.lots.filter(
      (lot) => new Date(lot.expirationDate) < new Date()
    );
    const totalUnits = expiredLots.reduce((sum, lot) => sum + lot.quantity, 0);
    return { count: expiredLots.length, units: totalUnits };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-500" />
          Alertes importantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.lowStock.length > 0 && (
          <Alert variant="destructive" className="flex gap-4">
            <PackageOpen className="h-5 w-5 shrink-0 mt-1" />
            <div className="flex-grow">
              <AlertTitle>Stock bas</AlertTitle>
              <AlertDescription>
                {alerts.lowStock.length} médicament
                {alerts.lowStock.length > 1 ? "s" : ""} en stock bas :
                <ul className="mt-2 ml-4 list-disc">
                  {alerts.lowStock.map((med) => (
                    <li key={med.id}>
                      {med.name} - Stock actuel: {med.currentStock}
                      &nbsp; (Min. requis: {med.minQuantity})
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </div>
          </Alert>
        )}

        {alerts.expiringSoon.length > 0 && (
          <Alert variant="warning" className="flex gap-4 border-yellow-500">
            <Calendar className="h-5 w-5 shrink-0 mt-1 text-yellow-500" />
            <div className="flex-grow">
              <AlertTitle className="text-yellow-500">
                Expiration proche
              </AlertTitle>
              <AlertDescription className="text-yellow-500">
                {alerts.expiringSoon.length} médicament
                {alerts.expiringSoon.length > 1 ? "s" : ""} à expiration dans
                les 3 mois :
                <ul className="mt-2 ml-4 list-disc">
                  {alerts.expiringSoon.map((med) => {
                    const { count, units } = getExpiringLotsInfo(med);
                    return (
                      <li key={med.id}>
                        {med.name} - {count} lot{count > 1 ? "s" : ""} ({units}{" "}
                        unité{units > 1 ? "s" : ""})
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </div>
          </Alert>
        )}

        {alerts.expired.length > 0 && (
          <Alert variant="destructive" className="flex gap-4">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-1" />
            <div className="flex-grow">
              <AlertTitle>Médicaments expirés</AlertTitle>
              <AlertDescription>
                {alerts.expired.length} médicament
                {alerts.expired.length > 1 ? "s" : ""} expiré
                {alerts.expired.length > 1 ? "s" : ""} :
                <ul className="mt-2 ml-4 list-disc">
                  {alerts.expired.map((med) => {
                    const { count, units } = getExpiredLotsInfo(med);
                    return (
                      <li key={med.id}>
                        {med.name} - {count} lot{count > 1 ? "s" : ""} ({units}{" "}
                        unité{units > 1 ? "s" : ""})
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationAlerts;
