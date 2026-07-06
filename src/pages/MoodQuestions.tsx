import { useEffect, useMemo, useState } from "react";
import { C } from "../theme/tokens";
import { likert, moodQuestions } from "../mock-data/mood";
import { DataState } from "../components/DataState";

export default function MoodQuestions() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVariant("data");
    }, 700);
    return () => window.clearTimeout(id);
  }, []);

  const progress = useMemo(() => {
    const total = moodQuestions.length;
    const filled = Object.keys(answers).length;
    // Avoid TS strict comparison warning: keep division guarded.
    return total ? Math.round((filled / total) * 100) : 0;

  }, [answers]);


  function setAnswer(idx: number, value: number) {
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>أسئلة المعنويات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>UI فقط — أسئلة + سلم Likert مع حفظ محلي</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12 }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>التقدم</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
              <div style={{ flex: 1, height: 10, borderRadius: 999, background: C.surfaceHi, border: `1px solid ${C.borderLo}`, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})` }} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 12 }}>{progress}%</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState
            variant={variant}
            loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تجهيز الأسئلة…</div>}
          >
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>مقياس اليوم</div>
              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                اختر قيمة واحدة لكل سؤال (لا يوجد إرسال فعلي).
              </div>

              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                {moodQuestions.map((q, idx) => {
                  const selected = answers[idx];
                  return (
                    <div key={idx} style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                      <div style={{ color: C.textMid, fontWeight: 900, fontSize: 13 }}>{q}</div>
                      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {likert.map((x) => {
                          const active = selected === x.value;
                          return (
                            <button
                              key={x.value}
                              type="button"
                              onClick={() => setAnswer(idx, x.value)}
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
                              {x.label}
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
                  onClick={() => setAnswers({})}
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
                  مسح الإجابات
                </button>
                <button
                  type="button"
                  disabled={progress !== 100}
                  style={{
                    background: progress === 100 ? `linear-gradient(135deg, ${C.lavender}, ${C.pink})` : C.borderLo,
                    border: "none",
                    borderRadius: 14,
                    padding: "10px 16px",
                    color: "#0B0B14",
                    fontWeight: 900,
                    cursor: progress === 100 ? "pointer" : "not-allowed",
                    minWidth: 180,
                  }}
                >
                  حفظ (محلي) 
                </button>
              </div>
            </div>
          </DataState>
        </div>
      </div>
    </div>
  );
}

