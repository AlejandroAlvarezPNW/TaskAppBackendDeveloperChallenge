// src/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

// A simple ProtectedRoute component that checks if the user is logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if no token is found
  }

  return children; // If the user is authenticated, render the children (protected component)
};

export default ProtectedRoute;
