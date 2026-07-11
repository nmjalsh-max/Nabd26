import { Link } from "react-router-dom";
import { C } from "../theme/tokens";
import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/LangContext";
import { t } from "../i18n/i18n";

const features = [
  { title: "Daily pulse", body: "قياس يومي لطيف لمدى الطاقة والانضباط والعلاقات داخل الفريق." },
  { title: "Support follow-up", body: "تتبّع الحالات التي تحتاج تواصلًا ودعمًا دون وصم أو تمييز." },
  { title: "Reward loops", body: "نقاط ومكافآت تساهم في تحفيز الالتزام والحافز المستمر." },
];

const roleCards = [
  {
    title: "للموظف",
    items: ["مقياس يومي", "متابعة نقطة التقدم", "جلسات قريبة وإشعارات"],
  },
  {
    title: "للأدمن",
    items: ["تحليل معنويات الأقسام", "تقارير واقعية", "رفع ملفات الموظفين وتتبّع الحالات"],
  },
];

export default function Landing() {
  const { lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 18 }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 30, color: C.lavSoft }}>{t(lang, "brand")}</div>
            <div style={{ color: C.textMid, fontSize: 13, marginTop: 6 }}>{t(lang, "tagline")}</div>
          </div>
          <LangToggle />
        </div>

        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: 22,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            boxShadow: `0 14px 34px ${C.surfaceHi}`,
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 900 }}>Nabd Space</div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 28, lineHeight: 1.4 }}>
              {t(lang, "landingTitle")}
            </div>
            <div style={{ color: C.textMid, lineHeight: 1.8, fontSize: 14 }}>{t(lang, "landingBody")}</div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                  borderRadius: 14,
                  padding: "12px 16px",
                  color: C.bg,
                  fontWeight: 900,
                  minWidth: 136,
                  textAlign: "center",
                }}
              >
                {t(lang, "ctaLogin")}
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  border: `1px solid ${C.borderLo}`,
                  borderRadius: 14,
                  padding: "12px 16px",
                  color: C.lavSoft,
                  fontWeight: 900,
                  minWidth: 136,
                  textAlign: "center",
                }}
              >
                {lang === "en" ? "Create account" : "إنشاء حساب"}
              </Link>
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${C.surfaceHi}, ${C.surface})`,
              border: `1px solid ${C.borderLo}`,
              borderRadius: 20,
              padding: 16,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ color: C.textMid, fontSize: 12, fontWeight: 900 }}>What the platform does</div>
            {features.map((feature) => (
              <div key={feature.title} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surface }}>
                <div style={{ color: C.lavSoft, fontWeight: 900, fontSize: 13 }}>{feature.title}</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>{feature.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {roleCards.map((card) => (
            <div key={card.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 18 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18 }}>{card.title}</div>
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {card.items.map((item) => (
                  <div key={item} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 14, padding: 10, background: C.surfaceHi, color: C.textMid, fontSize: 12, fontWeight: 800 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


