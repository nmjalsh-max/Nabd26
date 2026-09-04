import { useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { GradientButton, PageHeader, PageShell, SectionCard, StatusPill } from "../components/AdminUI";

type IdeaStatus = "Under Review" | "Implemented" | "Rejected" | "Clarification Needed";

type Idea = {
  id: number;
  status: IdeaStatus;
  time: string;
  title: string;
  description: string;
  submittedBy: string;
  impact: string;
  cost: string;
  department: string;
  image: string;
};

const initialIdeas: Idea[] = [
  {
    id: 1,
    status: "Under Review",
    time: "2 hours ago",
    title: "Improving Employee Break Room",
    description: "Add plants and more natural lighting to reduce stress and increase productivity.",
    submittedBy: "Ahmed Khalil",
    impact: "Medium - High",
    cost: "Medium",
    department: "HR & Facilities",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmDU0y7eXjBgW1QL6s8FH4Jla8NsPH_LxljPWyCCM5oo0suCG6NcFxgT7Ax5p0tzSBUwf58XkZ_cf6-BZ-h-4pLrBknO1mApJBlWHz5jTA3dGd4G51nkAjsHdWstDuTr2suNPdVfKbClTeA4ysHKLsAsi9HP31XtWk8JaK5t7SuVuHoIQKRtLmwyzX9m3o8LlJR0tcV3C1hu9_hpsh39P01mkUXT7ZmEVdxAPN9nl4EefIPOdZyWyJ",
  },
  {
    id: 2,
    status: "Implemented",
    time: "2 days ago",
    title: "Mini Weekly Workshops",
    description: "Allocate 30 minutes weekly for knowledge sharing across teams.",
    submittedBy: "Nora Sami",
    impact: "High",
    cost: "Low",
    department: "Learning & Development",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    status: "Rejected",
    time: "1 week ago",
    title: "Additional Coffee Machine",
    description: "We need another machine on the 3rd floor to reduce waiting time.",
    submittedBy: "Mazen Ali",
    impact: "Low",
    cost: "High",
    department: "Operations",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
  },
];

const innovationWallCards = [
  { title: "Smart Lighting System", text: "Reduce energy consumption by 20%", progress: 80 },
  { title: "Team Health App", text: "Track shared physical activity", progress: 72 },
];

function statusTone(status: IdeaStatus, C: ReturnType<typeof useTheme>["theme"]) {
  switch (status) {
    case "Implemented":
      return { bg: `${C.lavender}22`, color: C.lavender, label: status };
    case "Rejected":
      return { bg: `${C.red}22`, color: C.red, label: status };
    case "Clarification Needed":
      return { bg: `${C.amber}22`, color: C.amber, label: status };
    default:
      return { bg: `${C.cyan}22`, color: C.cyan, label: status };
  }
}

export default function KaizenBox() {
  const { theme: C } = useTheme();
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");

  const filteredIdeas = useMemo(
    () =>
      ideas.filter(
        (idea) =>
          idea.title.toLowerCase().includes(search.toLowerCase()) ||
          idea.description.toLowerCase().includes(search.toLowerCase())
      ),
    [ideas, search]
  );

  const selectedIdea = filteredIdeas.find((idea) => idea.id === selectedId) ?? ideas.find((idea) => idea.id === selectedId) ?? ideas[0];
  const selectedTone = statusTone(selectedIdea.status, C);

  function handleStatusChange(next: "Approved" | "Rejected" | "Clarification") {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== selectedIdea.id) return idea;
        if (next === "Approved") return { ...idea, status: "Implemented" };
        if (next === "Rejected") return { ...idea, status: "Rejected" };
        return { ...idea, status: "Clarification Needed" };
      })
    );
  }

  function handleSubmitNewIdea() {
    const newIdea: Idea = {
      id: Date.now(),
      status: "Under Review",
      time: "Just now",
      title: "New Employee Experience Suggestion",
      description: "Improve onboarding and recognition moments for new team members.",
      submittedBy: "You",
      impact: "Medium",
      cost: "Low",
      department: "People Ops",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setSelectedId(newIdea.id);
    setSearch("");
  }

  return (
    <PageShell>
      <PageHeader
        title="Innovation Box"
        description="Share ideas that improve the employee experience, culture, and workplace energy."
        actions={<GradientButton onClick={handleSubmitNewIdea}>Submit new idea</GradientButton>}
      />

      <SectionCard>
        <div style={{ display: "grid", gridTemplateColumns: "360px minmax(0, 1fr)", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                background: C.surfaceHi,
                padding: "10px 12px",
              }}
            >
              <span className="material-symbols-outlined" style={{ color: C.textLo, fontSize: 18 }}>
                search
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ideas..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: C.textHi,
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredIdeas.length === 0 ? (
                <div
                  style={{
                    border: `1px dashed ${C.border}`,
                    borderRadius: 14,
                    padding: 16,
                    color: C.textLo,
                    textAlign: "center",
                    fontSize: 13,
                  }}
                >
                  No ideas match your search.
                </div>
              ) : (
                filteredIdeas.map((item) => {
                  const isSelected = item.id === selectedIdea.id;
                  const tone = statusTone(item.status, C);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      style={{
                        background: isSelected ? C.surfaceHi : C.surface,
                        border: `1px solid ${isSelected ? C.lavender : C.borderLo}`,
                        borderRadius: 18,
                        padding: 14,
                        textAlign: "left",
                        cursor: "pointer",
                        boxShadow: isSelected ? `0 0 0 1px ${C.glow}` : "none",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                        <StatusPill tone={item.status === "Implemented" ? "lavender" : item.status === "Rejected" ? "red" : item.status === "Clarification Needed" ? "amber" : "green"}>
                          {item.status}
                        </StatusPill>
                        <span style={{ color: C.textLo, fontSize: 12 }}>{item.time}</span>
                      </div>
                      <div style={{ marginTop: 12, color: C.textHi, fontWeight: 800, fontSize: 18, lineHeight: 1.35 }}>{item.title}</div>
                      <div style={{ marginTop: 8, color: C.textMid, fontSize: 13, lineHeight: 1.6 }}>{item.description}</div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              background: `linear-gradient(180deg, ${C.surface}, ${C.surfaceHi})`,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              minHeight: 440,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <StatusPill tone={selectedIdea.status === "Implemented" ? "lavender" : selectedIdea.status === "Rejected" ? "red" : selectedIdea.status === "Clarification Needed" ? "amber" : "green"}>
                {selectedIdea.status}
              </StatusPill>
              <span style={{ color: C.textMid, fontSize: 13 }}>Submitted by: {selectedIdea.submittedBy}</span>
            </div>

            <h2
              style={{
                marginTop: 14,
                marginBottom: 8,
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: 30,
                lineHeight: 1.1,
                color: C.textHi,
              }}
            >
              {selectedIdea.title}
            </h2>

            <p style={{ color: C.textMid, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              I suggest redesigning the current break room space to include more natural elements. We could add a green wall,
              lighting that simulates natural sunlight, and some comfortable, isolated seating for mental rest. Studies show that a
              natural environment at work reduces stress levels and increases creative focus by up to 15%.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, marginTop: 18 }}>
              <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}>
                <div style={{ color: C.textLo, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Expected impact
                </div>
                <div style={{ marginTop: 8, color: C.lavender, fontWeight: 800, fontSize: 22 }}>{selectedIdea.impact}</div>
              </div>
              <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}>
                <div style={{ color: C.textLo, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Estimated cost
                </div>
                <div style={{ marginTop: 8, color: C.cyan, fontWeight: 800, fontSize: 22 }}>{selectedIdea.cost}</div>
              </div>
              <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}>
                <div style={{ color: C.textLo, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Department
                </div>
                <div style={{ marginTop: 8, color: C.pinkSoft, fontWeight: 800, fontSize: 22 }}>{selectedIdea.department}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                overflow: "hidden",
                background: C.surfaceHi,
                position: "relative",
              }}
            >
              <div
                style={{
                  height: 220,
                  backgroundImage: `url('${selectedIdea.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, color: C.textHi }}>
                <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textLo }}>Reference image</span>
                <span className="material-symbols-outlined" style={{ color: C.lavender }}>visibility</span>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleStatusChange("Rejected")}
                style={{
                  border: `1px solid ${C.red}66`,
                  background: `${C.red}12`,
                  color: C.red,
                  borderRadius: 999,
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Reject idea
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Clarification")}
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.surfaceHi,
                  color: C.textHi,
                  borderRadius: 999,
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Request clarification
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Approved")}
                style={{
                  border: "none",
                  background: C.gradient,
                  color: C.bg,
                  borderRadius: 999,
                  padding: "9px 14px",
                  cursor: "pointer",
                  fontWeight: 800,
                  boxShadow: `0 14px 28px ${C.glow}`,
                }}
              >
                Approve & execute
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <div style={{ marginTop: 18 }}>
        <SectionCard title="Innovation wall" description="Recent growth across the top submitted ideas and impact metrics.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
            <div
              style={{
                background: C.surfaceHi,
                border: `1px solid ${C.borderLo}`,
                borderLeft: `4px solid ${C.lavender}`,
                borderRadius: 18,
                padding: 18,
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 800, fontSize: 32, color: C.lavender }}>
                {ideas.filter((idea) => idea.status === "Implemented").length + 124}
              </div>
              <div style={{ marginTop: 8, color: C.textLo, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Ideas implemented this year
              </div>
            </div>

            <div style={{ gridColumn: "span 3", display: "flex", gap: 12, flexWrap: "wrap" }}>
              {innovationWallCards.map((card) => (
                <div
                  key={card.title}
                  style={{
                    flex: "1 1 220px",
                    minWidth: 220,
                    background: C.surfaceHi,
                    border: `1px solid ${C.borderLo}`,
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div style={{ color: C.textHi, fontSize: 16, fontWeight: 800 }}>{card.title}</div>
                  <div style={{ marginTop: 6, color: C.textMid, fontSize: 12, lineHeight: 1.6 }}>{card.text}</div>
                  <div style={{ marginTop: 12, height: 8, borderRadius: 999, background: C.surface, border: `1px solid ${C.border}` }}>
                    <div
                      style={{
                        width: `${card.progress}%`,
                        height: "100%",
                        borderRadius: 999,
                        background: C.gradient,
                      }}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSubmitNewIdea}
                style={{
                  flex: "1 1 220px",
                  minWidth: 220,
                  background: C.surfaceHi,
                  border: `1px dashed ${C.border}`,
                  borderRadius: 16,
                  padding: 16,
                  cursor: "pointer",
                  color: C.textLo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 120,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add_circle</span>
                <span style={{ fontWeight: 700, fontSize: 12 }}>Your next idea here</span>
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}

