import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardList, Package } from "lucide-react";
import RestockButton from "./RestockButton";
import { Link } from "react-router-dom";

const MedicationCard = ({ medication, onRestock, onViewHistory, onEdit }) => {
  // Calculer le stock total uniquement à partir des lots non expirés
  const currentValidStock = medication.lots
    .filter((lot) => !lot.isExpired)
    .reduce((total, lot) => total + lot.quantity, 0);

  const isLowStock = currentValidStock <= medication.minQuantity;

  const expiredLot = medication.lots
    .filter((lot) => lot.isExpired)
    .sort((a, b) => new Date(b.expirationDate) - new Date(a.expirationDate))[0];

  const nextExpirationDate =
    expiredLot?.expirationDate ||
    medication.lots
      .filter((lot) => !lot.isExpired)
      .sort(
        (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)
      )[0]?.expirationDate;

  const stockRatio = Math.min(
    (currentValidStock /
      Math.max(medication.minQuantity * 2, currentValidStock)) *
      100,
    100
  );

  return (
    <Card className="w-full p-6 space-y-4 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        {expiredLot && (
          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-orange-500 text-white">
            Périmé
          </div>
        )}
        {isLowStock && (
          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white">
            Stock bas
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          {medication.name}
        </h3>
        <p className="text-gray-500">
          {medication.form} - {medication.dose}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Stock valide</span>
          <span
            className={`font-semibold ${
              isLowStock ? "text-red-600" : "text-gray-900"
            }`}>
            {currentValidStock} unités
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Quantité minimum</span>
          <span className="font-semibold text-gray-900">
            {medication.minQuantity} unités
          </span>
        </div>

        {nextExpirationDate && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Date d'expiration</span>
            <span
              className={`font-semibold ${
                expiredLot ? "text-orange-600" : "text-gray-900"
              }`}>
              {new Date(nextExpirationDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isLowStock ? "bg-red-500" : "bg-green-500"
            }`}
            style={{ width: `${stockRatio}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 relative">
        <RestockButton medication={medication} isLowStock={isLowStock} />

        <Button
          onClick={() => onViewHistory(medication.id)}
          variant="outline"
          size="icon"
          className="w-10 h-10 hover:bg-gray-100"
          title="Voir l'historique">
          <ClipboardList className="w-5 h-5" />
        </Button>

        <Link
          to={medication.cip13}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 transition-colors duration-200 ${
            expiredLot
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "border border-input bg-background hover:bg-gray-100"
          }`}
          title="Gérer le stock">
          <Package className="w-5 h-5" />
        </Link>
      </div>
    </Card>
  );
};

export default MedicationCard;
