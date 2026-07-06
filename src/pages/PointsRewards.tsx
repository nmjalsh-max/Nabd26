import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { pointsMock } from "../mock-data/points";
import { DataState } from "../components/DataState";

export default function PointsRewards() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 650);
    return () => window.clearTimeout(id);
  }, []);

  const progressPct = Math.round((pointsMock.current / pointsMock.nextThreshold) * 100);
  const safePct = Math.max(0, Math.min(100, progressPct));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>النقاط & المكافآت</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>تقدم نحو عتبة + Badges (Mock)</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>العتبة التالية</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>
              {pointsMock.nextThreshold}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ حساب النقاط…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>شريط التقدم</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                  {pointsMock.thresholdLabel} — {safePct}%
                </div>

                <div style={{ marginTop: 12, height: 14, borderRadius: 999, border: `1px solid ${C.borderLo}`, background: C.surfaceHi, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${safePct}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>حاليًا</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>{pointsMock.current}</div>
                  </div>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>المتبقي</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>
                      {Math.max(0, pointsMock.nextThreshold - pointsMock.current)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Ledger</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>سجل التغيرات في النقاط</div>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {pointsMock.ledger.map((x) => {
                    const plus = x.delta >= 0;
                    return (
                      <div key={x.id} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div>
                          <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{x.type}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{x.at}</div>
                        </div>
                        <div
                          style={{
                            border: `1px solid ${plus ? C.green + "66" : C.red + "66"}`,
                            background: plus ? `${C.green}22` : `${C.red}22`,
                            color: plus ? C.green : C.red,
                            fontWeight: 900,
                            borderRadius: 999,
                            padding: "7px 10px",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {plus ? "+" : ""}{x.delta}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Badges</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>مكافآت عند الوصول لعتبات</div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {pointsMock.badges.map((b) => {
                    const achieved = b.at <= pointsMock.current;
                    return (
                      <div key={b.id} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div>
                          <div style={{ color: achieved ? C.lavSoft : C.textMid, fontWeight: 900, fontSize: 13 }}>{b.name}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>عند {b.at} نقطة</div>
                        </div>
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: achieved ? `linear-gradient(180deg, ${C.lavender}, ${C.pink})` : C.borderLo,
                            border: `1px solid ${achieved ? C.lavender : C.borderLo}`,
                          }}
                        />
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

