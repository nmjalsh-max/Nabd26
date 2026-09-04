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

function HeartLogo({ size = 26, color, stroke }: { size?: number; color?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
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
    <div
      style={{
        background: `radial-gradient(circle at 20% 20%, rgba(139,92,246,0.18), transparent 28%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.12), transparent 30%), ${C.bg}`,
        minHeight: "100vh",
        color: C.textHi,
        fontFamily: "var(--font-ui)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,12,22,0.45), rgba(8,12,22,0.1))" }} />

      <header
        style={{ borderBottom: `0.5px solid ${C.borderLo}` }}
        className="relative z-10 flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
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
            <HeartLogo color={C.lavender} stroke={C.bg} size={18} />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", color: C.lavSoft }} className="font-bold text-base">
            Nabd <span style={{ color: C.lavender }}>Space</span>
          </span>
        </div>
        <LangToggle />
      </header>

      <section className="relative z-10 text-center px-6 pt-16 pb-12 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            height: 260,
            background: "radial-gradient(circle, rgba(139,92,246,0.20), transparent 70%)",
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        <div className="flex justify-center mb-5">
          <HeartLogo size={64} color={C.pink} stroke={C.bg} />
        </div>

        <h1
          style={{ fontFamily: "var(--font-heading)", color: C.lavSoft }}
          className="text-4xl font-bold mb-3"
        >
          {isEn ? "Nabd Space" : "نبض"}
        </h1>

        <p style={{ color: C.textHi }} className="max-w-md mx-auto mb-2 leading-relaxed">
          {isEn ? "Caring for employee morale — with calm and attention." : "منصة تهتم بصحتك النفسية داخل بيئة العمل"}
        </p>

        <p style={{ color: C.textMid }} className="text-sm max-w-md mx-auto mb-8 leading-relaxed">
          {isEn
            ? "Track your daily mood, collect points, and book relaxation sessions — all in one calm and safe place."
            : "تابع مزاجك يوميًا، اجمع نقاطًا، واحجز جلسات استرخاء — في مكان واحد هادئ وآمن"}
        </p>

        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            style={{
              background: `linear-gradient(90deg, ${C.lavender} 0%, ${C.pink} 100%)`,
              color: C.bg,
              boxShadow: "0 12px 24px rgba(139, 92, 246, 0.25)",
            }}
            className="rounded-2xl px-7 py-3 text-sm font-bold"
          >
            {isEn ? "Login" : "تسجيل الدخول"}
          </Link>
          <Link
            to="/signup"
            style={{ border: `1px solid ${C.border}`, color: C.lavSoft, background: "rgba(19, 27, 46, 0.9)" }}
            className="rounded-2xl px-7 py-3 text-sm"
          >
            {isEn ? "Create account" : "إنشاء حساب"}
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {features.map((f) => (
          <div
            key={f.title}
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: `0 16px 32px rgba(9, 12, 18, 0.18)` }}
            className="rounded-2xl p-5"
          >
            <div
              style={{ background: "rgba(139, 92, 246, 0.12)", color: C.lavender }}
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-sm"
            >
              {f.icon}
            </div>
            <p style={{ fontFamily: "var(--font-heading)", color: C.textHi }} className="text-sm mb-1">
              {f.title}
            </p>
            <p style={{ color: C.textLo }} className="text-xs leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

