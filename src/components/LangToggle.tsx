import { useLang } from "../i18n/LangContext";
import type { Lang } from "../i18n/i18n";
import { C } from "../theme/tokens";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const to = (l: Lang) => setLang(l);

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-start" }}>
      {([
        { l: "en" as const, label: "English" },
        { l: "ar" as const, label: "العربية" },
      ] as const).map(({ l, label }) => (
        <button
          key={l}
          type="button"
          onClick={() => to(l)}
          style={{
            border: `1px solid ${lang === l ? C.lavender : C.borderLo}`,
            background: lang === l ? `linear-gradient(135deg, ${C.lavender}33, ${C.pink}22)` : "transparent",
            color: lang === l ? C.lavSoft : C.textLo,
            borderRadius: 999,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 12,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

