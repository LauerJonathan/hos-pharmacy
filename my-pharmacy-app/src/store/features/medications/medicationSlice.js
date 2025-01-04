import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  medications: [],
  loading: false,
  error: null,
  success: null,
  searchedMedication: null,
};

const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
      state.loading = false;
    },
    addMedication: (state, action) => {
      state.medications.push(action.payload);
    },
    updateMedicationLots: (state, action) => {
      // Mettre à jour dans la liste principale
      const index = state.medications.findIndex(
        (med) => med.cip13 === action.payload.cip13
      );
      if (index !== -1) {
        state.medications[index] = action.payload;
      }

      // Mettre à jour aussi searchedMedication si c'est le même médicament
      if (
        state.searchedMedication &&
        state.searchedMedication.cip13 === action.payload.cip13
      ) {
        state.searchedMedication = action.payload;
      }
    },
    resetStatus: (state) => {
      state.error = null;
      state.success = null;
    },
    setMedications: (state, action) => {
      state.medications = action.payload;
    },
    setSearchedMedication: (state, action) => {
      state.searchedMedication = action.payload;
    },
    resetSearchedMedication: (state) => {
      state.searchedMedication = null;
    },
  },
});

// Nouveaux sélecteurs à ajouter à la fin du fichier
export const selectMedicationByCIP13 = (state, cip13) => {
  // Chercher d'abord dans searchedMedication
  if (
    state.medications.searchedMedication &&
    state.medications.searchedMedication.cip13 === cip13
  ) {
    return state.medications.searchedMedication;
  }

  // Sinon chercher dans la liste complète
  return state.medications.medications.find((med) => med.cip13 === cip13);
};

export const selectExpiredLots = (state, cip13) => {
  const medication = selectMedicationByCIP13(state, cip13);
  return medication?.lots.filter((lot) => lot.isExpired) || [];
};

export const selectValidLots = (state, cip13) => {
  const medication = selectMedicationByCIP13(state, cip13);
  return medication?.lots.filter((lot) => !lot.isExpired) || [];
};

export const selectStockStatus = (state, cip13) => {
  const medication = selectMedicationByCIP13(state, cip13);
  if (!medication) return null;

  return {
    currentStock: medication.currentStock,
    minQuantity: medication.minQuantity,
    isLow: medication.currentStock < medication.minQuantity,
    status: medication.stockStatus,
  };
};

export const {
  setLoading,
  setError,
  setSuccess,
  addMedication,
  updateMedicationLots,
  resetStatus,
  setMedications,
  setSearchedMedication,
  resetSearchedMedication,
} = medicationSlice.actions;

export const selectAllMedications = (state) => state.medications.medications;
export const selectMedicationsLoading = (state) => state.medications.loading;
export const selectMedicationsError = (state) => state.medications.error;
export const selectMedicationsSuccess = (state) => state.medications.success;
export const selectSearchedMedication = (state) =>
  state.medications.searchedMedication;

export default medicationSlice.reducer;
