import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { PageHeader, PageShell, SectionCard, StatCard, StatusPill } from "../components/AdminUI";
import { kaizenIdeas, totalKaizenVotes, implementedKaizenCount } from "../mock-data/kaizen";
import { useLang } from "../i18n/LangContext";

type Tone = "green" | "amber" | "red" | "lavender" | "gray";

function toneForStatus(status: string): Tone {
  if (status === "implemented") return "green";
  if (status === "reviewing") return "amber";
  return "lavender";
}

export default function KaizenBox() {
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const isEn = lang === "en";
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [ideas, setIdeas] = useState(kaizenIdeas);
  const [voted, setVoted] = useState<Set<number>>(new Set());

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 600);
    return () => window.clearTimeout(id);
  }, []);

  function handleVote(id: number) {
    if (voted.has(id)) return;
    setVoted((prev) => new Set(prev).add(id));
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea)));
  }

  return (
    <PageShell>
      <PageHeader
        title={isEn ? "💡 Kaizen Box" : "💡 صندوق الكايزن"}
        description={
          isEn
            ? "Kaizen (改善) is continuous improvement. Small ideas, visible results — every voice matters."
            : "الكايزن (改善) هو التحسين المستمر. أفكار صغيرة بنتائج مرئية — كل صوت مهم."
        }
        actions={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatCard label={isEn ? "Ideas" : "الأفكار"} value={ideas.length} accent={C.lavender} />
            <StatCard label={isEn ? "Total votes" : "إجمالي التصويتات"} value={totalKaizenVotes()} accent={C.pink} />
            <StatCard label={isEn ? "Implemented" : "مُنفَّذ"} value={implementedKaizenCount()} accent={C.green} />
          </div>
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>جارٍ تحميل صندوق الكايزن…</div>}>
        <SectionCard
          title={isEn ? "Community ideas" : "أفكار الفريق"}
          description={
            isEn
              ? "Vote for ideas that would improve your work-life. The most voted ones move to review and implementation."
              : "صوّت للأفكار التي تحسّن حياتك العملية. الأكثر تصويتًا تنتقل للمراجعة والتنفيذ."
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ideas.map((idea) => {
              const alreadyVoted = voted.has(idea.id);
              return (
                <div
                  key={idea.id}
                  style={{
                    border: `0.5px solid ${C.borderLo}`,
                    borderRadius: 16,
                    padding: 14,
                    background: C.surfaceHi,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1, minWidth: 220 }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>{idea.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, color: C.textHi, fontSize: 14 }}>
                          {isEn ? idea.titleEn : idea.titleAr}
                        </span>
                        <StatusPill tone={toneForStatus(idea.status)}>
                          {isEn ? idea.status : idea.status === "implemented" ? "مُنفَّذ" : idea.status === "reviewing" ? "قيد المراجعة" : "مقترح"}
                        </StatusPill>
                      </div>
                      <div style={{ color: C.textMid, fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
                        {isEn ? idea.descEn : idea.descAr}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: isEn ? "row" : "row" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 900, fontSize: 18, color: C.lavSoft }}>
                      {idea.votes}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVote(idea.id)}
                      disabled={alreadyVoted}
                      style={{
                        border: `0.5px solid ${alreadyVoted ? C.green : C.lavender}`,
                        background: alreadyVoted ? `${C.green}1f` : `${C.lavender}1f`,
                        color: alreadyVoted ? C.green : C.lavSoft,
                        borderRadius: 999,
                        padding: "8px 14px",
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: alreadyVoted ? "default" : "pointer",
                      }}
                    >
                      {alreadyVoted ? (isEn ? "✓ Voted" : "✓ صوّتّ") : (isEn ? "▲ Vote" : "▲ صوّت")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </DataState>
    </PageShell>
  );
}

