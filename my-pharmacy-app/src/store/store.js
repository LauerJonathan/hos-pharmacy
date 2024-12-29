// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import medicationReducer from "./features/medications/medicationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medications: medicationReducer,
  },
});

export default store;
