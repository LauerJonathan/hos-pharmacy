// src/contexts/MedicationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { medications } from "../MOCKED/medications";
import { lots } from "../MOCKED/lots";

const MedicationContext = createContext(null);

// Fonction utilitaire pour calculer les propriétés d'un médicament
const calculateMedicationProperties = (medication, medicationLots) => {
  const now = new Date();
  const validLots = medicationLots.filter(
    (lot) =>
      lot.medicationId === medication.id && new Date(lot.expirationDate) > now
  );

  const currentStock = validLots.reduce((sum, lot) => sum + lot.quantity, 0);

  return {
    ...medication,
    currentStock,
    stockStatus: currentStock <= medication.minQuantity ? "low" : "normal",
    lots: medicationLots
      .filter((lot) => lot.medicationId === medication.id)
      .map((lot) => ({
        ...lot,
        isExpired: new Date(lot.expirationDate) < now,
      })),
  };
};

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
        // Enrichir les médicaments avec leurs lots et propriétés calculées
        const enrichedMedications = medications.map((med) =>
          calculateMedicationProperties(med, lots)
        );

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

  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  };

  const createMedication = async (medicationData) => {
    setLoading(true);
    try {
      if (medicationData.id) {
        // Ajout de lots à un médicament existant
        const newLots = medicationData.lots.map((lot, index) => ({
          id: String(lotsList.length + index + 1),
          lotNumber: lot.lotNumber,
          medicationId: medicationData.id,
          quantity: parseInt(lot.quantity),
          expirationDate: lot.expirationDate,
          receptionDate: new Date().toISOString().split("T")[0],
          isExpired: new Date(lot.expirationDate) < new Date(),
        }));

        const updatedLotsList = [...lotsList, ...newLots];
        setLotsList(updatedLotsList);

        // Recalculer les propriétés de tous les médicaments
        const updatedMedicationsList = medicationsList.map((med) => {
          if (med.id === medicationData.id) {
            return calculateMedicationProperties(med, updatedLotsList);
          }
          return med;
        });

        setMedicationsList(updatedMedicationsList);
        setSuccess("Lots ajoutés avec succès");
        return updatedMedicationsList.find(
          (med) => med.id === medicationData.id
        );
      } else {
        // Création d'un nouveau médicament
        const newMedicationId = String(medicationsList.length + 1);
        const newLots = medicationData.lots.map((lot, index) => ({
          id: String(lotsList.length + index + 1),
          lotNumber: lot.lotNumber,
          medicationId: newMedicationId,
          quantity: parseInt(lot.quantity),
          expirationDate: lot.expirationDate,
          receptionDate: new Date().toISOString().split("T")[0],
          isExpired: new Date(lot.expirationDate) < new Date(),
        }));

        const newMedication = {
          id: newMedicationId,
          name: medicationData.name,
          form: medicationData.form,
          dose: medicationData.dose,
          minQuantity: parseInt(medicationData.minQuantity),
          prescriptionRequired: medicationData.prescriptionRequired,
          cip13: medicationData.cip13,
        };

        // Enrichir le nouveau médicament avec les propriétés calculées
        const enrichedNewMedication = calculateMedicationProperties(
          newMedication,
          newLots
        );

        // Mettre à jour les deux listes
        setMedicationsList((prev) => [...prev, enrichedNewMedication]);
        setLotsList((prev) => [...prev, ...newLots]);

        setSuccess("Médicament créé avec succès");
        return enrichedNewMedication;
      }
    } catch (error) {
      setError("Erreur lors de la création du médicament");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const enrichedMedications = medicationsList.map((med) =>
        calculateMedicationProperties(med, lotsList)
      );
      setLoading(false);
      return enrichedMedications;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return [];
    }
  };

  const getMedicationByCIP13 = (cip13) => {
    const medication = medicationsList.find((med) => med.cip13 === cip13);
    if (!medication) return null;
    return calculateMedicationProperties(medication, lotsList);
  };

  const updateLotQuantity = async (cip13, lotNumber, increment) => {
    setLoading(true);
    try {
      const updatedLotsList = lotsList.map((lot) => {
        if (lot.lotNumber === lotNumber) {
          return { ...lot, quantity: lot.quantity + (increment ? 1 : -1) };
        }
        return lot;
      });

      setLotsList(updatedLotsList);

      // Recalculer les propriétés de tous les médicaments
      const updatedMedicationsList = medicationsList.map((med) =>
        calculateMedicationProperties(med, updatedLotsList)
      );
      setMedicationsList(updatedMedicationsList);

      setSuccess("Quantité mise à jour avec succès");
      return updatedMedicationsList.find((med) => med.cip13 === cip13);
    } catch (error) {
      setError("Erreur lors de la mise à jour de la quantité");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteLot = async (cip13, lotNumber) => {
    setLoading(true);
    try {
      const updatedLotsList = lotsList.filter(
        (lot) => lot.lotNumber !== lotNumber
      );
      setLotsList(updatedLotsList);

      // Recalculer les propriétés de tous les médicaments
      const updatedMedicationsList = medicationsList.map((med) =>
        calculateMedicationProperties(med, updatedLotsList)
      );
      setMedicationsList(updatedMedicationsList);

      setSuccess("Lot supprimé avec succès");
      return updatedMedicationsList.find((med) => med.cip13 === cip13);
    } catch (error) {
      setError("Erreur lors de la suppression du lot");
      return null;
    } finally {
      setLoading(false);
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
