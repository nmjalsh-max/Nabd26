import React, { useContext } from "react";
import { AuthContext } from "./BootContext";

type Role = "admin" | "employee";

export function ProtectedRoute({
  allowedRole,
  children,
}: {
  allowedRole: Role;
  children: React.ReactElement;
}) {
  const { isLoading, role } = useContext(AuthContext);

  // Keep logic conservative: do not redirect (per task).
  if (isLoading) return null;

  if (role !== allowedRole) {
    // Minimal fallback: render nothing (no redirects required).
    return null;
  }

  return children;
}

