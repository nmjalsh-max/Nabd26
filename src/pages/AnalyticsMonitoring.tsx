import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { getAnalyticsSnapshot, type AnalyticsSnapshot } from "../lib/dashboardData";

const PIE_COLORS = [C.lavender, C.pink, C.cyan, C.green];

export default function AnalyticsMonitoring() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getAnalyticsSnapshot();
      setSnapshot(data);
      setVariant("data");
    })();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>التحليل & الرصد</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>رسوم حقيقية + تصنيف تلقائي من آخر 5 إجابات</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز الرسومات…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>اتجاه المعنويات</div>
                <div style={{ width: "100%", height: 280, marginTop: 12 }}>
                  <ResponsiveContainer>
                    <LineChart data={snapshot?.trend ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A50" />
                      <XAxis dataKey="label" stroke="#A8A4C8" />
                      <YAxis stroke="#A8A4C8" domain={[1, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>مقارنة الأقسام</div>
                <div style={{ width: "100%", height: 320, marginTop: 12 }}>
                  <ResponsiveContainer>
                    <BarChart data={snapshot?.departmentComparison ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2A2A50" />
                      <XAxis dataKey="department" stroke="#A8A4C8" />
                      <YAxis stroke="#A8A4C8" domain={[1, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#A78BFA" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>التصنيف التلقائي</div>
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                  {snapshot?.classifications.map((item) => (
                    <div key={`${item.user}-${item.department}`} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ color: C.textMid, fontSize: 12, fontWeight: 900 }}>{item.user}</div>
                      <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{item.department}</div>
                      <div style={{ marginTop: 10, borderRadius: 999, padding: "7px 10px", display: "inline-flex", fontWeight: 900, fontSize: 12, border: `1px solid ${item.status === "stable" ? C.green + "66" : item.status === "watch" ? C.amber + "66" : C.red + "66"}`, background: item.status === "stable" ? `${C.green}22` : item.status === "watch" ? `${C.amber}22` : `${C.red}22`, color: item.status === "stable" ? C.green : item.status === "watch" ? C.amber : C.red }}>{item.status}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 18, marginTop: 6 }}>{item.average.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>حالة الأقسام</div>
                <div style={{ width: "100%", height: 260, marginTop: 12 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={snapshot?.departmentComparison ?? []} dataKey="score" nameKey="department" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} label>
                        {(snapshot?.departmentComparison ?? []).map((_, index) => (
                          <Cell key={`${_.department}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

