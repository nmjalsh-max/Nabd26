import { useContext, useEffect, useMemo, useState } from "react";
import { C } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { AuthContext } from "../auth/BootContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import { getSessionCalendarSnapshot, type SessionCalendarEntry } from "../lib/dashboardData";

const EMPTY_FORM = {
  title: "",
  mode: "Online",
  coach: "",
  starts_at: "",
  capacity: "12",
};

export default function SessionsCalendar() {
  const { role, userId } = useContext(AuthContext);
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [items, setItems] = useState<SessionCalendarEntry[]>([]);
  const [status, setStatus] = useState<string>("اختر جلسة للحجز أو أضف جلسة جديدة.");
  const [form, setForm] = useState(EMPTY_FORM);

  const loadSnapshot = async () => {
    const snapshot = await getSessionCalendarSnapshot();
    setItems(snapshot.sessions);
    setVariant("data");
  };

  useEffect(() => {
    void loadSnapshot();
  }, []);

  const dayCount = useMemo(() => items.length, [items]);

  async function handleBook(sessionId: number) {
    const client = getSupabaseClient();
    if (!client || !userId) {
      setStatus("تحتاج إلى تسجيل دخول فعلي لتأكيد الحجز.");
      return;
    }

    const target = items.find((item) => item.id === sessionId);
    if (!target || target.seatsLeft <= 0) {
      setStatus("السعة ممتلئة لهذه الجلسة حاليًا.");
      return;
    }

    const { error } = await client.from("session_attendance").insert({
      user_id: userId,
      session_id: sessionId,
      status: "registered",
    });

    if (error?.code === "23505") {
      setStatus("أنت مسجّل بالفعل في هذه الجلسة.");
      return;
    }

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("تم الحجز بنجاح.");
    await loadSnapshot();
  }

  async function handleAddSession(e: React.FormEvent) {
    e.preventDefault();
    const client = getSupabaseClient();

    if (!client || role !== "admin") {
      setStatus("هذا الإجراء متاح فقط للأدمن عند تهيئة Supabase.");
      return;
    }

    if (!form.title || !form.coach || !form.starts_at) {
      setStatus("املأ العنوان والمدرب وتاريخ البداية.");
      return;
    }

    const { error } = await client.from("yoga_sessions").insert({
      title: form.title,
      mode: form.mode,
      coach: form.coach,
      starts_at: form.starts_at,
      capacity: Number(form.capacity || 1),
      is_active: true,
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("تمت إضافة الجلسة الجديدة.");
    setForm(EMPTY_FORM);
    await loadSnapshot();
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>تقويم الجلسات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>جلسات من `yoga_sessions` + حجز فعلي عبر `session_attendance`</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>عدد الجلسات</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>{dayCount}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تحميل التقويم…</div>}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>الجلسات المتاحة</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>{status}</div>

                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  {items.map((session) => (
                    <div key={session.id} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 14, padding: 12, background: C.surfaceHi }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>{session.title}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{session.time} — {session.mode} — {session.coach}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <div style={{ color: C.textMid, fontSize: 12, fontWeight: 900 }}>المتبقي: {session.seatsLeft}</div>
                          <button
                            type="button"
                            onClick={() => void handleBook(session.id)}
                            style={{
                              border: `1px solid ${C.borderLo}`,
                              background: session.seatsLeft > 0 ? "transparent" : C.borderLo,
                              borderRadius: 999,
                              padding: "7px 10px",
                              color: session.seatsLeft > 0 ? C.lavSoft : C.textLo,
                              fontWeight: 900,
                              fontSize: 12,
                              cursor: session.seatsLeft > 0 ? "pointer" : "not-allowed",
                            }}
                          >
                            حجز
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {role === "admin" && (
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                  <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>إضافة جلسة جديدة</div>
                  <form onSubmit={handleAddSession} style={{ marginTop: 12, display: "grid", gap: 10 }}>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="اسم الجلسة"
                      style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 12, padding: "10px 12px", color: C.textHi, fontSize: 12 }}
                    />
                    <input
                      value={form.coach}
                      onChange={(e) => setForm((prev) => ({ ...prev, coach: e.target.value }))}
                      placeholder="المدرب"
                      style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 12, padding: "10px 12px", color: C.textHi, fontSize: 12 }}
                    />
                    <input
                      type="datetime-local"
                      value={form.starts_at}
                      onChange={(e) => setForm((prev) => ({ ...prev, starts_at: e.target.value }))}
                      style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 12, padding: "10px 12px", color: C.textHi, fontSize: 12 }}
                    />
                    <input
                      value={form.capacity}
                      onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
                      placeholder="السعة"
                      inputMode="numeric"
                      style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 12, padding: "10px 12px", color: C.textHi, fontSize: 12 }}
                    />
                    <select
                      value={form.mode}
                      onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
                      style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 12, padding: "10px 12px", color: C.textHi, fontSize: 12 }}
                    >
                      <option>Online</option>
                      <option>Hybrid</option>
                      <option>InPerson</option>
                    </select>
                    <button
                      type="submit"
                      style={{ background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`, border: "none", borderRadius: 999, padding: "10px 14px", color: C.bg, fontWeight: 900, cursor: "pointer" }}
                    >
                      إضافة جلسة
                    </button>
                  </form>
                </div>
              )}
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

