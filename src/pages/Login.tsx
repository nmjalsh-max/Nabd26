import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";

type Role = "employee" | "admin";

// شعار القلب النابض — نفس الشعار المستخدم في Landing وAppShell
function HeartLogo({ size = 22 }: { size?: number }) {
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
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("employee");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اربط هذا مع نفس منطق تسجيل الدخول الحالي (Supabase Auth أو Mock Data)
    if (!identifier || !password) {
      setError("أدخل البريد أو رقم الموظف وكلمة المرور");
      return;
    }
    setError("");
    navigate(role === "employee" ? "/employee" : "/admin");
  };

  return (
    <div dir="rtl" style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
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
          <button
            style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="rounded-full px-3 py-1 text-xs"
          >
            العربية
          </button>
          <button style={{ color: C.textLo }} className="rounded-full px-3 py-1 text-xs">
            English
          </button>
        </div>
      </header>

      {/* Login card */}
      <div className="flex justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-lg font-bold mb-1">
              تسجيل الدخول
            </p>
            <p style={{ color: C.textLo }} className="text-xs">
              واجهة موحدة — تمييز شكلي بين موظف / أدمن
            </p>
          </div>

          {/* Role switch */}
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

          {/* Identifier */}
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

          {/* Password */}
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
            style={{ background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`, color: C.bg }}
            className="w-full rounded-xl py-3 text-sm font-bold mb-5"
          >
            دخول ←
          </button>

          <div style={{ borderTop: `0.5px solid ${C.borderLo}` }} className="pt-3 text-center">
            <p style={{ color: C.textLo }} className="text-[11px] leading-relaxed">
              يستخدم Supabase Auth للدخول، أو بيانات تجريبية للمعاينة المحلية
            </p>
            <p style={{ color: C.lavDim, fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] mt-1">
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
