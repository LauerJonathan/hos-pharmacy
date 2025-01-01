import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedications } from "../../store/features/medications/medicationThunks";
import { selectAllMedications } from "../../store/features/medications/medicationSlice";
import { Card, CardContent } from "../ui/card";

const MedicationStats = () => {
  const dispatch = useDispatch();
  const medications = useSelector(selectAllMedications);

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  const stats = {
    total: medications.length,
    lowStock: medications.filter((med) => med.stockStatus === "low").length,
    expiredLots: {
      count: medications.reduce(
        (acc, med) => acc + med.lots.filter((lot) => lot.isExpired).length,
        0
      ),
      units: medications.reduce(
        (acc, med) =>
          acc +
          med.lots
            .filter((lot) => lot.isExpired)
            .reduce((sum, lot) => sum + lot.quantity, 0),
        0
      ),
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-sm text-muted-foreground">Total Médicaments</p>
        </CardContent>
      </Card>

      <Card className={stats.lowStock > 0 ? "bg-red-50" : ""}>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-600">
            {stats.lowStock}
          </div>
          <p className="text-sm text-red-600">Stock Bas</p>
        </CardContent>
      </Card>

      <Card className={stats.expiredLots.count > 0 ? "bg-orange-50" : ""}>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-orange-600">
            {stats.expiredLots.count} lot(s)
          </div>
          <p className="text-sm text-orange-600">Expirés</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationStats;
