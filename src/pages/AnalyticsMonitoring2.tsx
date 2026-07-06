import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { reportsMock } from "../mock-data/reports";
import { DataState } from "../components/DataState";

export default function AnalyticsMonitoring2() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 950);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>
              Analytics / Monitoring (قسم مستقل)
            </div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
              واجهة إضافية (Mock) لتوافق تصميم “قسم مستقل” لو احتجناه.
            </div>
          </div>
          <div style={{ width: 240, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>مؤشر عام</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>
              {reportsMock.tableRows.reduce((acc, r) => acc + r.avg, 0)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز ملخص…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>ملخص الحالة</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                  مثال لصفحة مستقلة تعرض مؤشرات جاهزة من Mock.
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                  {[
                    { k: "Total Records", v: reportsMock.tableRows.length },
                    { k: "Critical-ish", v: reportsMock.tableRows.filter((x) => x.critical).length },
                  ].map((x) => (
                    <div key={x.k} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ color: C.textLo, fontSize: 12 }}>{x.k}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 22, marginTop: 6 }}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>تفاصيل سريعة</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                  جدول صغير — بدون Chart libs.
                </div>

                <div style={{ marginTop: 12, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                    <thead>
                      <tr>
                        {["الموظف", "القسم", "متوسط", "حالة"].map((h) => (
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
                      {reportsMock.tableRows.map((r, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.employee}</td>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.dept}</td>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.avg}</td>
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
                      ))}
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

