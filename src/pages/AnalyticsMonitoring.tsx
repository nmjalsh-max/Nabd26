import { useEffect, useMemo, useState } from "react";
import { C } from "../theme/tokens";
import { engagementByDept, programParticipation } from "../mock-data/analytics";
import { DataState } from "../components/DataState";

function Bar({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "center" }}>
      <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </div>
      <div style={{ height: 12, borderRadius: 999, background: C.surfaceHi, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
          }}
        />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 12, color: C.textLo, textAlign: "left" }}>
        {value}
      </div>
    </div>
  );
}

export default function AnalyticsMonitoring() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 850);
    return () => window.clearTimeout(id);
  }, []);

  const deptBars = useMemo(() => {
    return engagementByDept.map((d) => ({ name: d.name, wellbeing: d.wellbeing, engagement: d.engagement }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>التحليل & الرصد</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Engagement/Wellbeing + Participation (Mock)</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>تحديث</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>
              الآن
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز الرسومات…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>حسب القسم</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>مؤشرات مبسطة بدون Recharts</div>

                <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                  {deptBars.map((d) => (
                    <div key={d.name} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ display: "grid", gap: 10 }}>
                        <Bar value={d.engagement} label={`${d.name} - Engagement`} />
                        <Bar value={d.wellbeing} label={`${d.name} - Wellbeing`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>مشاركة البرامج</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>توزيع مبسط</div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {programParticipation.map((p) => {
                    const pct = Math.round((p.value / 400) * 100);
                    return (
                      <div key={p.name} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div>
                            <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{p.name}</div>
                            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{p.value} مشاركة</div>
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 12 }}>{pct}%</div>
                        </div>
                        <div style={{ marginTop: 10, height: 12, borderRadius: 999, background: C.surfaceHi, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                        </div>
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

