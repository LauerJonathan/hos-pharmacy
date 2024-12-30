// src/components/medications/MedicationStats.jsx
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
    lowStock: medications.filter((med) => med.currentStock <= med.minQuantity)
      .length,
    expired: medications.filter(
      (med) => new Date(med.expirationDate) < new Date()
    ).length,
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

      <Card className={stats.expired > 0 ? "bg-yellow-50" : ""}>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.expired}
          </div>
          <p className="text-sm text-yellow-600">Médicaments Expirés</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationStats;
