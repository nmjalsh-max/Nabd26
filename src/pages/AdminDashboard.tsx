import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getAdminDashboardSnapshot } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatCard, GhostButton } from "../components/AdminUI";

export default function AdminDashboard() {
  const navigate = useNavigate();
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
        title="لوحة الأدمن"
        description="مؤشرات حقيقية من pulse_responses و points_ledger و critical_alerts"
        actions={<GhostButton onClick={() => void handleLogout()}>تسجيل الخروج</GhostButton>}
      />

      <DataState
        variant={sectionState}
        loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز لوحة الأدمن…</div>}
        title=""
        description=""
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="نظرة عامة">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              <StatCard label="نسبة المشاركة اليومية" value={`${snapshot?.participationRate ?? 0}%`} accent={C.lavender} />
              <StatCard label="إجمالي النقاط الموزعة" value={snapshot?.totalPointsDistributed ?? 0} accent={C.pink} />
            </div>
          </SectionCard>

          <SectionCard
            title="حالات تحتاج متابعة"
            description="عدد الحالات غير المُحللة في critical_alerts مع تمييز لطيف بدل نصوص مزعجة"
          >
            <StatCard label="الحالات الحالية" value={snapshot?.followUpCount ?? 0} accent={C.amber} />
          </SectionCard>

          <SectionCard title="مؤشرات الاتجاه">
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
