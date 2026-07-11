import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { authMock } from "../mock-data";
import { t } from "../i18n/i18n";
import { useLang } from "../i18n/LangContext";
import LangToggle from "../components/LangToggle";
import { getSupabaseClient, resolveEmailByEmployeeNumber } from "../lib/supabaseClient";

const MOCK_STORAGE_KEY = "mock_auth";

function resolveMockLoginUser(role: "employee" | "admin", rawIdentifier: string) {
  const normalized = rawIdentifier.trim().toLowerCase();
  const baseIdentifier = normalized.replace(/@.*$/, "");

  if (role === "employee") {
    if (["emp1", "emp-1", "emp1@example.com", "emp-1@example.com"].includes(normalized)) {
      return authMock.employees[0];
    }

    if (["emp1", "emp-1"].includes(baseIdentifier)) {
      return authMock.employees[0];
    }
  }

  if (role === "admin") {
    if (["admin", "admin@example.com"].includes(normalized)) {
      return authMock.admins[0];
    }

    if (baseIdentifier === "admin") {
      return authMock.admins[0];
    }
  }

  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const { lang } = useLang();

  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
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

    const client = getSupabaseClient();
    if (!client) {
      const mockUser = resolveMockLoginUser(role, id);
      const isValidMock = Boolean(mockUser && mockUser.password === password);

      if (!isValidMock) {
        setError(t(lang, "invalidData"));
        return;
      }

      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify({ role, userId: mockUser.username }));
      navigate(role === "employee" ? "/employee" : "/admin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const email =
        role === "employee"
          ? (await resolveEmailByEmployeeNumber(client, id)) ?? id
          : id;

      const { data, error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !data.session?.user?.id) {
        setError(signInError?.message ?? t(lang, "invalidData"));
        return;
      }

      const { data: profile, error: profileError } = await client
        .from("users")
        .select("role")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (profileError || !profile?.role) {
        setError(lang === "en" ? "Profile role is missing." : "دور الملف غير موجود.");
        return;
      }

      if (profile.role !== role) {
        setError(
          lang === "en"
            ? "Selected role does not match this account."
            : "الدور المحدد لا يتطابق مع هذا الحساب."
        );
        return;
      }

      navigate(role === "employee" ? "/employee" : "/admin");
    } catch {
      setError(t(lang, "invalidData"));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    const client = getSupabaseClient();

    if (!client) {
      setError(lang === "en" ? "Password reset requires Supabase config." : "استعادة كلمة المرور تحتاج إعداد Supabase.");
      return;
    }

    const email = identifier.trim();
    if (!email) {
      setError(t(lang, "emptyIdentifier"));
      return;
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });

    setError(
      error
        ? error.message
        : lang === "en"
          ? "Password reset email sent."
          : "تم إرسال رابط استعادة كلمة المرور."
    );
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
              { r: "employee" as const, label: t(lang, "roleEmployee") },
              { r: "admin" as const, label: t(lang, "roleAdmin") },
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
                placeholder={role === "employee" ? "emp1 أو EMP-..." : "admin"}
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
                onClick={() => void handleForgotPassword()}
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
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                  border: "none",
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontWeight: 900,
                  color: "#0B0B14",
                  cursor: loading ? "not-allowed" : "pointer",
                  minWidth: 140,
                  opacity: loading ? 0.72 : 1,
                }}
              >
                {loading ? (lang === "en" ? "Signing in…" : "جارٍ الدخول…") : t(lang, "submit")} →
              </button>
            </div>

            {touched && error && (
              <div style={{ background: "#2A0D0D", border: `1px solid ${C.red}55`, borderRadius: 12, padding: 12, color: C.red, fontSize: 12, lineHeight: 1.6 }}>
                {error}
              </div>
            )}

            <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>
              {lang === "en" ? "Use Supabase Auth to sign in, or mock credentials for local preview." : "استخدم Supabase Auth للدخول، أو بيانات تجريبية للمعاينة المحلية."}
              <div style={{ marginTop: 4, color: C.textMid, fontWeight: 800 }}>{t(lang, "loginHint")}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


