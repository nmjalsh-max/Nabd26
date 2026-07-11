import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getAdminDashboardSnapshot } from "../lib/dashboardData";

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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>لوحة الأدمن</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>مؤشرات حقيقية من `pulse_responses` و `points_ledger` و `critical_alerts`</div>
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
              تسجيل الخروج
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <DataState
            variant={sectionState}
            loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز لوحة الأدمن…</div>}
            title=""
            description=""
          >
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>نظرة عامة</div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                  <div style={{ color: C.textLo, fontSize: 12 }}>نسبة المشاركة اليومية</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 28, marginTop: 6 }}>{snapshot?.participationRate ?? 0}%</div>
                </div>
                <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                  <div style={{ color: C.textLo, fontSize: 12 }}>إجمالي النقاط الموزعة</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 28, marginTop: 6 }}>{snapshot?.totalPointsDistributed ?? 0}</div>
                </div>
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>حالات تحتاج متابعة</div>
              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
                عدد الحالات غير المُحللة في `critical_alerts` مع تمييز لطيف بدل نصوص مزعجة.
              </div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                  <div style={{ color: C.textLo, fontSize: 12 }}>الحالات الحالية</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 28, marginTop: 6 }}>{snapshot?.followUpCount ?? 0}</div>
                </div>
              </div>
            </div>

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>مؤشرات الاتجاه</div>
              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {(snapshot?.trendNotes ?? []).map((note, index) => (
                  <div key={index} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi, color: C.textMid, fontWeight: 900, fontSize: 13 }}>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

