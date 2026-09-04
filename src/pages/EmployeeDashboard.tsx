import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STATUS_STYLE, STATUS_STYLE_LIGHT } from "../theme/tokens";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getEmployeeDashboardSnapshot } from "../lib/dashboardData";
import { getCurrentCampaign, isSeasonalBannerDismissed, dismissSeasonalBanner } from "../mock-data/seasonalCampaigns";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { theme: C, mode } = useTheme();
  const [sectionState, setSectionState] = useState<"loading" | "empty" | "data">("loading");
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof getEmployeeDashboardSnapshot>> | null>(null);
  const [showSeasonal, setShowSeasonal] = useState<boolean>(() => !isSeasonalBannerDismissed());

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
  const campaign = getCurrentCampaign();

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 20% 0%, ${C.lavender}12, transparent 24%), ${C.bg}`, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {showSeasonal && (
          <div
            style={{
              background: `linear-gradient(120deg, ${campaign.accent}26, ${C.pink}22, ${C.lavender}26)`,
              border: `1px solid ${campaign.accent}66`,
              borderRadius: 18,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 26 }}>{campaign.emoji}</span>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, color: C.textHi, fontSize: 14 }}>
                  {campaign.titleEn}
                </div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>
                  {campaign.messageEn}
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => {
                dismissSeasonalBanner();
                setShowSeasonal(false);
              }}
              style={{
                border: `1px solid ${campaign.accent}66`,
                background: "transparent",
                color: C.textLo,
                borderRadius: 999,
                width: 32,
                height: 32,
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ background: "linear-gradient(135deg, rgba(19,27,46,0.94), rgba(12,19,36,0.9))", border: `1px solid ${C.border}`, borderRadius: 22, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ color: C.textLo, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                Welcome back
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 32, letterSpacing: "-0.04em", color: C.textHi }}>
                Alex Sterling
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              style={{
                border: `1px solid ${C.border}`,
                background: "rgba(19,27,46,0.8)",
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 }}>
          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ color: C.textLo, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Daily progress</div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 30, color: C.textHi }}>{snapshot?.completion ? 100 : 0}%</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Daily survey</div>
          </div>
          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ color: C.textLo, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Points balance</div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 30, color: C.lavender }}>{snapshot?.pointsBalance ?? 0}</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Current total</div>
          </div>
          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ color: C.textLo, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Support status</div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 30, color: status.text }}>{status.label}</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Updated this morning</div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Morale status</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Today status - updated after completing the survey</div>
            <div style={{ marginTop: 12 }}>
              <DataState
                variant={sectionState}
                loading={<div style={{ color: C.textLo, fontSize: 12 }}>Loading data...</div>}
                title=""
                description=""
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 10 }}>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ background: status.bg, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ color: status.text, fontWeight: 900, fontSize: 12 }}>Supportive status</div>
                      <div style={{ color: C.textMid, fontSize: 12, marginTop: 6 }}>{status.label}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ height: 10, background: C.surfaceHi, borderRadius: 999, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pointsPct}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                    </div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 8 }}>Progress to next reward</div>
                  </div>
                </div>
              </DataState>
            </div>
          </div>

          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Upcoming sessions</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Next sessions from yoga_sessions</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {(snapshot?.sessions ?? []).slice(0, 3).map((s) => (
                <div key={s.id} style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 12, background: "rgba(12,19,36,0.65)" }}>
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

          <div style={{ background: "linear-gradient(180deg, rgba(19,27,46,0.95), rgba(12,19,36,0.82))", border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Latest notifications</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>From notifications</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {(snapshot?.notifications ?? []).slice(0, 3).map((n) => (
                <div key={n.id} style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 12, background: "rgba(12,19,36,0.65)", display: "flex", justifyContent: "space-between", gap: 10 }}>
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

