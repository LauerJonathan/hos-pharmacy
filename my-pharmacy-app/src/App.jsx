import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import DashboardPage from "@/pages/DashboardPage";
import AddMedicationPage from "./pages/AddMedicationPage";
import MainLayout from "@/layouts/MainLayout";
import "./App.css";
import MedicationsPage from "./pages/MedicationsPage";
import StockMedPage from "./pages/StockMedPage";
import { MedicationProvider } from "./contexts/MedicationContext";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <BrowserRouter basename="/hosPharmacie/">
      <AuthProvider>
        <MedicationProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<LoginForm />} />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Routes protégées */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Navigate to="/dashboard" replace />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <MainLayout>
                    <RegisterForm />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-medication"
              element={
                <ProtectedRoute roles={["pharmacien"]}>
                  <AddMedicationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute roles={["pharmacien"]}>
                  <MedicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock/:cip13"
              element={
                <ProtectedRoute roles={["pharmacien"]}>
                  <StockMedPage />
                </ProtectedRoute>
              }
            />
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MedicationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
