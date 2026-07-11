import React, { createContext, useEffect, useMemo, useState } from "react";
import { HeartLoader } from "../components/HeartLoader";
import { getSupabaseClient, resolveUserRoleById, type AppRole } from "../lib/supabaseClient";

type AuthState = {
  isLoading: boolean;
  role: AppRole | null;
  userId: string | null;
};

export const AuthContext = createContext<AuthState>({
  isLoading: true,
  role: null,
  userId: null,
});

const STORAGE_KEY = "mock_auth";

function readStoredSession(): { role: AppRole | null; userId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { role: null, userId: null };
    }

    const parsed = JSON.parse(raw) as { role?: string; userId?: string };
    const role = parsed.role === "admin" || parsed.role === "employee" ? parsed.role : null;

    return { role, userId: parsed.userId ?? null };
  } catch {
    return { role: null, userId: null };
  }
}

export function BootProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function syncFromSupabaseSession(sessionUserId: string | null, sessionRole: AppRole | null) {
      if (!ignore) {
        setUserId(sessionUserId);
        setRole(sessionRole);
        setIsLoading(false);
      }
    }

    async function initAuth() {
      const client = getSupabaseClient();

      if (!client) {
        const stored = readStoredSession();
        if (!ignore) {
          setRole(stored.role);
          setUserId(stored.userId);
          setIsLoading(false);
        }
        return;
      }

      const {
        data: { session },
      } = await client.auth.getSession();

      if (!session?.user?.id) {
        const stored = readStoredSession();
        if (!ignore) {
          setRole(stored.role);
          setUserId(stored.userId);
          setIsLoading(false);
        }
        return;
      }

      const resolvedRole = await resolveUserRoleById(client, session.user.id);
      await syncFromSupabaseSession(session.user.id, resolvedRole);

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange(async (_event, nextSession) => {
        if (!nextSession?.user?.id) {
          await syncFromSupabaseSession(null, null);
          return;
        }

        const nextRole = await resolveUserRoleById(client, nextSession.user.id);
        await syncFromSupabaseSession(nextSession.user.id, nextRole);
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    void initAuth();

    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(() => ({ isLoading, role, userId }), [isLoading, role, userId]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <HeartLoader label="Loading…" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

