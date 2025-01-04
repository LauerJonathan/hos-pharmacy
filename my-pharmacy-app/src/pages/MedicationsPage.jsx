import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedications } from "../store/features/medications/medicationThunks";
import {
  selectAllMedications,
  selectMedicationsLoading,
  selectMedicationsError,
  selectMedicationsSuccess,
} from "../store/features/medications/medicationSlice";
import MedicationCard from "../components/medications/MedicationCard";
import MedicationStats from "../components/medications/MedicationStats";
import MedicationFilters from "../components/medications/MedicationFilters";
import { RestockProvider } from "../components/medications/RestockContext";
import Header from "../layouts/Header";
import { Alert } from "../components/ui/alert";

const MedicationsPage = () => {
  const dispatch = useDispatch();
  const medications = useSelector(selectAllMedications);
  console.log('Medications from Redux:', medications);

  const loading = useSelector(selectMedicationsLoading);
  const error = useSelector(selectMedicationsError);
  const success = useSelector(selectMedicationsSuccess);

  const [searchTerm, setSearchTerm] = useState("");
  const [cip13SearchTerm, setCip13SearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (cip13SearchTerm) setCip13SearchTerm("");
  };

  const handleCip13SearchChange = (value) => {
    setCip13SearchTerm(value);
    if (searchTerm) setSearchTerm("");
  };

  const filteredMedications = useMemo(() => {
    let result = [...medications];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (med) =>
          med.name.toLowerCase().includes(searchLower) ||
          med.form.toLowerCase().includes(searchLower) ||
          med.dose.toLowerCase().includes(searchLower)
      );
    }

    if (cip13SearchTerm) {
      result = result.filter((med) => {
        if (!med.cip13) return false;
        const medCip = med.cip13.toString();
        const searchCip = cip13SearchTerm.toString().replace(/^0+/, '');
        
        // Modification clé : utilisation de startsWith() au lieu de includes()
        return medCip.startsWith(searchCip);
      });
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "stock-asc":
        result.sort((a, b) => a.currentStock - b.currentStock);
        break;
      case "stock-desc":
        result.sort((a, b) => b.currentStock - a.currentStock);
        break;
      case "expiration":
        result.sort((a, b) => {
          const aDate = a.lots.reduce((earliest, lot) => {
            if (!lot.isExpired) {
              const lotDate = new Date(lot.expirationDate);
              return !earliest || lotDate < earliest ? lotDate : earliest;
            }
            return earliest;
          }, null);
          const bDate = b.lots.reduce((earliest, lot) => {
            if (!lot.isExpired) {
              const lotDate = new Date(lot.expirationDate);
              return !earliest || lotDate < earliest ? lotDate : earliest;
            }
            return earliest;
          }, null);
          return aDate - bDate;
        });
        break;
      case "low-stock":
        result.sort((a, b) => {
          const aIsLow = a.stockStatus === "low";
          const bIsLow = b.stockStatus === "low";
          return bIsLow - aIsLow;
        });
        break;
      default:
        break;
    }

    return result;
  }, [medications, searchTerm, cip13SearchTerm, sortBy]);

  const handleRestock = (medicationId, { currentStock, minQuantity }) => {
    console.log("Mise à jour du stock:", { medicationId, currentStock, minQuantity });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Stock des Médicaments</h2>

        <div className="mb-8">
          <MedicationStats />
        </div>

        <MedicationFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          cip13SearchTerm={cip13SearchTerm}
          onCip13SearchChange={handleCip13SearchChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <span>{error}</span>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <span>{success}</span>
          </Alert>
        )}

        {filteredMedications.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Aucun médicament ne correspond à votre recherche
          </div>
        )}

        <RestockProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                onRestock={handleRestock}
              />
            ))}
          </div>
        </RestockProvider>
      </main>
    </div>
  );
};

export default MedicationsPage;