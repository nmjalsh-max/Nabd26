import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./BootContext";
import type { AppRole } from "../lib/supabaseClient";

export function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: AppRole | AppRole[];
  children: React.ReactElement;
}) {
  const { isLoading, role } = useContext(AuthContext);

  if (isLoading) {
    return null;
  }

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/employee"} replace />;
  }

  return children;
}

