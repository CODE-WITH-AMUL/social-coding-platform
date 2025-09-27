import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />; // redirect to login if not authenticated

  return (
    <div>
      <h1>Welcome, {user.username} 👋</h1>
      <p>This is your home page after login.</p>
    </div>
  );
};

export default Home;
