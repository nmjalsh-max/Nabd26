import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { buildReportCsv, buildReportPdf, getReportsSnapshot, type ReportPeriod, type ReportRow } from "../lib/dashboardData";

function statusBadgeStyle(status: ReportRow["status"]) {
  if (status === "stable") {
    return { border: `1px solid ${C.green}66`, background: `${C.green}22`, color: C.green };
  }
  if (status === "watch") {
    return { border: `1px solid ${C.amber}66`, background: `${C.amber}22`, color: C.amber };
  }
  return { border: `1px solid ${C.red}66`, background: `${C.red}22`, color: C.red };
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

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>التقارير</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>تقرير فعلي مجمّع حسب القسم مع تصدير PDF/CSV</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setPeriod(range)}
                style={{
                  border: `1px solid ${period === range ? C.lavSoft : C.borderLo}`,
                  background: period === range ? `${C.lavender}22` : "transparent",
                  borderRadius: 999,
                  padding: "8px 12px",
                  color: period === range ? C.lavSoft : C.textLo,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {range === "weekly" ? "أسبوعي" : range === "monthly" ? "شهري" : "سنوي"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ توليد التقرير…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>ملخص</div>
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
                  <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                    <div style={{ color: C.textLo, fontSize: 12 }}>الموظفون</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 22, marginTop: 6 }}>{summary.totalEmployees}</div>
                  </div>
                  <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                    <div style={{ color: C.textLo, fontSize: 12 }}>متوسط المزاج</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 22, marginTop: 6 }}>{summary.avgMood.toFixed(1)}</div>
                  </div>
                  <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                    <div style={{ color: C.textLo, fontSize: 12 }}>بحاجة متابعة</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 22, marginTop: 6 }}>{summary.criticalCount}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => void handleDownload("csv")} style={{ border: `1px solid ${C.borderLo}`, background: "transparent", borderRadius: 999, padding: "8px 12px", color: C.lavSoft, fontWeight: 900, cursor: "pointer" }}>تصدير CSV</button>
                  <button type="button" onClick={() => void handleDownload("pdf")} style={{ border: `1px solid ${C.borderLo}`, background: "transparent", borderRadius: 999, padding: "8px 12px", color: C.lavSoft, fontWeight: 900, cursor: "pointer" }}>تصدير PDF</button>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>جدول النتائج</div>
                <div style={{ marginTop: 12, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                    <thead>
                      <tr>
                        {['القسم', 'متوسط', 'الحالة', 'المشاركون'].map((h) => (
                          <th key={h} style={{ textAlign: "right", padding: "10px 8px", fontSize: 12, color: C.textMid, borderBottom: `1px solid ${C.borderLo}`, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr key={`${row.department}-${index}`}>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.department}</td>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.average.toFixed(1)}</td>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, fontSize: 12 }}>
                            <span style={{ ...statusBadgeStyle(row.status), fontWeight: 900, padding: "7px 10px", borderRadius: 999 }}>{row.status}</span>
                          </td>
                          <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{row.participants}</td>
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

