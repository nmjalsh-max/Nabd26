import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { useLang } from "../i18n/LangContext";
import { getSupabaseClient } from "../lib/supabaseClient";

// شعار القلب النابض — نفس الشعار المستخدم في Landing وLogin وAppShell
function HeartLogo({ size = 22 }: { size?: number }) {
  const { theme: C } = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 34 34">
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

export default function Signup() {
  const { theme: C } = useTheme();
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

  const isRTL = lang !== "en";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <header
        style={{ borderBottom: `0.5px solid ${C.borderLo}` }}
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <HeartLogo />
          <span style={{ fontFamily: "'Sora', sans-serif", color: C.lavSoft }} className="font-bold text-sm">
            Nabd Space
          </span>
        </div>
        <div className="flex gap-2">
          <span
            style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="rounded-full px-3 py-1 text-xs"
          >
            {isRTL ? "العربية" : "Arabic"}
          </span>
          <span style={{ color: C.textLo }} className="rounded-full px-3 py-1 text-xs">
            {isRTL ? "English" : "English"}
          </span>
        </div>
      </header>

      {/* Signup card */}
      <div className="flex justify-center px-6 py-10">
        <form
          onSubmit={submit}
          style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-lg font-bold mb-1">
              {lang === "en" ? "Create account" : "إنشاء حساب"}
            </p>
            <p style={{ color: C.textLo }} className="text-xs">
              {lang === "en" ? "Sign up with email & password" : "سجّل بالبريد وكلمة المرور"}
            </p>
          </div>

          {/* Role switch */}
          <div
            style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}` }}
            className="flex rounded-xl p-1 mb-6"
          >
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
                style={
                  role === r
                    ? { background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`, color: C.bg }
                    : { color: C.textMid }
                }
                className="flex-1 text-center rounded-lg py-2 text-xs font-bold"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Employee number */}
          {role === "employee" && (
            <>
              <label style={{ color: C.textMid }} className="block text-xs mb-1.5">
                {lang === "en" ? "Employee number" : "رقم الموظف"}
              </label>
              <input
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                placeholder="emp1"
                style={{ background: C.bg, border: `0.5px solid ${C.border}`, color: C.textHi }}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm mb-4 outline-none"
              />
            </>
          )}

          {/* Email */}
          <label style={{ color: C.textMid }} className="block text-xs mb-1.5">
            {lang === "en" ? "Email" : "البريد الإلكتروني"}
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={lang === "en" ? "you@example.com" : "name@example.com"}
            style={{ background: C.bg, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm mb-4 outline-none"
          />

          {/* Password */}
          <label style={{ color: C.textMid }} className="block text-xs mb-1.5">
            {lang === "en" ? "Password" : "كلمة المرور"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            style={{ background: C.bg, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm mb-2 outline-none"
          />

          {error && (
            <div
              style={{ background: "#2A0D0D", border: `0.5px solid ${C.red}55`, color: C.red }}
              className="rounded-xl p-3 text-xs leading-relaxed mb-4 mt-2"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
              color: C.bg,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            className="w-full rounded-xl py-3 text-sm font-bold mb-5 mt-3"
          >
            {loading ? (lang === "en" ? "Creating…" : "جارٍ الإنشاء…") : lang === "en" ? "Sign up" : "إنشاء حساب"} ←
          </button>

          <div style={{ borderTop: `0.5px solid ${C.borderLo}` }} className="pt-3 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{ color: C.textLo, background: "none", border: "none" }}
              className="text-xs cursor-pointer"
            >
              {lang === "en" ? "Back to login" : "العودة للدخول"}
            </button>
          </div>

          <p style={{ color: C.textLo }} className="text-xs text-center mt-4">
            {lang === "en" ? "Already have an account?" : "لديك حساب؟"}{" "}
            <Link to="/login" style={{ color: C.lavSoft }}>
              {lang === "en" ? "Log in" : "تسجيل الدخول"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
