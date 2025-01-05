import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, X, PlusCircle } from "lucide-react";
import { useRestock } from "./RestockContext";
import { useMedication } from "../../contexts/MedicationContext";

const RestockButton = ({ medication, isLowStock }) => {
  const { openMedicationId, setOpenMedicationId } = useRestock();
  const { createMedication, loading } = useMedication();
  const [newLots, setNewLots] = useState([
    { lotNumber: "", quantity: "", expirationDate: "" },
  ]);

  const isExpanded = openMedicationId === medication.id;

  const handleLotChange = (index, field, value) => {
    const updatedLots = [...newLots];
    updatedLots[index][field] = value;
    setNewLots(updatedLots);
  };

  const addLot = () => {
    setNewLots((prev) => [
      ...prev,
      { lotNumber: "", quantity: "", expirationDate: "" },
    ]);
  };

  const removeLot = (index) => {
    if (newLots.length > 1) {
      setNewLots((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const medicationUpdate = {
        id: medication.id,
        cip13: medication.cip13,
        lots: newLots.map((lot) => ({
          lotNumber: lot.lotNumber,
          quantity: parseInt(lot.quantity),
          expirationDate: lot.expirationDate,
        })),
      };
      await createMedication(medicationUpdate);
      setOpenMedicationId(null);
      // Réinitialiser le formulaire
      setNewLots([{ lotNumber: "", quantity: "", expirationDate: "" }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout des lots:", error);
    }
  };

  const handleCancel = () => {
    setNewLots([{ lotNumber: "", quantity: "", expirationDate: "" }]);
    setOpenMedicationId(null);
  };

  return (
    <>
      <Button
        onClick={() => !isExpanded && setOpenMedicationId(medication.id)}
        variant={isLowStock ? "default" : "outline"}
        size="icon"
        className={`w-10 h-10 transition-colors duration-200 ${
          isLowStock
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "hover:bg-gray-100"
        }`}
        title="Réapprovisionner">
        <PlusCircle className="w-5 h-5" />
      </Button>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 p-6 bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {medication.name}
                </h3>
                <p className="text-gray-500">
                  {medication.form} - {medication.dose}
                </p>
              </div>
              <button
                className="inline-flex w-8 h-8 hover:bg-gray-100 items-center justify-center"
                onClick={handleCancel}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Ajouter des lots</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLot}>
                    <Package className="h-4 w-4 mr-2" /> Ajouter un lot
                  </Button>
                </div>

                {newLots.map((lot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 items-center">
                    <Input
                      placeholder="Numéro de lot"
                      value={lot.lotNumber}
                      onChange={(e) =>
                        handleLotChange(index, "lotNumber", e.target.value)
                      }
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Quantité"
                      value={lot.quantity}
                      onChange={(e) =>
                        handleLotChange(index, "quantity", e.target.value)
                      }
                      required
                      min="0"
                    />
                    <div className="flex items-center space-x-2">
                      <Input
                        type="date"
                        value={lot.expirationDate}
                        onChange={(e) =>
                          handleLotChange(
                            index,
                            "expirationDate",
                            e.target.value
                          )
                        }
                        required
                      />
                      {newLots.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeLot(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Ajout en cours..." : "Valider"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={loading}>
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default RestockButton;
