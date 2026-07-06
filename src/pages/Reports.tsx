import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { reportsMock } from "../mock-data/reports";
import { DataState } from "../components/DataState";

export default function Reports() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 800);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>التقارير</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Trend + جدول (Mock)</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>آخر تحديث</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>قبل 3 أيام</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState
            variant={variant}
            loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ توليد التقرير…</div>}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Trend</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>رسم بياني بسيط بدون مكتبات خارجية</div>

                <div style={{ marginTop: 12, border: `1px solid ${C.borderLo}`, background: C.surfaceHi, borderRadius: 16, padding: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 8, alignItems: "end" }}>
                    {reportsMock.charts.trend.map((p) => {
                      const max = 100;
                      const h = Math.round((p.score / max) * 160);
                      return (
                        <div key={p.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                          <div
                            style={{
                              width: 14,
                              height: h,
                              borderRadius: 999,
                              background: `linear-gradient(180deg, ${C.lavender}, ${C.pink})`,
                              boxShadow: `0 0 12px ${C.lavender}33`,
                            }}
                            title={`${p.month}: ${p.score}`}
                          />
                          <div style={{ color: C.textLo, fontSize: 11, fontWeight: 900 }}>{p.month}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ color: C.textMid, fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
                    ملاحظة: هذا مجرد Mock-render. عند إدخال backend/Charts يمكن استبداله بسهولة.
                  </div>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>جدول النتائج</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>يشير (critical) إلى حالة تحتاج متابعة</div>

                <div style={{ marginTop: 12, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr>
                        {[
                          "الموظف",
                          "القسم",
                          "متوسط",
                          "حالة",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: "right",
                              padding: "10px 8px",
                              fontSize: 12,
                              color: C.textMid,
                              borderBottom: `1px solid ${C.borderLo}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportsMock.tableRows.map((r, i) => {
                        return (
                          <tr key={i}>
                            <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                              {r.employee}
                            </td>
                            <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                              {r.dept}
                            </td>
                            <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                              {r.avg}
                            </td>
                            <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, fontSize: 12 }}>
                              <span
                                style={{
                                  border: `1px solid ${r.critical ? C.red + "66" : C.amber + "66"}`,
                                  background: r.critical ? `${C.red}22` : `${C.amber}22`,
                                  color: r.critical ? C.red : C.amber,
                                  fontWeight: 900,
                                  padding: "7px 10px",
                                  borderRadius: 999,
                                }}
                              >
                                {r.critical ? "Critical" : "OK"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

