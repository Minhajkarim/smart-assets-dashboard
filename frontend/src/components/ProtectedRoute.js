// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component to manage role-based access
const ProtectedRoute = ({ role, children, allowedRoles }) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }

  return children; // Render the children if role is allowed
};

export { ProtectedRoute };
