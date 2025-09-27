// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/home";
import Login from "./accounts/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashbord from "./user/dashbord";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Public route */}
                    <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashbord />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
