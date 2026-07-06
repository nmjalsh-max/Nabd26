import { useEffect, useMemo, useState } from "react";
import { C } from "../theme/tokens";
import { notificationsMock } from "../mock-data/notifications";
import { DataState } from "../components/DataState";

export default function NotificationSystem() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [items, setItems] = useState(() => notificationsMock);

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 650);
    return () => window.clearTimeout(id);
  }, []);

  const unreadCount = useMemo(() => items.filter((x) => x.unread).length, [items]);

  function markRead(id: string) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((x) => ({ ...x, unread: false })));
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>نظام الإشعارات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>UI فقط — تمييز unread + إجراءات محلية</div>
          </div>
          <div style={{ width: 240, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12 }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>Unread</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 18, marginTop: 6 }}>{unreadCount}</div>
            <button
              type="button"
              onClick={markAllRead}
              style={{
                marginTop: 10,
                width: "100%",
                background: "transparent",
                border: `1px solid ${C.borderLo}`,
                borderRadius: 14,
                padding: "10px 14px",
                color: C.textLo,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              علّم الكل كمقروء
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ جلب الإشعارات…</div>}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>آخر الإشعارات</div>
              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>انقر على إشعار لتعليمـه كمقروء</div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    style={{
                      width: "100%",
                      textAlign: "right",
                      border: `1px solid ${C.borderLo}`,
                      background: n.unread ? `linear-gradient(135deg, ${C.lavender}22, ${C.pink}16)` : C.surfaceHi,
                      borderRadius: 16,
                      padding: 12,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                      <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{n.type}</div>
                      <div style={{ color: C.textHi, fontWeight: 900, fontSize: 13 }}>{n.title}</div>
                      <div style={{ color: C.textLo, fontSize: 12 }}>{n.time}</div>
                    </div>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: n.unread ? C.lavender : C.borderLo,
                        border: `1px solid ${n.unread ? C.lavSoft : C.borderLo}`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

