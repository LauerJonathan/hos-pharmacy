// src/contexts/MedicationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { medications } from "../MOCKED/medications";
import { lots } from "../MOCKED/lots";

const MedicationContext = createContext(null);

export const MedicationProvider = ({ children }) => {
  const [medicationsList, setMedicationsList] = useState([]);
  const [lotsList, setLotsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialisation au montage
  useEffect(() => {
    const initializeMedications = async () => {
      try {
        const enrichedMedications = medications.map((med) => ({
          ...med,
          currentStock: lots
            .filter(
              (lot) =>
                lot.medicationId === med.id &&
                new Date(lot.expirationDate) > new Date()
            )
            .reduce((sum, lot) => sum + lot.quantity, 0),
          stockStatus:
            lots
              .filter(
                (lot) =>
                  lot.medicationId === med.id &&
                  new Date(lot.expirationDate) > new Date()
              )
              .reduce((sum, lot) => sum + lot.quantity, 0) <= med.minQuantity
              ? "low"
              : "normal",
          lots: lots
            .filter((lot) => lot.medicationId === med.id)
            .map((lot) => ({
              ...lot,
              isExpired: new Date(lot.expirationDate) < new Date(),
            })),
        }));

        setMedicationsList(enrichedMedications);
        setLotsList(lots);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de l'initialisation des données");
        setLoading(false);
      }
    };

    initializeMedications();
  }, []);

  // Fonction utilitaire pour simuler un délai d'API
  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const fetchMedications = async () => {
    setLoading(true);
    try {
      await simulateApiCall();
      const enrichedMedications = medicationsList.map((med) => ({
        ...med,
        lots: lotsList.filter((lot) => lot.medicationId === med.id),
      }));
      setLoading(false);
      return enrichedMedications;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return [];
    }
  };

  const createMedication = async (medicationData) => {
    setLoading(true);
    try {
      await simulateApiCall();

      // Si le médicament existe déjà (cas de RestockButton)
      if (medicationData.id) {
        // On ajoute seulement les nouveaux lots
        const newLots = medicationData.lots.map((lot, index) => ({
          id: String(lotsList.length + index + 1),
          lotNumber: lot.lotNumber,
          medicationId: medicationData.id,
          quantity: lot.quantity,
          expirationDate: lot.expirationDate,
          receptionDate: new Date().toISOString().split("T")[0],
        }));

        setLotsList([...lotsList, ...newLots]);
        setSuccess("Lots ajoutés avec succès");

        return getMedicationByCIP13(medicationData.cip13); // Retourne le médicament mis à jour
      } else {
        // Logique existante pour un nouveau médicament
        const newMedication = {
          ...medicationData,
          id: String(medicationsList.length + 1),
        };

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
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMedicationByCIP13 = (cip13) => {
    const medication = medicationsList.find((med) => med.cip13 === cip13);
    if (!medication) return null;
    return {
      ...medication,
      lots: lotsList.filter((lot) => lot.medicationId === medication.id),
    };
  };

  const updateLotQuantity = async (cip13, lotNumber, increment) => {
    setLoading(true);
    try {
      await simulateApiCall();

      setLotsList((prevLots) =>
        prevLots.map((lot) => {
          if (lot.lotNumber === lotNumber) {
            return { ...lot, quantity: lot.quantity + (increment ? 1 : -1) };
          }
          return lot;
        })
      );

      const updatedMedication = getMedicationByCIP13(cip13);
      setSuccess("Quantité mise à jour avec succès");
      setLoading(false);
      return updatedMedication;
    } catch (error) {
      setError("Erreur lors de la mise à jour de la quantité");
      setLoading(false);
      return null;
    }
  };

  const deleteLot = async (cip13, lotNumber) => {
    setLoading(true);
    try {
      await simulateApiCall();

      setLotsList((prevLots) =>
        prevLots.filter((lot) => lot.lotNumber !== lotNumber)
      );

      const updatedMedication = getMedicationByCIP13(cip13);
      setSuccess("Lot supprimé avec succès");
      setLoading(false);
      return updatedMedication;
    } catch (error) {
      setError("Erreur lors de la suppression du lot");
      setLoading(false);
      return null;
    }
  };

  const value = {
    medications: medicationsList,
    loading,
    error,
    success,
    createMedication,
    fetchMedications,
    getMedicationByCIP13,
    updateLotQuantity,
    deleteLot,
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
