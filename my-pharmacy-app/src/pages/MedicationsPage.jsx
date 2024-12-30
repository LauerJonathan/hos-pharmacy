// src/pages/MedicationsPage.jsx
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
import Header from "../layouts/Header";
import { Alert } from "../components/ui/alert";

const MedicationsPage = () => {
  const dispatch = useDispatch();
  const medications = useSelector(selectAllMedications);
  const loading = useSelector(selectMedicationsLoading);
  const error = useSelector(selectMedicationsError);
  const success = useSelector(selectMedicationsSuccess);

  // État local pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  // Filtrage et tri des médicaments
  const filteredMedications = useMemo(() => {
    let result = [...medications];

    // Filtrage par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (med) =>
          med.name.toLowerCase().includes(searchLower) ||
          med.form.toLowerCase().includes(searchLower) ||
          med.dose.toLowerCase().includes(searchLower)
      );
    }

    // Tri
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
        result.sort(
          (a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)
        );
        break;
      case "low-stock":
        result.sort((a, b) => {
          const aIsLow = a.currentStock <= a.minQuantity;
          const bIsLow = b.currentStock <= b.minQuantity;
          return bIsLow - aIsLow;
        });
        break;
      default:
        break;
    }

    return result;
  }, [medications, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Stock des Médicaments</h2>

        {/* Statistiques */}
        <div className="mb-8">
          <MedicationStats />
        </div>

        {/* Filtres */}
        <MedicationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Messages d'état */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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

        {/* Message si aucun résultat */}
        {filteredMedications.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Aucun médicament ne correspond à votre recherche
          </div>
        )}

        {/* Grille de médicaments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedications.map((medication) => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MedicationsPage;
