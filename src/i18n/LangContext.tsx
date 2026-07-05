import { createContext, useContext, useMemo, useState } from "react";
import type { Lang } from "./i18n";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children, initialLang = "en" }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

