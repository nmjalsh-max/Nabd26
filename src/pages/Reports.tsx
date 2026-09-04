import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { buildReportCsv, buildReportPdf, getReportsSnapshot, type ReportPeriod, type ReportRow } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatCard, StatusPill, GhostButton } from "../components/AdminUI";
import { useLang } from "../i18n/LangContext";

function statusTone(status: ReportRow["status"]): "green" | "amber" | "red" {
  if (status === "stable") return "green";
  if (status === "watch") return "amber";
  return "red";
}

export default function Reports() {
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const isEn = lang === "en";
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

  const periods: { key: ReportPeriod; en: string; ar: string }[] = [
    { key: "weekly", en: "Weekly", ar: "أسبوعي" },
    { key: "monthly", en: "Monthly", ar: "شهري" },
    { key: "yearly", en: "Yearly", ar: "سنوي" },
  ];

  const tableHeaders = isEn
    ? ["Department", "Average", "Status", "Participants"]
    : ["القسم", "متوسط", "الحالة", "المشاركون"];

  return (
    <PageShell>
      <PageHeader
        title={isEn ? "Reports" : "التقارير"}
        description={isEn ? "A live report aggregated by department, with PDF/CSV export" : "تقرير فعلي مجمّع حسب القسم مع تصدير PDF/CSV"}
        actions={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {periods.map((p) => (
              <GhostButton key={p.key} active={period === p.key} onClick={() => setPeriod(p.key)}>
                {isEn ? p.en : p.ar}
              </GhostButton>
            ))}
          </div>
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>{isEn ? "Generating report…" : "جارٍ توليد التقرير…"}</div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title={isEn ? "Summary" : "ملخص"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              <StatCard label={isEn ? "Employees" : "الموظفون"} value={summary.totalEmployees} accent={C.lavender} />
              <StatCard label={isEn ? "Average mood" : "متوسط المزاج"} value={summary.avgMood.toFixed(1)} accent={C.pink} />
              <StatCard label={isEn ? "Needs follow-up" : "بحاجة متابعة"} value={summary.criticalCount} accent={C.amber} />
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <GhostButton onClick={() => void handleDownload("csv")}>{isEn ? "Export CSV" : "تصدير CSV"}</GhostButton>
              <GhostButton onClick={() => void handleDownload("pdf")}>{isEn ? "Export PDF" : "تصدير PDF"}</GhostButton>
            </div>
          </SectionCard>

          <SectionCard title={isEn ? "Results table" : "جدول النتائج"}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }} dir={isEn ? "ltr" : "rtl"}>
                <thead>
                  <tr>
                    {tableHeaders.map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: isEn ? "left" : "right",
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

