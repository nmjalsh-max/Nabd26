import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { reportsMock } from "../mock-data/reports";
import { DataState } from "../components/DataState";
import { PageHeader, PageShell, SectionCard, StatCard, StatusPill } from "../components/AdminUI";

export default function AnalyticsMonitoring2() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 950);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <PageShell>
      <PageHeader
        title="التحليل والرصد — قسم مستقل"
        description="واجهة إضافية (Mock) لتوافق تصميم قسم مستقل لو احتجناه"
        actions={
          <StatCard
            label="مؤشر عام"
            value={reportsMock.tableRows.reduce((acc, r) => acc + r.avg, 0)}
            accent={C.lavender}
          />
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز ملخص…</div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="ملخص الحالة" description="مثال لصفحة مستقلة تعرض مؤشرات جاهزة من Mock">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              <StatCard label="Total records" value={reportsMock.tableRows.length} accent={C.lavender} />
              <StatCard label="Critical-ish" value={reportsMock.tableRows.filter((x) => x.critical).length} accent={C.red} />
            </div>
          </SectionCard>

          <SectionCard title="تفاصيل سريعة" description="جدول صغير — بدون مكتبات رسوم بيانية">
            <div style={{ overflowX: "auto" }}>
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
                          borderBottom: `0.5px solid ${C.borderLo}`,
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
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.employee}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.dept}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.avg}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, fontSize: 12 }}>
                        <StatusPill tone={r.critical ? "red" : "amber"}>{r.critical ? "Critical" : "OK"}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </DataState>
    </PageShell>
  );
}
