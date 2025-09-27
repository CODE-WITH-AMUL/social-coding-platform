// frontend/src/App.js
// Corrected version of the App.js you provided.
// Fixed imports: Added Index import, changed Dashboard import to Home (assuming './pages/home' is Home.js for the protected dashboard).
// Assumed Login and Register are now in './account/login.js' and './account/register.js' based on your paths.
// Uncommented UploadProject if you want it; add its import if needed.
// No changes needed to index.js as per your note—it's the standard entry point.

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './accounts/login';
import Register from './accounts/register';
import Index from './pages/index';  // Public get started page
import Home from './pages/home';    // Protected dashboard (renamed from Dashboard for consistency)
// import UploadProject from './pages/UploadProject';
// Add more pages as needed, e.g., ProjectView

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          {/* <Route path="/upload" element={<PrivateRoute><UploadProject /></PrivateRoute>} /> */}
          {/* Add more protected routes, e.g., /projects/:id for viewing/liking */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;