import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { PageHeader, PageShell, SectionCard, StatCard, StatusPill, GhostButton } from "../components/AdminUI";
import { employeesHR, wellbeingAbsenceInsights } from "../mock-data/hr";
import { detectRecoveries } from "../lib/dashboardData";

type Tone = "green" | "amber" | "red" | "lavender" | "gray";

function toneForStatus(status: string): Tone {
  if (status === "stable") return "green";
  if (status === "watch") return "amber";
  return "red";
}

// Omoiyari nudges — managers see a gentle reminder of employees who
// recently dropped to watch/critical and may need a caring touch.
type Nudge = {
  id: string;
  employee: string;
  reason: string;
};

const initialNudges: Nudge[] = employeesHR
  .filter((e) => e.status === "watch" || e.status === "critical")
  .map((e) => ({
    id: `nudge-${e.id}`,
    employee: e.name,
    reason:
      e.status === "critical"
        ? "معنويات منخفضة لثالث يوم متتالي — يحتاج تواصل داعم"
        : "معنويات متوسطة مع بداية ارتفاع غياب — يفضّل متابعة أسبوعية",
  }));

export default function HRDashboard() {
  const { theme: C } = useTheme();
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [nudges, setNudges] = useState<Nudge[]>(initialNudges);

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 700);
    return () => window.clearTimeout(id);
  }, []);

  const criticalCount = employeesHR.filter((e) => e.status === "critical").length;
  const watchCount = employeesHR.filter((e) => e.status === "watch").length;
  const avgAbsence = Math.round((employeesHR.reduce((s, e) => s + e.absenceDays, 0) / employeesHR.length) * 10) / 10;

  // Kintsugi recovery medals (feature 2)
  const recoveries = useMemo(() => detectRecoveries(employeesHR), []);

  return (
    <PageShell>
      <PageHeader
        title="لوحة الموارد البشرية"
        description="ربط بيانات الرفاهية النفسية ببيانات الموارد البشرية (الغياب، الإجازات، الأداء)"
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز لوحة HR…</div>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="مؤشرات HR الموحّدة">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
              <StatCard label="إجمالي الموظفين" value={employeesHR.length} accent={C.lavender} />
              <StatCard label="حالة حرجة" value={criticalCount} accent={C.red} />
              <StatCard label="بحاجة متابعة" value={watchCount} accent={C.amber} />
              <StatCard label="متوسط الغياب (أيام)" value={avgAbsence} accent={C.cyan} />
            </div>
          </SectionCard>

          <SectionCard title="دليل الموظفين مع درجة الرفاهية" description="كل موظف مع حالته النفسية وأيام غيابه">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr>
                    {["الموظف", "القسم", "المسمى", "المزاج", "الغياب", "الحالة"].map((h) => (
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
                  {employeesHR.map((e) => (
                    <tr key={e.id}>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.name}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.department}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textLo, fontSize: 13 }}>{e.role}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.avgMood.toFixed(1)}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.absenceDays}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, fontSize: 12 }}>
                        <StatusPill tone={toneForStatus(e.status)}>{e.status}</StatusPill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Omoiyari nudges (feature 4) — gentle reminders for managers */}
          <SectionCard title="يحتاجون تواصل هذا الأسبوع" description="تذكير لطيف بموظفين دخلوا حالة مراقبة أو حرجة — تواصل داعم يصنع فرقًا">
            {nudges.length === 0 ? (
              <div style={{ color: C.green, fontSize: 13, padding: "8px 0" }}>
                ✅ لا توجد حالات بحاجة تواصل هذا الأسبوع — أحسنت!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {nudges.map((nudge) => (
                  <div
                    key={nudge.id}
                    style={{
                      border: `0.5px solid ${C.borderLo}`,
                      borderRadius: 14,
                      padding: 14,
                      background: C.surfaceHi,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontWeight: 700, color: C.textHi, fontSize: 13 }}>{nudge.employee}</div>
                      <div style={{ color: C.textMid, fontSize: 12, lineHeight: 1.6 }}>{nudge.reason}</div>
                    </div>
                    <GhostButton onClick={() => setNudges((prev) => prev.filter((n) => n.id !== nudge.id))}>
                      تم التواصل ✓
                    </GhostButton>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Kintsugi recovery celebrations (feature 2) */}
          {recoveries.length > 0 && (
            <SectionCard
              title="رحلات تعافٍ 🏆"
              description="موظفون انتقلوا من حالة مراقبة/حرجة إلى الاستقرار — احتفاء بتحسّنهم"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recoveries.map((recovery) => (
                  <div
                    key={recovery.employee.id}
                    style={{
                      border: `1px solid ${C.lavender}55`,
                      borderRadius: 16,
                      padding: 14,
                      background: `linear-gradient(120deg, ${C.lavender}1f, ${C.pink}18)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ fontWeight: 800, color: C.textHi, fontSize: 14 }}>
                        ⭐ {recovery.employee.name}
                      </div>
                      <div style={{ color: C.textMid, fontSize: 12, lineHeight: 1.6 }}>
                        تحسّن من «{recovery.fromStatus}» إلى «stable»
                        {recovery.recoveredAt ? ` — ${recovery.recoveredAt}` : ""}
                      </div>
                    </div>
                    <StatusPill tone="lavender">أحسنت! 🎉</StatusPill>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="ربط الرفاهية بالغياب — تحليلات ذكية" description="موظفون لديهم ارتباط عالٍ بين انخفاض المعنويات وكثرة الغياب">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {wellbeingAbsenceInsights.map((item) => (
                <div
                  key={item.employee}
                  style={{
                    border: `0.5px solid ${C.borderLo}`,
                    borderRadius: 14,
                    padding: 14,
                    background: C.surfaceHi,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, color: C.textHi, fontSize: 13 }}>{item.employee}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <StatusPill tone="gray">مزاج {item.avgMood.toFixed(1)}</StatusPill>
                      <StatusPill tone="amber">غياب {item.absenceDays} يوم</StatusPill>
                    </div>
                  </div>
                  <div style={{ color: C.textMid, fontSize: 13, marginTop: 8, lineHeight: 1.7 }}>{item.insight}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </DataState>
    </PageShell>
  );
}

