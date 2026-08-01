import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { getSupabaseClient } from "../lib/supabaseClient";

type Role = "employee" | "admin";

const STORAGE_KEY = "mock_auth";

// بيانات تجريبية للمعاينة المحلية — تطابق ما هو معروض في الواجهة
const DEMO_ACCOUNTS: Record<string, { password: string; role: Role }> = {
  emp1: { password: "1234", role: "employee" },
  admin: { password: "1234", role: "admin" },
};

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

export default function Login() {
  const { theme: C } = useTheme();
  const [role, setRole] = useState<Role>("employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("أدخل البريد أو رقم الموظف وكلمة المرور");
      return;
    }

    // 1) تحقق من الحسابات التجريبية أولاً (mock data)
    const demo = DEMO_ACCOUNTS[identifier.trim().toLowerCase()];
    if (demo && demo.password === password) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ role: demo.role, userId: identifier.trim() })
      );
      // إعادة تحميل كاملة عشان BootContext يقرأ الجلسة الجديدة من localStorage
      window.location.href = demo.role === "admin" ? "/admin" : "/employee";
      return;
    }

    // 2) لو مو حساب تجريبي، جرّب Supabase Auth (يحتاج البريد الإلكتروني)
    const client = getSupabaseClient();
    if (!client) {
      setError("بيانات الدخول غير صحيحة، وSupabase غير مُعدّ للتحقق من حسابات حقيقية");
      return;
    }

    setLoading(true);
    const { error: authError } = await client.auth.signInWithPassword({
      email: identifier.trim(),
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message || "بيانات الدخول غير صحيحة");
      return;
    }

    // onAuthStateChange في BootProvider سيحدّث الدور تلقائيًا،
    // نعمل إعادة تحميل لضمان استقرار الحالة قبل الدخول لصفحة محمية
    window.location.href = "/";
  }

  return (
    <div dir="rtl" style={{ background: C.bg, minHeight: "100vh", fontFamily: "var(--font-ui)" }}>
      <header
        style={{ borderBottom: `0.5px solid ${C.borderLo}` }}
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <HeartLogo />
          <span style={{ fontFamily: "var(--font-heading)", color: C.lavSoft }} className="font-bold text-sm">
            Nabd Space
          </span>
        </div>
      </header>

      <div className="flex justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <p style={{ fontFamily: "var(--font-heading)", color: C.textHi }} className="text-lg font-bold mb-1">
              تسجيل الدخول
            </p>
            <p style={{ color: C.textLo }} className="text-xs">
              واجهة موحدة — تمييز شكلي بين موظف / أدمن
            </p>
          </div>

          <div
            style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}` }}
            className="flex rounded-xl p-1 mb-6"
          >
            {(["employee", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`, color: C.bg }
                    : { color: C.textMid }
                }
                className="flex-1 text-center rounded-lg py-2 text-xs font-bold"
              >
                {r === "employee" ? "موظف" : "أدمن"}
              </button>
            ))}
          </div>

          <label style={{ color: C.textMid }} className="block text-xs mb-1.5">
            البريد أو رقم الموظف
          </label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="emp1 أو EMP-..."
            style={{ background: C.bg, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm mb-4 outline-none"
          />

          <label style={{ color: C.textMid }} className="block text-xs mb-1.5">
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            style={{ background: C.bg, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm mb-2 outline-none"
          />

          {error && (
            <p style={{ color: C.red }} className="text-xs mb-3">
              {error}
            </p>
          )}

          <div className="text-left mb-5">
            <span style={{ color: C.cyan }} className="text-xs cursor-pointer">
              نسيت كلمة المرور؟
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
              color: C.bg,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            className="w-full rounded-xl py-3 text-sm font-bold mb-5"
          >
            {loading ? "جارٍ الدخول…" : "دخول ←"}
          </button>

          <div style={{ borderTop: `0.5px solid ${C.borderLo}` }} className="pt-3 text-center">
            <p style={{ color: C.textLo }} className="text-[11px] leading-relaxed">
              يستخدم Supabase Auth للدخول، أو بيانات تجريبية للمعاينة المحلية
            </p>
            <p style={{ color: C.lavDim, fontFamily: "var(--font-mono)" }} className="text-[10px] mt-1">
              emp1 / 1234 — admin / 1234
            </p>
          </div>

          <p style={{ color: C.textLo }} className="text-xs text-center mt-4">
            ليس لديك حساب؟{" "}
            <Link to="/signup" style={{ color: C.lavSoft }}>
              إنشاء حساب
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
