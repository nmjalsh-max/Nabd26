import { useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { AuthContext } from "../auth/BootContext";
import { SectionCard, StatusPill, GhostButton, PageHeader, PageShell } from "../components/AdminUI";
import { leaveRequests } from "../mock-data/hr";

type Tone = "green" | "amber" | "red" | "lavender" | "gray";

function toneForStatus(status: string): Tone {
  if (status === "approved") return "green";
  if (status === "pending") return "amber";
  return "red";
}

export default function Leaves() {
  const { theme: C } = useTheme();
  const { role, userId } = useContext(AuthContext);
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [items, setItems] = useState(leaveRequests);

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 600);
    return () => window.clearTimeout(id);
  }, []);

  const isAdmin = role === "admin";

  const visible = useMemo(() => {
    if (isAdmin) return items;
    // Employee sees only their leaves (mock: first employee entry)
    return items.filter((item) => item.employee === "Laila Mohamed");
  }, [items, isAdmin, userId]);

  function setStatus(id: number, status: "approved" | "rejected") {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  const summary = useMemo(() => {
    return {
      total: items.length,
      pending: items.filter((i) => i.status === "pending").length,
      approved: items.filter((i) => i.status === "approved").length,
      rejected: items.filter((i) => i.status === "rejected").length,
    };
  }, [items]);

  return (
    <PageShell>
      <PageHeader
        title={isAdmin ? "Leave Management" : "My Leaves"}
        description={
          isAdmin
            ? "Approve or reject leave requests while noting lower wellbeing cases."
            : "Track your leave records and submitted requests."
        }
      />

      {isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 14 }}>
          {[
            { label: "Total", value: summary.total, color: C.lavender },
            { label: "Pending", value: summary.pending, color: C.amber },
            { label: "Approved", value: summary.approved, color: C.green },
            { label: "Rejected", value: summary.rejected, color: C.red },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: C.surface,
                border: `0.5px solid ${C.border}`,
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div style={{ color: C.textLo, fontSize: 12 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 24, marginTop: 6, color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>Loading leave requests…</div>}>
        <SectionCard title="Leave Requests" description="List of all requests with leave type, duration, and status.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visible.length === 0 && (
              <div style={{ color: C.textLo, fontSize: 13, padding: 12 }}>No leave requests to display.</div>
            )}
            {visible.map((leave) => (
              <div
                key={leave.id}
                style={{
                  border: `0.5px solid ${C.borderLo}`,
                  borderRadius: 14,
                  padding: 14,
                  background: C.surfaceHi,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontWeight: 700, color: C.textHi, fontSize: 13 }}>
                      {leave.employee} — {leave.type}
                    </div>
                    <div style={{ color: C.textLo, fontSize: 12 }}>
                      {leave.from} to {leave.to} • {leave.days} days • {leave.department}
                    </div>
                    <div style={{ color: C.textMid, fontSize: 12 }}>{leave.reason}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <StatusPill tone={toneForStatus(leave.status)}>{leave.status}</StatusPill>
                    {isAdmin && leave.status === "pending" && (
                      <>
                        <GhostButton active onClick={() => setStatus(leave.id, "approved")}>
                          Approve
                        </GhostButton>
                        <GhostButton onClick={() => setStatus(leave.id, "rejected")}>
                          Reject
                        </GhostButton>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </DataState>
    </PageShell>
  );
}

