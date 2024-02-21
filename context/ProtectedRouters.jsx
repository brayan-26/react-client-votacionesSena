import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouters() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet/>;
}

export default ProtectedRouters;
