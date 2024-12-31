import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ClipboardList, Settings2 } from "lucide-react";
import RestockButton from "./RestockButton";

const MedicationCard = ({ medication, onRestock, onViewHistory, onEdit }) => {
  const isLowStock = medication.currentStock <= medication.minQuantity;
  const isExpired = new Date(medication.expirationDate) < new Date();
  const stockRatio = Math.min(
    (medication.currentStock /
      Math.max(medication.minQuantity * 2, medication.currentStock)) *
      100,
    100
  );

  return (
    <Card className="w-full p-6 space-y-4">
      {/* En-tête avec le nom et la forme */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          {medication.name}
        </h3>
        <p className="text-gray-500">
          {medication.form} - {medication.dose}
        </p>
      </div>

      {/* Informations sur le stock */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Stock actuel</span>
          <span
            className={`font-semibold ${
              isLowStock ? "text-red-600" : "text-gray-900"
            }`}>
            {medication.currentStock} unités
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Quantité minimum</span>
          <span className="font-semibold text-gray-900">
            {medication.minQuantity} unités
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Date d'expiration</span>
          <span
            className={`font-semibold ${
              isExpired ? "text-orange-600" : "text-gray-900"
            }`}>
            {new Date(medication.expirationDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Barre de progression du stock */}
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

      {/* Boutons d'action */}
      <div className="flex justify-center gap-4 relative">
        <RestockButton
          medication={medication}
          onRestock={onRestock}
          isLowStock={isLowStock}
        />

        <Button
          onClick={() => onViewHistory(medication.id)}
          variant="outline"
          size="icon"
          className="w-10 h-10 hover:bg-gray-100"
          title="Voir l'historique">
          <ClipboardList className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => onEdit(medication.id)}
          variant={isExpired ? "default" : "outline"}
          size="icon"
          className={`w-10 h-10 transition-colors duration-200 ${
            isExpired
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "hover:bg-gray-100"
          }`}
          title="Modifier">
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default MedicationCard;
