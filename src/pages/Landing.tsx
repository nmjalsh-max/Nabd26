import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartLoader } from "../components/HeartLoader";
import { C } from "../theme/tokens";
import LangToggle from "../components/LangToggle";
import { useLang } from "../i18n/LangContext";
import { t } from "../i18n/i18n";


export default function Landing() {
  const { lang } = useLang();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setShowLoader(false), 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>

      <div style={{ width: "100%", maxWidth: 980, display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 26, marginBottom: 6 }}>{t(lang, "brand")}</div>
            <div style={{ color: C.textMid, fontSize: 13, lineHeight: 1.7 }}>{t(lang, "tagline")}</div>
          </div>
          <div style={{ marginTop: 2 }}>
            <LangToggle />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18 }}>{t(lang, "landingTitle")}</div>
              <div style={{ color: C.textLo, fontSize: 13, lineHeight: 1.75 }}>{t(lang, "landingBody")}</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      width: "100%",
                      background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                      border: "none",
                      borderRadius: 14,
                      padding: "12px 14px",
                      fontWeight: 800,
                      color: "#0B0B14",
                      cursor: "pointer",
                    }}
                  >
                    {t(lang, "ctaLogin")} →
                  </button>
                </Link>

                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: `1px solid ${C.borderLo ?? C.border}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                      fontWeight: 900,
                      color: C.lavSoft,
                      cursor: "pointer",
                    }}
                  >
                    {lang === "en" ? "Sign up" : "إنشاء حساب"} →
                  </button>
                </Link>

              </div>

              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                {lang === "en" ? "No real backend yet — UI only with Mock data." : "لا توجد بيانات حقيقية في هذه المرحلة — واجهات فقط مع Mock بيانات."}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", placeItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
            <div style={{ width: "100%", maxWidth: 380 }}>
              <div style={{ color: C.textMid, fontSize: 12, marginBottom: 10, textAlign: "center" }}>
                {lang === "en" ? "Loading preview (Heart Loader)" : "عرض التحميل (Heart Loader)"}
              </div>
              {/*
                HeartLoader عند عدم تمرير progress يقوم بعمل animation وبقى ظاهر.
                إذا كنت تواجه أنه يغطي الصفحة، يمكن إيقافه مؤقتًا.
              */}
              {showLoader && (
                <HeartLoader label={lang === "en" ? "Nabd heart…" : "قلب نبض…"} />
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


