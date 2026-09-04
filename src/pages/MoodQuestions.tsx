import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { DAILY_MOOD_QUESTIONS, saveDailyMoodAnswers, hasCompletedDailyMoodForUser } from "../lib/dashboardData";
import { getSupabaseClient } from "../lib/supabaseClient";

export default function MoodQuestions() {
  const navigate = useNavigate();
  const { theme: C } = useTheme();
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<string>("Choose an answer for each question.");
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVariant("data");
    }, 700);

    void (async () => {
      const client = getSupabaseClient();
      const { data } = await client?.auth.getUser() ?? { data: { user: null } };
      const userId = data.user?.id ?? null;
      const completed = await hasCompletedDailyMoodForUser(userId);
      setAlreadyAnswered(completed);
    })();

    return () => window.clearTimeout(id);
  }, []);

  const progress = useMemo(() => {
    const total = DAILY_MOOD_QUESTIONS.length;
    const filled = Object.keys(answers).length;
    return total ? Math.round((filled / total) * 100) : 0;
  }, [answers]);

  function setAnswer(idx: number, value: number) {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  }

  async function handleSave() {
    if (alreadyAnswered || progress !== 100) {
      return;
    }

    const client = getSupabaseClient();
    const { data } = await client?.auth.getUser() ?? { data: { user: null } };
    const userId = data.user?.id ?? null;

    setSaving(true);
    setStatus("Saving answers…");

    const payload = DAILY_MOOD_QUESTIONS.map((question, index) => ({
      questionKey: question.key,
      value: answers[index],
    }));

    const result = await saveDailyMoodAnswers(userId, payload);

    if (result.saved && !result.alreadyAnswered) {
      setStatus(`Saved successfully — ${result.pointsEarned} points added.`);
      setPointsEarned(result.pointsEarned);
      setAlreadyAnswered(true);
      setCompleted(true);
    } else if (result.alreadyAnswered) {
      setStatus("You have already completed today's check-in.");
      setCompleted(true);
    } else {
      setStatus("Unable to save your answers right now.");
    }

    setSaving(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 22 }}>Mood Questions</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>A five-question daily check-in with persistent storage and duplicate prevention.</div>
          </div>
          <div style={{ width: 260, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12 }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>Progress</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <div style={{ flex: 1, height: 10, borderRadius: 999, background: C.surfaceHi, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
              </div>
<div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, color: C.textMid, fontSize: 12 }}>{progress}%</div>
            </div>
            <div style={{ marginTop: 8, color: C.textLo, fontSize: 12 }}>{status}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState
            variant={variant}
            loading={<div style={{ color: C.textLo, fontSize: 12 }}>Preparing questions…</div>}
          >
            {completed ? (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 24 }}>Thank you!</div>
                <div style={{ color: C.textLo, fontSize: 13, marginTop: 8 }}>{status}</div>
                <div style={{ color: C.textMid, fontSize: 12, marginTop: 10 }}>{pointsEarned} points were added to your balance.</div>
                <button
                  type="button"
                  onClick={() => navigate("/employee")}
                  style={{
                    marginTop: 16,
                    background: `linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
                    border: "none",
                    borderRadius: 14,
                    padding: "10px 16px",
                    color: "#0B0B14",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Back to Employee Dashboard
                </button>
              </div>
            ) : (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
                <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>Today's Check-in</div>
                <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                  Choose one value for each question (1 = lowest, 5 = highest).
                </div>

                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                  {DAILY_MOOD_QUESTIONS.map((question, idx) => {
                    const selected = answers[idx];
                    return (
                      <div key={question.key} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                        <div style={{ color: C.textMid, fontWeight: 900, fontSize: 13 }}>
                          {idx + 1}. {question.label}
                        </div>
                        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
                          {[1, 2, 3, 4, 5].map((value) => {
                            const active = selected === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setAnswer(idx, value)}
                                style={{
                                  border: `1px solid ${active ? C.lavSoft : C.borderLo}`,
                                  background: active ? `linear-gradient(135deg, ${C.lavender}33, ${C.pink}22)` : "transparent",
                                  borderRadius: 999,
                                  padding: "8px 10px",
                                  cursor: "pointer",
                                  color: active ? C.lavSoft : C.textLo,
                                  fontWeight: 900,
                                  fontSize: 13,
                                  minWidth: 56,
                                }}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setStatus("Answers cleared.");
                    }}
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.borderLo}`,
                      borderRadius: 14,
                      padding: "10px 14px",
                      color: C.textLo,
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Clear Answers
                  </button>
                  <button
                    type="button"
                    disabled={progress !== 100 || saving || alreadyAnswered}
                    onClick={() => void handleSave()}
                    style={{
                      background: progress === 100 && !saving && !alreadyAnswered ? `linear-gradient(135deg, ${C.lavender}, ${C.pink})` : C.borderLo,
                      border: "none",
                      borderRadius: 14,
                      padding: "10px 16px",
                      color: "#0B0B14",
                      fontWeight: 900,
                      cursor: progress === 100 && !saving && !alreadyAnswered ? "pointer" : "not-allowed",
                      minWidth: 180,
                    }}
                  >
                    {saving ? "Saving…" : "Save Check-in"}
                  </button>
                </div>
              </div>
            )}
          </DataState>
        </div>
      </div>
    </div>
  );
}

