import { Link } from "react-router-dom";
import { C } from "../theme/tokens";

// شعار القلب النابض — نفس الشعار المستخدم في AppShell وHeartLoader
function HeartLogo({ size = 26 }: { size?: number }) {
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

const features = [
  { icon: "❤", title: "Daily pulse", desc: "مقياس يومي بسيط لمزاجك ورفاهيتك" },
  { icon: "🤝", title: "Support follow-up", desc: "متابعة داعمة وغير وصمية للحالات الحرجة" },
  { icon: "★", title: "Reward loops", desc: "نقاط ومكافآت تحفّزك على المشاركة" },
];

export default function Landing() {
  return (
    <div dir="rtl" style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <header
        style={{ borderBottom: `0.5px solid ${C.borderLo}` }}
        className="flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <HeartLogo />
          <span style={{ fontFamily: "'Sora', sans-serif", color: C.lavSoft }} className="font-bold text-base">
            Nabd Space
          </span>
        </div>
        <div className="flex gap-2">
          <button
            style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}`, color: C.textHi }}
            className="rounded-full px-4 py-1.5 text-xs"
          >
            العربية
          </button>
          <button style={{ color: C.textLo }} className="rounded-full px-4 py-1.5 text-xs">
            English
          </button>
        </div>
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
          <HeartLogo size={64} />
        </div>
        <h1
          style={{ fontFamily: "'Sora', sans-serif", color: C.lavSoft }}
          className="text-4xl font-bold mb-3"
        >
          نبض
        </h1>
        <p style={{ color: C.textHi }} className="max-w-md mx-auto mb-2 leading-relaxed">
          منصة تهتم بصحتك النفسية داخل بيئة العمل
        </p>
        <p style={{ color: C.textMid }} className="text-sm max-w-md mx-auto mb-8 leading-relaxed">
          تابع مزاجك يوميًا، اجمع نقاطًا، واحجز جلسات استرخاء — في مكان واحد هادئ وآمن
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/login"
            style={{ background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`, color: C.bg }}
            className="rounded-2xl px-7 py-3 text-sm font-bold"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/signup"
            style={{ border: `0.5px solid ${C.lavDim}`, color: C.lavSoft }}
            className="rounded-2xl px-7 py-3 text-sm"
          >
            إنشاء حساب
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
            أنا موظف
          </p>
          <p style={{ color: C.textLo }} className="text-xs">
            تابع مزاجك واستمتع بمزاياك
          </p>
        </div>
        <div
          style={{ background: C.surfaceHi, border: `0.5px solid ${C.border}` }}
          className="rounded-2xl p-6 text-center"
        >
          <p style={{ fontFamily: "'Sora', sans-serif", color: C.textHi }} className="text-sm mb-1">
            أنا أدمن
          </p>
          <p style={{ color: C.textLo }} className="text-xs">
            راقب وحلّل صحة فريقك
          </p>
        </div>
      </section>
    </div>
  );
}
