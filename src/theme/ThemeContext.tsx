import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { C as darkC, lightC, type Palette } from "./tokens";

export type ThemeMode = "dark" | "light";

type ThemeCtxValue = {
  mode: ThemeMode;
  theme: Palette;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeCtxValue | null>(null);

const STORAGE_KEY = "nabd_theme";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  const value = useMemo<ThemeCtxValue>(
    () => ({
      mode,
      theme: mode === "light" ? lightC : darkC,
      toggle: () => setModeState((prev) => (prev === "light" ? "dark" : "light")),
      setMode: setModeState,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeCtxValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

