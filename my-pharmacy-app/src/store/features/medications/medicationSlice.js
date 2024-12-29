// store/features/medications/medicationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  medications: [],
  loading: false,
  error: null,
  success: null,
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
    resetStatus: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const { setLoading, setError, setSuccess, addMedication, resetStatus } =
  medicationSlice.actions;

export default medicationSlice.reducer;
