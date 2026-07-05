import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { authMock } from "../mock-data";

export default function Login() {
  const navigate = useNavigate();
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
      setError("الرجاء إدخال البريد/رقم وظيفي.");
      return;
    }
    if (!password) {
      setError("الرجاء إدخال كلمة المرور.");
      return;
    }

    const ok = candidates.some((u) => u.username === id && u.password === password);
    if (!ok) {
      setError("بيانات غير صحيحة. جرّب مرة أخرى");
      return;
    }

    setError(null);
    // UI-only navigation
    navigate(role === "موظف" ? "/employee" : "/admin");
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>تسجيل الدخول</div>
          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>
            واجهة موحّدة — تمييز شكلي بين موظف/أدمن.
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, justifyContent: "flex-start" }}>
            {["موظف", "أدمن"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r as any);
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
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-10">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: C.textMid, fontSize: 12 }}>البريد أو رقم الموظف</label>
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
              <label style={{ color: C.textMid, fontSize: 12 }}>كلمة المرور</label>
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
                onClick={() => setError("رابط “نسيت كلمة المرور” شكلي في هذه المرحلة.")}
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
                نسيت كلمة المرور؟
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
                دخول →
              </button>
            </div>

            {touched && error && (
              <div style={{ background: "#2A0D0D", border: `1px solid ${C.red}55`, borderRadius: 12, padding: 12, color: C.red, fontSize: 12, lineHeight: 1.6 }}>
                {error}
              </div>
            )}

            <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>
              بيانات تجريبية:
              <div style={{ marginTop: 4, color: C.textMid, fontWeight: 800 }}>
                موظف: emp1 / 1234 — أدمن: admin / 1234
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

