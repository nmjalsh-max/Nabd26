import { Link } from "react-router-dom";
import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/LangContext";
import { useTheme } from "../theme/ThemeContext";

const featuresEn = [
  { icon: "❤️", title: "Daily pulse", desc: "A simple daily check-in to measure your mood and well-being." },
  { icon: "🤝", title: "Support follow-up", desc: "Supportive and non-stigmatizing follow-up for critical cases." },
  { icon: "⭐", title: "Reward loops", desc: "Points and rewards that motivate you to participate." },
];

const featuresAr = [
  { icon: "❤️", title: "قياس يومي", desc: "مقياس يومي بسيط لمزاجك ورفاهيتك" },
  { icon: "🤝", title: "متابعة داعمة", desc: "متابعة داعمة وغير وصمية للحالات الحرجة" },
  { icon: "⭐", title: "مكافآت وتحفيز", desc: "نقاط ومكافآت تحفّزك على المشاركة" },
];

// Heart logo — same as used in AppShell and HeartLoader
function HeartLogo({ size = 26, color, stroke }: { size?: number; color?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34">
      <path
        d="M17 25 C8 19 6 13 10 10 C13 8 16 10 17 13 C18 10 21 8 24 10 C28 13 26 19 17 25 Z"
        fill={color}
      />
      <path
        d="M6 17 H12 L14 12 L18 22 L20 17 H28"
        fill="none"
        stroke={stroke}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Landing() {
  const { lang } = useLang();
  const { theme: C } = useTheme();
  const isEn = lang === "en";
  const features = isEn ? featuresEn : featuresAr;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <header
        style={{ borderBottom: `0.5px solid ${C.borderLo}` }}
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <HeartLogo color={C.pink} stroke={C.bg} />
          <span style={{ fontFamily: "'Sora', sans-serif", color: C.lavSoft }} className="font-bold text-base">
            Nabd Space
          </span>
        </div>
        <LangToggle />
      </header>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-12 relative overflow-hidden">
        <div
          style={{
            background: `radial-gradient(circle, ${C.lavender}22, transparent 70%)`,
            width: 260,
            height: 260,
          }}
          className="absolute top-4 left-1/2 -translate-x-1/2 -z-0"
        />
        <div className="flex justify-center mb-5">
          <HeartLogo size={64} color={C.pink} stroke={C.bg} />
        </div>
        <h1
          style={{ fontFamily: "'Sora', sans-serif", color: C.lavSoft }}
          className="text-4xl font-bold mb-3"
        >
          {isEn ? "Nabd Space" : "نبض"}
        </h1>
        <p style={{ color: C.textHi }} className="max-w-md mx-auto mb-2 leading-relaxed">
          {isEn
            ? "Caring for employee morale — with calm and attention."
            : "منصة تهتم بصحتك النفسية داخل بيئة العمل"}
        </p>
        <p style={{ color: C.textMid }} className="text-sm max-w-md mx-auto mb-8 leading-relaxed">
          {isEn
            ? "Track your daily mood, collect points, and book relaxation sessions — all in one calm and safe place."
            : "تابع مزاجك يوميًا، اجمع نقاطًا، واحجز جلسات استرخاء — في مكان واحد هادئ وآمن"}
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            style={{ background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`, color: C.bg }}
            className="rounded-2xl px-7 py-3 text-sm font-bold"
          >
            {isEn ? "Login" : "تسجيل الدخول"}
          </Link>
          <Link
            to="/signup"
            style={{ border: `0.5px solid ${C.lavDim}`, color: C.lavSoft }}
            className="rounded-2xl px-7 py-3 text-sm"
          >
            {isEn ? "Create account" : "إنشاء حساب"}
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.title}
            style={{ background: C.surface, border: `0.5px solid ${C.border}` }}
            className="rounded-2xl p-5"
          >
            <div
              style={{ background: "#2A1F3D" }}
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 text-sm"
            >
              {f.icon}
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-sm mb-1">
              {f.title}
            </p>
            <p style={{ color: C.textLo }} className="text-xs leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Role sections */}
      <section className="px-6 pb-14 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-6 text-center"
        >
          <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-sm mb-1">
            {isEn ? "I'm an Employee" : "أنا موظف"}
          </p>
          <p style={{ color: C.textLo }} className="text-xs">
            {isEn ? "Track your mood and enjoy your benefits" : "تابع مزاجك واستمتع بمزاياك"}
          </p>
        </div>
        <div
          style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-6 text-center"
        >
          <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-sm mb-1">
            {isEn ? "I'm an Admin" : "أنا أدمن"}
          </p>
          <p style={{ color: C.textLo }} className="text-xs">
            {isEn ? "Monitor and analyze your team's well-being" : "راقب وحلّل صحة فريقك"}
          </p>
        </div>
      </section>
    </div>
  );
}

