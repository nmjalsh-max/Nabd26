import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { authMock } from "../mock-data";
import { t } from "../i18n/i18n";
import { useLang } from "../i18n/LangContext";
import LangToggle from "../components/LangToggle";

export default function Login() {
  const navigate = useNavigate();
  const { lang } = useLang();

  const [role, setRole] = useState<"موظف" | "أدمن">("موظف");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const candidates = useMemo(() => {
    return role === "موظف" ? authMock.employees : authMock.admins;
  }, [role]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    const id = identifier.trim();
    if (!id) {
      setError(t(lang, "emptyIdentifier"));
      return;
    }
    if (!password) {
      setError(t(lang, "emptyPassword"));
      return;
    }

    const ok = candidates.some((u) => u.username === id && u.password === password);
    if (!ok) {
      setError(t(lang, "invalidData"));
      return;
    }

    setError(null);
    navigate(role === "موظف" ? "/employee" : "/admin");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>{t(lang, "loginTitle")}</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{t(lang, "loginSubtitle")}</div>
          </div>
          <LangToggle />
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, justifyContent: "flex-start" }}>
            {([
              { r: "موظف" as const, label: t(lang, "roleEmployee") },
              { r: "أدمن" as const, label: t(lang, "roleAdmin") },
            ] as const).map(({ r, label }) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setError(null);
                  setTouched(false);
                }}
                style={{
                  border: `1px solid ${role === r ? C.lavender : C.borderLo}`,
                  background: role === r ? `linear-gradient(135deg, ${C.lavender}33, ${C.pink}22)` : "transparent",
                  color: role === r ? C.lavSoft : C.textLo,
                  borderRadius: 999,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-10">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: C.textMid, fontSize: 12 }}>{t(lang, "identifierLabel")}</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "موظف" ? "EMP-..." : "admin"}
                style={{
                  background: C.surfaceHi,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "11px 12px",
                  outline: "none",
                  color: C.textHi,
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: C.textMid, fontSize: 12 }}>{t(lang, "passwordLabel")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                style={{
                  background: C.surfaceHi,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "11px 12px",
                  outline: "none",
                  color: C.textHi,
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={() => setError(lang === "en" ? "Forgot password link is mock in this stage." : "رابط “نسيت كلمة المرور” شكلي في هذه المرحلة." )}
                style={{
                  background: "none",
                  border: "none",
                  color: C.textLo,
                  cursor: "pointer",
                  fontSize: 12,
                  padding: 0,
                  fontWeight: 700,
                }}
              >
                {t(lang, "forgotPassword")}
              </button>

              <button
                type="submit"
                style={{
                  background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                  border: "none",
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontWeight: 900,
                  color: "#0B0B14",
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                {t(lang, "submit")} →
              </button>
            </div>

            {touched && error && (
              <div style={{ background: "#2A0D0D", border: `1px solid ${C.red}55`, borderRadius: 12, padding: 12, color: C.red, fontSize: 12, lineHeight: 1.6 }}>
                {error}
              </div>
            )}

            <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>
              {lang === "en" ? "Mock credentials:" : "بيانات تجريبية:"}
              <div style={{ marginTop: 4, color: C.textMid, fontWeight: 800 }}>{t(lang, "loginHint")}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


