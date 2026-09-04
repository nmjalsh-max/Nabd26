import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getAdminDashboardSnapshot } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatCard, GhostButton } from "../components/AdminUI";
import { useLang } from "../i18n/LangContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const isEn = lang === "en";
  const [sectionState, setSectionState] = useState<"loading" | "empty" | "data">("loading");
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof getAdminDashboardSnapshot>> | null>(null);

  async function handleLogout() {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    localStorage.removeItem("mock_auth");
    navigate("/login");
  }

  useEffect(() => {
    const id = window.setTimeout(() => setSectionState("data"), 900);

    void (async () => {
      const nextSnapshot = await getAdminDashboardSnapshot();
      setSnapshot(nextSnapshot);
    })();

    return () => window.clearTimeout(id);
  }, []);

  return (
    <PageShell>
      <PageHeader
        title={isEn ? "Admin Dashboard" : "لوحة الأدمن"}
        description={
          isEn
            ? "Real indicators from pulse_responses, points_ledger, and critical_alerts"
            : "مؤشرات حقيقية من pulse_responses وpoints_ledger وcritical_alerts"
        }
        actions={<GhostButton onClick={() => void handleLogout()}>{isEn ? "Sign out" : "تسجيل الخروج"}</GhostButton>}
      />

      <DataState
        variant={sectionState}
        loading={<div style={{ color: C.textLo, fontSize: 12 }}>{isEn ? "Loading admin dashboard…" : "جارٍ تحميل لوحة الأدمن…"}</div>}
        title=""
        description=""
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title={isEn ? "Overview" : "نظرة عامة"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              <StatCard label={isEn ? "Daily participation rate" : "معدل المشاركة اليومي"} value={`${snapshot?.participationRate ?? 0}%`} accent={C.lavender} />
              <StatCard label={isEn ? "Total points distributed" : "إجمالي النقاط الموزّعة"} value={snapshot?.totalPointsDistributed ?? 0} accent={C.pink} />
            </div>
          </SectionCard>

          <SectionCard
            title={isEn ? "Needs follow-up" : "بحاجة لمتابعة"}
            description={
              isEn
                ? "Unresolved cases in critical_alerts with gentle labeling instead of alarming text"
                : "حالات غير محلولة في critical_alerts، بتوصيف لطيف بدل عبارات تنبيه مقلقة"
            }
          >
            <StatCard label={isEn ? "Current cases" : "الحالات الحالية"} value={snapshot?.followUpCount ?? 0} accent={C.amber} />
          </SectionCard>

          <SectionCard
            title={isEn ? "Wellbeing × Absence correlation" : "العلاقة بين الرفاهية والغياب"}
            description={
              isEn
                ? "Linking wellbeing to attendance — employees with lower morale may show higher absence."
                : "ربط الرفاهية النفسية بالحضور — الموظفون ذوو المعنويات المنخفضة قد يكونون أكثر غيابًا."
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              <StatCard label={isEn ? "Employee absence rate (30d)" : "معدل غياب الموظفين (30 يوم)"} value={`${snapshot?.hrAbsenceRate ?? 0}%`} accent={C.cyan} />
              <StatCard label={isEn ? "Wellbeing engagement" : "التفاعل مع الرفاهية"} value={`${snapshot?.hrEngagement ?? 0}%`} accent={C.lavender} />
              <StatCard label={isEn ? "High-risk + absent" : "خطورة عالية + غياب"} value={snapshot?.hrRiskAbsent ?? 0} accent={C.red} />
            </div>
            <div style={{ marginTop: 12, color: C.textLo, fontSize: 13, lineHeight: 1.7 }}>
              {isEn
                ? "This section merges HR data (absence/leaves) with wellbeing indicators (daily mood) to give management a unified view."
                : "يدمج هذا القسم بيانات الموارد البشرية (الغياب/الإجازات) مع مؤشرات الرفاهية (المزاج اليومي) لتقديم رؤية موحّدة للإدارة."}
            </div>
          </SectionCard>

          <SectionCard
            title={isEn ? "4-Day Work Week Pilot" : "تجربة أسبوع العمل 4 أيام"}
            description={
              isEn
                ? "A 4-day work week trial — comparing performance and wellbeing before and after."
                : "تجربة أسبوع العمل 4 أيام — مقارنة بين الأداء والرفاهية قبل وبعد التجربة."
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
              <StatCard label={isEn ? "Focus (5-day)" : "التركيز (5 أيام)"} value="68%" accent={C.textMid} />
              <StatCard label={isEn ? "Focus (4-day)" : "التركيز (4 أيام)"} value="82%" accent={C.lavender} />
              <StatCard label={isEn ? "Wellbeing Δ" : "التغيّر في الرفاهية"} value="+14%" accent={C.green} />
              <StatCard label={isEn ? "Absence Δ" : "التغيّر في الغياب"} value="-9%" accent={C.cyan} />
            </div>
            <div style={{ marginTop: 12, color: C.textLo, fontSize: 13, lineHeight: 1.7 }}>
              {isEn
                ? "A prototype showing pilot trends. Once Supabase is connected, real figures can be computed from \"pulse_responses\", \"session_attendance\", and \"leaveRequests\"."
                : "نموذج أولي يعرض اتجاهات التجربة. عند ربط Supabase يمكن حساب الأرقام الفعلية من «pulse_responses» و«session_attendance» و«leaveRequests»."}
            </div>
          </SectionCard>

          <SectionCard title={isEn ? "Trend notes" : "ملاحظات الاتجاه"}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(snapshot?.trendNotes ?? []).map((note, index) => (
                <div
                  key={index}
                  style={{
                    border: `0.5px solid ${C.borderLo}`,
                    borderRadius: 14,
                    padding: 12,
                    background: C.surfaceHi,
                    color: C.textMid,
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {note}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </DataState>
    </PageShell>
  );
}
