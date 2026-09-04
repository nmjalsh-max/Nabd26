import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import { useLang } from "../i18n/LangContext";
import LangToggle from "../components/LangToggle";

type Role = "employee" | "admin";

const STORAGE_KEY = "mock_auth";

const DEMO_ACCOUNTS: Record<string, { password: string; role: Role }> = {
  emp1: { password: "1234", role: "employee" },
  admin: { password: "1234", role: "admin" },
};

const TEXT = {
  en: {
    title: "Welcome Back",
    subtitle: "Sign in to your well-being dashboard",
    employee: "Employee",
    admin: "Administrator",
    identifierLabel: "Work Email or ID",
    identifierPlaceholder: "name@company.com",
    passwordLabel: "Password",
    forgot: "Forgot?",
    submit: "Sign In to Space",
    submitting: "Signing in…",
    emptyFields: "Enter your email/employee ID and password",
    noSupabase: "Invalid credentials, and Supabase isn't configured for real accounts",
    invalid: "Invalid credentials",
    hint: "Enterprise authentication secured by Supabase RLS",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
  },
  ar: {
    title: "مرحباً بعودتك",
    subtitle: "تسجيل الدخول إلى لوحة رفاهية الموظفين",
    employee: "موظف",
    admin: "مدير",
    identifierLabel: "البريد أو رقم الموظف",
    identifierPlaceholder: "name@company.com",
    passwordLabel: "كلمة المرور",
    forgot: "نسيت؟",
    submit: "تسجيل الدخول",
    submitting: "جارٍ الدخول…",
    emptyFields: "أدخل البريد أو رقم الموظف وكلمة المرور",
    noSupabase: "بيانات الدخول غير صحيحة، وSupabase غير مُعدّ للتحقق من حسابات حقيقية",
    invalid: "بيانات الدخول غير صحيحة",
    hint: "مصادقة المؤسسات محمية بواسطة Supabase RLS",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",
  },
} as const;

function HeartLogo({ size = 22 }: { size?: number }) {
  const { theme: C } = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
      <path
        d="M17 25 C8 19 6 13 10 10 C13 8 16 10 17 13 C18 10 21 8 24 10 C28 13 26 19 17 25 Z"
        fill={C.pink}
      />
      <path
        d="M6 17 H12 L14 12 L18 22 L20 17 H28"
        fill="none"
        stroke={C.bg}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Login() {
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const isEn = lang === "en";
  const T = TEXT[lang];

  const [role, setRole] = useState<Role>("employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError(T.emptyFields);
      return;
    }

    const demo = DEMO_ACCOUNTS[identifier.trim().toLowerCase()];
    if (demo && demo.password === password) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ role: demo.role, userId: identifier.trim() }));
      window.location.href = demo.role === "admin" ? "/admin" : "/employee";
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setError(T.noSupabase);
      return;
    }

    setLoading(true);
    const { error: authError } = await client.auth.signInWithPassword({
      email: identifier.trim(),
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message || T.invalid);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: `radial-gradient(circle at 20% 20%, rgba(139,92,246,0.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 30%), ${C.bg}`,
        overflow: "hidden",
        fontFamily: "var(--font-ui)",
      }}
    >
      <style>{`
        @keyframes pulseMesh { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.1); opacity: 1; } }
        @keyframes riseIn { 0% { opacity: 0; transform: translateY(18px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,12,22,0.45), rgba(8,12,22,0.08))" }} />

      <div
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          top: "-10%",
          left: "-6%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.18), transparent 65%)",
          filter: "blur(12px)",
          animation: "pulseMesh 14s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          right: "-8%",
          top: "14%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.18), transparent 65%)",
          filter: "blur(12px)",
          animation: "pulseMesh 18s ease-in-out infinite alternate",
        }}
      />

      <header
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 32px 0" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(139, 92, 246, 0.12)",
              border: `1px solid ${C.border}`,
            }}
          >
            <HeartLogo size={18} />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", color: C.lavSoft, fontWeight: 800, letterSpacing: "0.04em" }}>
            Nabd <span style={{ color: C.lavender }}>Space</span>
          </span>
        </div>

        <LangToggle />
      </header>

      <main style={{ position: "relative", zIndex: 1, minHeight: "calc(100vh - 88px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 20px 64px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 430,
            background: "rgba(19, 27, 46, 0.88)",
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: "30px 28px 22px",
            boxShadow: C.shadow,
            backdropFilter: "blur(16px)",
            animation: "riseIn 0.75s ease-out forwards",
          }}
        >
          <div style={{ display: "flex", background: C.surfaceHi, border: `1px solid ${C.border}`, borderRadius: 14, padding: 4, marginBottom: 22 }}>
            {(["employee", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 12px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  background: role === r ? C.gradient : "transparent",
                  color: role === r ? C.bg : C.textMid,
                  boxShadow: role === r ? "0 10px 24px rgba(139, 92, 246, 0.18)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {r === "employee" ? T.employee : T.admin}
              </button>
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: 28, fontWeight: 800, color: C.textHi, letterSpacing: "-0.04em" }}>
              {T.title}
            </p>
            <p style={{ margin: "8px 0 0", color: C.textLo, fontSize: 13, lineHeight: 1.6 }}>{T.subtitle}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {T.identifierLabel}
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={T.identifierPlaceholder}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.surfaceHi,
                color: C.textHi,
                fontSize: 14,
                outline: "none",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.textMid, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {T.passwordLabel}
              </label>
              <a href="#" style={{ color: C.lavender, fontSize: 12, fontWeight: 600 }}>{T.forgot}</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.surfaceHi,
                color: C.textHi,
                fontSize: 14,
                outline: "none",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            />
          </div>

          {error && <p style={{ color: C.red, fontSize: 12, lineHeight: 1.5, margin: "12px 0 10px" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 12,
              padding: "13px 16px",
              background: `linear-gradient(90deg, ${C.lavender}, #4F46E5)`,
              color: C.bg,
              fontWeight: 800,
              fontSize: 14,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              boxShadow: "0 14px 28px rgba(139, 92, 246, 0.28)",
              marginTop: 18,
            }}
          >
            {loading ? T.submitting : T.submit}
          </button>

          <div style={{ marginTop: 22, borderTop: `1px solid ${C.borderLo}`, paddingTop: 18, textAlign: "center" }}>
            <p style={{ margin: 0, color: C.textLo, fontSize: 11, lineHeight: 1.7 }}>{T.hint}</p>
            <p style={{ margin: "8px 0 0", color: C.lavSoft, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em" }}>
              emp1 / 1234 — admin / 1234
            </p>
          </div>

          <p style={{ margin: "18px 0 0", color: C.textLo, fontSize: 13, textAlign: "center" }}>
            {T.noAccount}{" "}
            <Link to="/signup" style={{ color: C.lavSoft, fontWeight: 700, textDecoration: "none" }}>
              {T.createAccount}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
