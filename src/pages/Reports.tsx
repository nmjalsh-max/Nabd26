import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { buildReportCsv, buildReportPdf, getReportsSnapshot, type ReportPeriod, type ReportRow } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatCard, StatusPill, GhostButton } from "../components/AdminUI";

function statusTone(status: ReportRow["status"]): "green" | "amber" | "red" {
  if (status === "stable") return "green";
  if (status === "watch") return "amber";
  return "red";
}

export default function Reports() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [period, setPeriod] = useState<ReportPeriod>("weekly");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [summary, setSummary] = useState<{ totalEmployees: number; avgMood: number; criticalCount: number }>({
    totalEmployees: 0,
    avgMood: 0,
    criticalCount: 0,
  });

  async function loadSnapshot(nextPeriod: ReportPeriod) {
    setVariant("loading");
    const snapshot = await getReportsSnapshot(nextPeriod);
    setRows(snapshot.rows);
    setSummary(snapshot.summary);
    setVariant("data");
  }

  useEffect(() => {
    void loadSnapshot(period);
  }, [period]);

  async function handleDownload(format: "csv" | "pdf") {
    const snapshot = await getReportsSnapshot(period);
    const content = format === "csv" ? buildReportCsv(snapshot.rows) : buildReportPdf(snapshot.rows, period);
    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv;charset=utf-8" : "application/pdf;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nabd-report-${period}.${format}`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const periods: { key: ReportPeriod; label: string }[] = [
    { key: "weekly", label: "أسبوعي" },
    { key: "monthly", label: "شهري" },
    { key: "yearly", label: "سنوي" },
  ];

  return (
    <PageShell>
      <PageHeader
        title="التقارير"
        description="تقرير فعلي مجمّع حسب القسم مع تصدير PDF/CSV"
        actions={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {periods.map((p) => (
              <GhostButton key={p.key} active={period === p.key} onClick={() => setPeriod(p.key)}>
                {p.label}
              </GhostButton>
            ))}
          </div>
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ توليد التقرير…</div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="ملخص">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              <StatCard label="الموظفون" value={summary.totalEmployees} accent={C.lavender} />
              <StatCard label="متوسط المزاج" value={summary.avgMood.toFixed(1)} accent={C.pink} />
              <StatCard label="بحاجة متابعة" value={summary.criticalCount} accent={C.amber} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GhostButton onClick={() => void handleDownload("csv")}>تصدير CSV</GhostButton>
              <GhostButton onClick={() => void handleDownload("pdf")}>تصدير PDF</GhostButton>
            </div>
          </SectionCard>

          <SectionCard title="جدول النتائج">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr>
                    {["القسم", "متوسط", "الحالة", "المشاركون"].map((h) => (
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
                  {rows.map((row, index) => (
                    <tr key={`${row.department}-${index}`}>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.department}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.average.toFixed(1)}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, fontSize: 12 }}>
                        <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
                      </td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.participants}</td>
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
