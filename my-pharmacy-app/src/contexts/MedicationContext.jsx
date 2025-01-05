import { createContext, useContext, useState } from "react";
import { medications } from "../MOCKED/medications";
import { lots } from "../MOCKED/lots";

const MedicationContext = createContext(null);

export const MedicationProvider = ({ children }) => {
  const [medicationsList, setMedicationsList] = useState(medications);
  const [lotsList, setLotsList] = useState(lots);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fonction utilitaire pour simuler un délai d'API
  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const createMedication = async (medicationData) => {
    setLoading(true);
    try {
      await simulateApiCall();

      // Création du nouveau médicament
      const newMedication = {
        ...medicationData,
        id: String(medicationsList.length + 1),
      };

      // Ajout des nouveaux lots
      const newLots = medicationData.lots.map((lot, index) => ({
        id: String(lotsList.length + index + 1),
        lotNumber: lot.lotNumber,
        medicationId: newMedication.id,
        quantity: lot.quantity,
        expirationDate: lot.expirationDate,
        receptionDate: new Date().toISOString().split("T")[0],
      }));

      setMedicationsList([...medicationsList, newMedication]);
      setLotsList([...lotsList, ...newLots]);
      setSuccess("Médicament créé avec succès");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    setLoading(true);
    try {
      await simulateApiCall();

      // Enrichir les médicaments avec leurs lots
      const medicationsWithLots = medicationsList.map((med) => {
        const medLots = lotsList.filter((lot) => lot.medicationId === med.id);
        return {
          ...med,
          lots: medLots,
        };
      });

      return medicationsWithLots;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchMedicationByCIP13 = async (cip13) => {
    setLoading(true);
    try {
      await simulateApiCall();

      const medication = medicationsList.find((med) => med.cip13 === cip13);
      if (!medication) {
        setError("Médicament non trouvé");
        return null;
      }

      const medicationLots = lotsList.filter(
        (lot) => lot.medicationId === medication.id
      );
      return {
        ...medication,
        lots: medicationLots,
      };
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLotQuantity = async (cip13, lotNumber, increment) => {
    setLoading(true);
    try {
      await simulateApiCall();

      const medication = medicationsList.find((med) => med.cip13 === cip13);
      if (!medication) {
        throw new Error("Médicament non trouvé");
      }

      const newLotsList = lotsList.map((lot) => {
        if (lot.lotNumber === lotNumber && lot.medicationId === medication.id) {
          return {
            ...lot,
            quantity: lot.quantity + (increment ? 1 : -1),
          };
        }
        return lot;
      });

      setLotsList(newLotsList);
      setSuccess("Quantité mise à jour avec succès");

      // Retourner le médicament mis à jour avec ses lots
      return {
        ...medication,
        lots: newLotsList.filter((lot) => lot.medicationId === medication.id),
      };
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLot = async (cip13, lotNumber) => {
    setLoading(true);
    try {
      await simulateApiCall();

      const medication = medicationsList.find((med) => med.cip13 === cip13);
      if (!medication) {
        throw new Error("Médicament non trouvé");
      }

      const newLotsList = lotsList.filter(
        (lot) =>
          !(lot.lotNumber === lotNumber && lot.medicationId === medication.id)
      );

      setLotsList(newLotsList);
      setSuccess("Lot supprimé avec succès");

      // Retourner le médicament mis à jour avec ses lots restants
      return {
        ...medication,
        lots: newLotsList.filter((lot) => lot.medicationId === medication.id),
      };
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sélecteurs
  const getMedicationByCIP13 = (cip13) => {
    const medication = medicationsList.find((med) => med.cip13 === cip13);
    if (!medication) return null;

    const medicationLots = lotsList.filter(
      (lot) => lot.medicationId === medication.id
    );
    return {
      ...medication,
      lots: medicationLots,
    };
  };

  const getStockStatus = (cip13) => {
    const medication = getMedicationByCIP13(cip13);
    if (!medication) return null;

    const currentStock = medication.lots.reduce(
      (sum, lot) =>
        new Date(lot.expirationDate) > new Date() ? sum + lot.quantity : sum,
      0
    );

    return {
      currentStock,
      minQuantity: medication.minQuantity,
      isLow: currentStock <= medication.minQuantity,
      status: currentStock <= medication.minQuantity ? "low" : "normal",
    };
  };

  const value = {
    medications: medicationsList,
    lots: lotsList,
    loading,
    error,
    success,
    createMedication,
    fetchMedications,
    searchMedicationByCIP13,
    updateLotQuantity,
    deleteLot,
    getMedicationByCIP13,
    getStockStatus,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error(
      "useMedication doit être utilisé dans un MedicationProvider"
    );
  }
  return context;
};
