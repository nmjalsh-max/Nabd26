import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { getAnalyticsSnapshot, type AnalyticsSnapshot } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatusPill } from "../components/AdminUI";

function statusTone(status: string): "green" | "amber" | "red" {
  if (status === "stable") return "green";
  if (status === "watch") return "amber";
  return "red";
}

export default function AnalyticsMonitoring() {
  const { theme: C } = useTheme();
  const PIE_COLORS = [C.lavender, C.pink, C.cyan, C.green];
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
    <PageShell>
      <PageHeader title="التحليل والرصد" description="رسوم حقيقية وتصنيف تلقائي من آخر 5 إجابات" />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز الرسومات…</div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="اتجاه المعنويات">
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={snapshot?.trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="label" stroke={C.textMid} />
                  <YAxis stroke={C.textMid} domain={[1, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke={C.lavender} strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="مقارنة الأقسام">
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={snapshot?.departmentComparison ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="department" stroke={C.textMid} />
                  <YAxis stroke={C.textMid} domain={[1, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill={C.lavender} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="التصنيف التلقائي">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              {snapshot?.classifications.map((item) => (
                <div
                  key={`${item.user}-${item.department}`}
                  style={{ background: C.surfaceHi, border: `0.5px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}
                >
                  <div style={{ color: C.textHi, fontSize: 13, fontWeight: 700 }}>{item.user}</div>
                  <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{item.department}</div>
                  <div style={{ marginTop: 10 }}>
                    <StatusPill tone={statusTone(item.status)}>{item.status}</StatusPill>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 20, marginTop: 10, color: C.textHi }}>
                    {item.average.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="حالة الأقسام">
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={snapshot?.departmentComparison ?? []}
                    dataKey="score"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    label
                  >
                    {(snapshot?.departmentComparison ?? []).map((_, index) => (
                      <Cell key={`${_.department}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>
      </DataState>
    </PageShell>
  );
}
