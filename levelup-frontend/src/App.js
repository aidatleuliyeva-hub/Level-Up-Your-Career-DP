// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function PrivateRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <div className="splash-screen">Loading profile...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppInner() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ToastProvider>
  );
}
