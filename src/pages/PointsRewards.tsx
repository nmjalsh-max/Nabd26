import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getPointsRewardsSnapshot, hasRecovered } from "../lib/dashboardData";
import { employeesHR } from "../mock-data/hr";
import { ikigaiPrompts } from "../mock-data/ikigai";

export default function PointsRewards() {
  const { theme: C } = useTheme();
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof getPointsRewardsSnapshot>> | null>(null);
  const [recovered] = useState<boolean>(() => hasRecovered(employeesHR[0]));

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 650);

    void (async () => {
      const client = getSupabaseClient();
      const { data } = await client?.auth.getUser() ?? { data: { user: null } };
      const nextSnapshot = await getPointsRewardsSnapshot(data.user?.id ?? null);
      setSnapshot(nextSnapshot);
    })();

    return () => window.clearTimeout(id);
  }, []);

  const safePct = Math.max(0, Math.min(100, snapshot?.progressPct ?? 0));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22 }}>Points & Rewards</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Live balance and rewards unlocked at point thresholds.</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>Next threshold</div>
<div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>
              {snapshot?.nextThreshold ?? 0}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>Calculating points…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Progress Bar</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                  {safePct}%
                </div>

                <div style={{ marginTop: 12, height: 14, borderRadius: 999, border: `1px solid ${C.borderLo}`, background: C.surfaceHi, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${safePct}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>Current</div>
<div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 26 }}>{snapshot?.currentPoints ?? 0}</div>
                  </div>
                  <div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>Remaining</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 26 }}>
                      {Math.max(0, (snapshot?.nextThreshold ?? 0) - (snapshot?.currentPoints ?? 0))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Ledger</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Point change history.</div>

                <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                  {(snapshot?.ledger ?? []).map((x) => {
                    const plus = x.delta >= 0;
                    return (
                      <div key={x.id} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div>
                          <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{x.type}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{x.at}</div>
                        </div>
                        <div
                          style={{
                            border: `1px solid ${plus ? C.green + "66" : C.red + "66"}`,
                            background: plus ? `${C.green}22` : `${C.red}22`,
                            color: plus ? C.green : C.red,
                            fontWeight: 900,
                            borderRadius: 999,
                            padding: "7px 10px",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {plus ? "+" : ""}{x.delta}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Badges</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Rewards unlocked at point thresholds.</div>

                {recovered && (
                  <div
                    style={{
                      marginTop: 12,
                      border: `1px solid ${C.lavender}55`,
                      borderRadius: 16,
                      padding: 14,
                      background: `linear-gradient(120deg, ${C.lavender}1f, ${C.pink}18)`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>Recovery Badge 🌱</div>
                      <div style={{ color: C.textMid, fontSize: 12, marginTop: 4 }}>A journey from ongoing pressure toward stability — we are proud of you.</div>
                    </div>
                    <div style={{ fontSize: 22 }}>🏅</div>
                  </div>
                )}

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {(snapshot?.rewards ?? []).map((b) => (
                    <div key={b.id} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div>
                        <div style={{ color: b.achieved ? C.lavSoft : C.textMid, fontWeight: 900, fontSize: 13 }}>{b.name}</div>
                        <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>Unlocked at {b.at} points</div>
                      </div>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          background: b.achieved ? `linear-gradient(180deg, ${C.lavender}, ${C.pink})` : C.borderLo,
                          border: `1px solid ${b.achieved ? C.lavender : C.borderLo}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ikigai — purpose reflection (feature 6) */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>🌸 Ikigai — Purpose Card</div>
                    <div style={{ color: C.textLo, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>
                      Ikigai (生き甲斐) is your reason for being. Four gentle questions to reconnect with purpose.
                    </div>
                  </div>
                  <div style={{ width: 180, borderRadius: 14, border: `1px solid ${C.borderLo}`, background: C.surfaceHi, padding: 10, textAlign: "center" }}>
                    <div style={{ color: C.textLo, fontSize: 11, fontWeight: 800 }}>Reflection</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 18, color: C.lavSoft, marginTop: 2 }}>🌸</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
                  {ikigaiPrompts.map((prompt) => (
                    <div key={prompt.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 14, padding: 12, background: C.surfaceHi }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{prompt.emoji}</span>
                        <span style={{ color: C.lavSoft, fontWeight: 800, fontSize: 13 }}>
                          {prompt.circleEn}
                        </span>
                      </div>
                      <div style={{ color: C.textMid, fontSize: 12, marginTop: 8, lineHeight: 1.7 }}>
                        {prompt.questionEn}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 12, color: C.textLo, fontSize: 12, lineHeight: 1.7, textAlign: "center" }}>
                  The goal is not to fully answer today — just to open a small space to think.
                </div>
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

