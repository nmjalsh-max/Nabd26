import React, { createContext, useEffect, useMemo, useState } from "react";
import { HeartLoader } from "../components/HeartLoader";

type Role = "admin" | "employee";

type AuthState = {
  isLoading: boolean;
  role: Role | null;
};

export const AuthContext = createContext<AuthState>({ isLoading: true, role: null });

const STORAGE_KEY = "mock_auth";

function readStoredRole(): Role | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const r = parsed?.role;
    return r === "admin" || r === "employee" ? r : null;
  } catch {
    return null;
  }
}

/**
 * Minimal auth boot: shows HeartLoader for ~2 seconds then exposes role.
 * No route protection is enforced by default (kept simple per task).
 */
export function BootProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredRole();

    // Simulate permission check once per refresh.
    const id = window.setTimeout(() => {
      setRole(stored);
      setIsLoading(false);
    }, 2000);

    return () => window.clearTimeout(id);
  }, []);


  const value = useMemo(() => ({ isLoading, role }), [isLoading, role]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <HeartLoader label="Loading…" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

