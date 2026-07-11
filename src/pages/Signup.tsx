import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { useLang } from "../i18n/LangContext";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const { lang } = useLang();

  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const client = getSupabaseClient();
    if (!client) {
      setError(lang === "en" ? "Supabase is not configured (missing env vars)." : "Supabase غير مُعدّ (متغيرات env ناقصة). ");
      return;
    }

    if (!role) {
      setError(lang === "en" ? "Role is required." : "الدور مطلوب.");
      return;
    }

    if (role === "employee") {
      if (!employeeNumber.trim()) {
        setError(lang === "en" ? "Employee number is required." : "رقم الموظف مطلوب.");
        return;
      }
    }

    if (!email.trim()) {
      setError(lang === "en" ? "Email is required." : "البريد الإلكتروني مطلوب.");
      return;
    }

    if (password.length < 6) {
      setError(lang === "en" ? "Password must be at least 6 characters." : "كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    const { error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          role,
          employee_number: role === "employee" ? employeeNumber.trim() : null,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Supabase may require email confirmation depending on project settings.
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.textHi,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>
              {lang === "en" ? "Create account" : "إنشاء حساب"}
            </div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>
              {lang === "en" ? "Sign up with email & password" : "سجّل بالبريد وكلمة المرور"}
            </div>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
          <form onSubmit={submit} className="flex flex-col gap-10">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 6, justifyContent: "flex-start" }}>
              {([
                { r: "employee" as const, label: lang === "en" ? "Employee" : "موظف" },
                { r: "admin" as const, label: lang === "en" ? "Admin" : "مدير" },
              ] as const).map(({ r, label }) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError(null);
                  }}
                  style={{
                    border: `1px solid ${role === r ? C.lavender : C.borderLo}`,
                    background:
                      role === r
                        ? `linear-gradient(135deg, ${C.lavender}33, ${C.pink}22)`
                        : "transparent",
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

            {role === "employee" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ color: C.textMid, fontSize: 12 }}>
                  {lang === "en" ? "Employee number" : "رقم الموظف"}
                </label>
                <input
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  placeholder={lang === "en" ? "emp1" : "emp1"}
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
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ color: C.textMid, fontSize: 12 }}>{lang === "en" ? "Email" : "البريد الإلكتروني"}</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "en" ? "you@example.com" : "name@example.com"}
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
              <label style={{ color: C.textMid, fontSize: 12 }}>{lang === "en" ? "Password" : "كلمة المرور"}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={lang === "en" ? "••••••" : "••••••"}
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

            {error && (
              <div
                style={{
                  background: "#2A0D0D",
                  border: `1px solid ${C.red}55`,
                  borderRadius: 12,
                  padding: 12,
                  color: C.red,
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                onClick={() => navigate("/login")}
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
                {lang === "en" ? "Back to login" : "العودة للدخول"}
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                  border: "none",
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontWeight: 900,
                  color: "#0B0B14",
                  cursor: loading ? "not-allowed" : "pointer",
                  minWidth: 160,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (lang === "en" ? "Creating…" : "جارٍ الإنشاء…") : lang === "en" ? "Sign up" : "إنشاء حساب"} →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

