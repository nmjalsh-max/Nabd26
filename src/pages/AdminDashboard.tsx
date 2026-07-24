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
        title="Admin Dashboard"
        description="Real indicators from pulse_responses, points_ledger, and critical_alerts"
        actions={<GhostButton onClick={() => void handleLogout()}>Sign out</GhostButton>}
      />

      <DataState
        variant={sectionState}
        loading={<div style={{ color: C.textLo, fontSize: 12 }}>Loading admin dashboard…</div>}
        title=""
        description=""
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SectionCard title="Overview">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              <StatCard label="Daily participation rate" value={`${snapshot?.participationRate ?? 0}%`} accent={C.lavender} />
              <StatCard label="Total points distributed" value={snapshot?.totalPointsDistributed ?? 0} accent={C.pink} />
            </div>
          </SectionCard>

          <SectionCard
            title="Needs follow-up"
            description="Unresolved cases in critical_alerts with gentle labeling instead of alarming text"
          >
            <StatCard label="Current cases" value={snapshot?.followUpCount ?? 0} accent={C.amber} />
          </SectionCard>

          <SectionCard title="Trend notes">
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
