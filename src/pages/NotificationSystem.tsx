import { useContext, useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { AuthContext } from "../auth/BootContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getNotificationSnapshot, type NotificationFeedItem } from "../lib/dashboardData";
import { PageHeader, PageShell, SectionCard, StatCard, GhostButton } from "../components/AdminUI";
import { getActiveQuietWindow, quietHoursProgress, quietWindows } from "../mock-data/quietHours";
import { useLang } from "../i18n/LangContext";

export default function NotificationSystem() {
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const { userId } = useContext(AuthContext);
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [items, setItems] = useState<NotificationFeedItem[]>([]);
  const isEn = lang === "en";
  const activeWindow = getActiveQuietWindow();
  const quietPct = quietHoursProgress();

  useEffect(() => {
    let active = true;

    async function loadSnapshot() {
      const snapshot = await getNotificationSnapshot(userId);
      if (!active) return;
      setItems(snapshot.items);
      setVariant("data");
    }

    void loadSnapshot();

    const client = getSupabaseClient();
    if (!client || !userId) {
      return () => {
        active = false;
      };
    }

    const channel = client
      .channel(`live_notifications_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const incoming = payload.new as Record<string, unknown> | null;
          if (!incoming) return;

          const nextItem: NotificationFeedItem = {
            id: String(incoming.id ?? `${Date.now()}-${Math.random()}`),
            type: String(incoming.type ?? "notification"),
            title: String(incoming.title ?? "إشعار جديد"),
            time: new Date(String(incoming.created_at ?? new Date())).toLocaleString("ar-SA"),
            unread: !incoming.is_read,
          };

          setItems((prev) => [nextItem, ...prev.filter((item) => item.id !== nextItem.id)].slice(0, 12));
        }
      )
      .subscribe();

    return () => {
      active = false;
      void client.removeChannel(channel);
    };
  }, [userId]);

  const unreadCount = useMemo(() => items.filter((x) => x.unread).length, [items]);

  async function markRead(id: string) {
    const client = getSupabaseClient();
    if (client) {
      await client.from("notifications").update({ is_read: true }).eq("id", id);
    }

    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  }

  async function markAllRead() {
    const client = getSupabaseClient();
    if (client && userId) {
      await client.from("notifications").update({ is_read: true }).eq("user_id", userId);
    }

    setItems((prev) => prev.map((x) => ({ ...x, unread: false })));
  }

  return (
    <PageShell>
      <PageHeader
        title="نظام الإشعارات"
        description="Live notifications عبر Supabase Realtime مع fallback محلي"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatCard label="Unread" value={unreadCount} accent={C.lavender} />
            <GhostButton onClick={() => void markAllRead()}>علّم الكل كمقروء</GhostButton>
          </div>
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ جلب الإشعارات…</div>}>
        {/* Teinei — quiet hours (feature 5) */}
        <SectionCard
          title={isEn ? "🤫 Teinei — Quiet Hours" : "🤫 تينيي — الساعات الهادئة"}
          description={
            isEn
              ? "Teinei (ていねい) means doing things carefully to bring out the best in yourself. Respectful focus windows with no meeting or chat pings."
              : "تينيي (ていねい) تعني الإتقان والعناية لإخراج أفضل ما فيك. نوافذ تركيز محترمة بلا اجتماعات أو تنبيهات محادثات."
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeWindow ? (
              <div
                style={{
                  border: `0.5px solid ${C.lavender}66`,
                  background: `linear-gradient(90deg, ${C.lavender}1f, ${C.pink}14)`,
                  borderRadius: 16,
                  padding: 14,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 26, lineHeight: 1 }}>{activeWindow.emoji}</span>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ color: C.lavSoft, fontWeight: 800, fontSize: 13 }}>
                    {isEn ? "🔕 Quiet hours are active now" : "🔕 الساعات الهادئة نشطة الآن"}
                  </div>
                  <div style={{ color: C.textMid, fontSize: 12, marginTop: 4 }}>
                    {isEn ? activeWindow.titleEn : activeWindow.titleAr} · {activeWindow.startHour}:00 – {activeWindow.endHour}:00
                  </div>
                </div>
                <div style={{ width: 140, height: 8, borderRadius: 999, background: C.surfaceHi, overflow: "hidden", border: `0.5px solid ${C.borderLo}` }}>
                  <div style={{ height: "100%", width: `${quietPct}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
                </div>
              </div>
            ) : (
              <div style={{ border: `0.5px solid ${C.borderLo}`, borderRadius: 16, padding: 14, color: C.textMid, fontSize: 13, lineHeight: 1.7 }}>
                {isEn
                  ? "🌤 No quiet window is active right now. The next ones are shown below — you'll be notified when one starts."
                  : "🌤 لا توجد نافذة هادئة نشطة الآن. النوافذ التالية معروضة بالأسفل — سنخطرك عند بدئها."}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
              {quietWindows.map((w) => {
                const active = activeWindow?.id === w.id;
                return (
                  <div
                    key={w.id}
                    style={{
                      background: active ? `${C.lavender}18` : C.surfaceHi,
                      border: `0.5px solid ${active ? C.lavender : C.borderLo}`,
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontSize: 20, lineHeight: 1 }}>{w.emoji}</div>
                    <div style={{ color: active ? C.lavSoft : C.textHi, fontWeight: 800, fontSize: 13, marginTop: 8 }}>
                      {isEn ? w.titleEn : w.titleAr}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.textMid, marginTop: 4 }}>
                      {w.startHour}:00 – {w.endHour}:00
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="آخر الإشعارات" description="الإشعارات تظهر فورًا من Realtime بدون تحديث الصفحة">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => void markRead(n.id)}
                style={{
                  width: "100%",
                  textAlign: "right",
                  border: `0.5px solid ${C.borderLo}`,
                  background: n.unread ? `linear-gradient(90deg, ${C.lavender}22, ${C.pink}16)` : C.surfaceHi,
                  borderRadius: 16,
                  padding: 14,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                  <div style={{ color: C.textMid, fontWeight: 700, fontSize: 12 }}>{n.type}</div>
                  <div style={{ color: C.textHi, fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                  <div style={{ color: C.textLo, fontSize: 12 }}>{n.time}</div>
                </div>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: n.unread ? C.lavender : C.borderLo,
                    border: `0.5px solid ${n.unread ? C.lavSoft : C.borderLo}`,
                    flexShrink: 0,
                  }}
                />
              </button>
            ))}
          </div>
        </SectionCard>
      </DataState>
    </PageShell>
  );
}
