import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STATUS_STYLE, STATUS_STYLE_LIGHT } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getEmployeeDashboardSnapshot } from "../lib/dashboardData";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { theme: C, mode } = useTheme();
  const [sectionState, setSectionState] = useState<"loading" | "empty" | "data">("loading");
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof getEmployeeDashboardSnapshot>> | null>(null);

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
      const client = getSupabaseClient();
      const { data } = await client?.auth.getUser() ?? { data: { user: null } };
      const nextSnapshot = await getEmployeeDashboardSnapshot(data.user?.id ?? null);
      setSnapshot(nextSnapshot);
    })();

    return () => window.clearTimeout(id);
  }, []);

  const statusMap = mode === "light" ? STATUS_STYLE_LIGHT : STATUS_STYLE;
  const status = snapshot?.completion ? statusMap.healthy : statusMap.watch;
  const pointsPct = snapshot?.progressPct ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
            Real data from Supabase when configured, with Mock fallback otherwise.
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => void handleLogout()}
              style={{
                border: `1px solid ${C.border}`,
                background: "transparent",
                borderRadius: 999,
                padding: "9px 12px",
                color: C.textHi,
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Morale status</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Today status - updated after completing the survey</div>
            <div style={{ marginTop: 12 }}>
              <DataState
                variant={sectionState}
                loading={<div style={{ color: C.textLo, fontSize: 12 }}>Loading data...</div>}
                title=""
                description=""
              >
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>Today progress</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 34 }}>{snapshot?.completion ? 100 : 0}%</div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 2 }}>Daily survey</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ background: status.bg, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ color: status.text, fontWeight: 900, fontSize: 12 }}>Supportive status</div>
                      <div style={{ color: C.textMid, fontSize: 12, marginTop: 6 }}>{status.label}</div>
                    </div>
                  </div>
                </div>
              </DataState>
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Points balance</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Actual balance from points_ledger</div>
            <div style={{ marginTop: 12 }}>
              <DataState variant="data" loading={null}>
                <div style={{ height: 10, background: C.surfaceHi, borderRadius: 999, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pointsPct}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>Current</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>{snapshot?.pointsBalance ?? 0}</div>
                  </div>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>Next threshold</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 26 }}>{snapshot?.nextThreshold ?? 0}</div>
                  </div>
                </div>
              </DataState>
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Upcoming sessions</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Next sessions from yoga_sessions</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {(snapshot?.sessions ?? []).slice(0, 3).map((s) => (
                <div key={s.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>{s.title}</div>
                    <button type="button" style={{ border: `1px solid ${C.border}`, background: "transparent", borderRadius: 999, padding: "7px 10px", color: C.lavSoft, fontWeight: 900, fontSize: 12 }}>Book</button>
                  </div>
                  <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.6 }}>
                    {s.time} - {s.mode} - {s.coach}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Latest notifications</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>From notifications</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {(snapshot?.notifications ?? []).slice(0, 3).map((n) => (
                <div key={n.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi, display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{n.type}</div>
                    <div style={{ color: C.textHi, fontWeight: 900, fontSize: 13, marginTop: 4 }}>{n.title}</div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{n.time}</div>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: 999, background: n.unread ? C.lavender : C.borderLo, alignSelf: "flex-start", marginTop: 4 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

