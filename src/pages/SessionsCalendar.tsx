import { useEffect, useMemo, useState } from "react";
import { C } from "../theme/tokens";
import { sessionsMock } from "../mock-data/sessions";
import { DataState } from "../components/DataState";

export default function SessionsCalendar() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const dayCount = useMemo(() => sessionsMock.calendarWeeks.length, []);

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>تقويم الجلسات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>أسبوع واحد — بدون حجز حقيقي</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>الأيام</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>{dayCount}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تحميل التقويم…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>الأسبوع</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>كل يوم يحتوي عناصر أو يكون فارغًا</div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {sessionsMock.calendarWeeks.map((d) => {
                    const count = d.items.length;
                    return (
                      <div key={d.day} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div>
                            <div style={{ color: C.textMid, fontWeight: 900, fontSize: 13 }}>{d.day}</div>
                            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>
                              {count === 0 ? "لا توجد جلسات" : `${count} جلسة/جلسات`}
                            </div>
                          </div>
                          <div
                            style={{
                              border: `1px solid ${C.borderLo}`,
                              background: count > 0 ? `linear-gradient(135deg, ${C.lavender}22, ${C.pink}18)` : C.surface,
                              borderRadius: 999,
                              padding: "7px 10px",
                              color: count > 0 ? C.lavSoft : C.textLo,
                              fontWeight: 900,
                              fontSize: 12,
                            }}
                          >
                            {count}
                          </div>
                        </div>

                        {count > 0 && (
                          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                            {d.items.map((id) => {
                              const s = sessionsMock.nextSessions.find((x) => x.id === id);
                              if (!s) return null;
                              return (
                                <div key={id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 14, padding: 10, background: C.surface }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                                    <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>{s.title}</div>
                                    <button
                                      type="button"
                                      style={{
                                        border: `1px solid ${C.borderLo}`,
                                        background: "transparent",
                                        borderRadius: 999,
                                        padding: "7px 10px",
                                        color: C.lavSoft,
                                        fontWeight: 900,
                                        fontSize: 12,
                                      }}
                                    >
                                      حجز
                                    </button>
                                  </div>
                                  <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                                    {s.time} — {s.mode} — {s.coach}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

