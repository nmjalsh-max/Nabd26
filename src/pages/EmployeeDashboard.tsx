import { useEffect, useMemo, useState } from "react";
import { C, STATUS_STYLE, type StatusKey } from "../theme/tokens";
import { teams } from "../mock-data/employee";
import { notificationsMock } from "../mock-data";
import { DataState } from "../components/DataState";
import { sessionsMock } from "../mock-data/sessions";


// UI-only MVP: sections show loading/data/empty variants.
export default function EmployeeDashboard() {


  const [tab] = useState<"mood" | "points" | "sessions">("mood");

  const team = useMemo(() => {
    return teams[0] as any;
  }, []);


  // UI states (Mock) to test loading/empty/data without backend.
  const [sectionState, setSectionState] = useState<"loading" | "empty" | "data">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setSectionState("data"), 900);
    return () => window.clearTimeout(id);
  }, []);

  return (

    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>لوحة الموظف</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
              مرحبًا! هذه واجهة UI فقط — جميع البيانات من Mock.
            </div>
          </div>
          <div style={{ width: 120, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 10, color: C.textMid, fontSize: 12, textAlign: "center" }}>
            تبويب: {tab === "mood" ? "المعنويات" : tab === "points" ? "النقاط" : "الجلسات"}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {/* Morale */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>حالة المعنويات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>اليومي/الأسبوعي (رسم بياني لاحقًا — Recharts في الخطوة التالية)</div>
            <div style={{ marginTop: 12 }}>
              <DataState
                variant={sectionState}
                loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز البيانات…</div>}
                title=""
                description=""
              >
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>آخر درجة</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 34 }}>{team.wellbeing}</div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 2 }}>من 100</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    {(() => {
                      const s = STATUS_STYLE[team.status];
                      return (
                        <div style={{ background: s.bg, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                          <div style={{ color: s.text, fontWeight: 900, fontSize: 12 }}>حالة داعمة</div>
                          <div style={{ color: C.textMid, fontSize: 12, marginTop: 6 }}>{s.label} (مخفي افتراضيًا)</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </DataState>
            </div>
          </div>

          {/* Points */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>رصيد النقاط</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>شريط لطيف + تاريخ الاكتساب (Mock)</div>
            <div style={{ marginTop: 12 }}>
              <DataState variant="data" loading={null}>
                <div style={{ height: 10, background: C.surfaceHi, borderRadius: 999, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "84%", background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>حاليًا</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>420</div>
                  </div>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>القادم</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>500</div>
                  </div>
                </div>
              </DataState>
            </div>
          </div>

          {/* Next sessions */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>مواعيد قريبة (أقرب 2-3)</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>يوغا/تنفس — قريبًا زر الحجز (محلي)</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {sessionsMock.nextSessions.slice(0, 3).map((s) => (
                <div key={s.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>{s.title}</div>
                    <button type="button" style={{ border: `1px solid ${C.border}`, background: "transparent", borderRadius: 999, padding: "7px 10px", color: C.lavSoft, fontWeight: 900, fontSize: 12 }}>
                      حجز
                    </button>
                  </div>
                  <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                    {s.time} — {s.mode} — {s.coach}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>آخر الإشعارات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>UI فقط</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {notificationsMock.slice(0, 3).map((n) => (
                <div key={n.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi, display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{n.type}</div>
                    <div style={{ color: C.textHi, fontWeight: 900, fontSize: 13, marginTop: 4 }}>{n.title}</div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{n.time}</div>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: n.unread ? C.lavender : C.borderLo, alignSelf: "flex-start", marginTop: 4 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

