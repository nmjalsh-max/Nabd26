import { useTheme } from "../theme/ThemeContext";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: false },
  { label: "Wellness Challenges", icon: "fitness_center", active: true },
  { label: "Innovation Box", icon: "lightbulb", active: false },
  { label: "Analytics", icon: "analytics", active: false },
  { label: "Employee Directory", icon: "group", active: false },
  { label: "Reports", icon: "description", active: false },
  { label: "Rewards Shop", icon: "military_tech", active: false },
  { label: "Settings", icon: "settings", active: false },
];

const challengeCards = [
  {
    icon: "water_drop",
    tone: "secondary",
    label: "12 days left",
    title: "Hydration Hero",
    description: "Drink 8 glasses of water daily and maintain your mental and physical activity.",
    progress: 65,
  },
  {
    icon: "self_improvement",
    tone: "tertiary",
    label: "5 days left",
    title: "Meditation Minutes",
    description: "Dedicate 10 minutes daily for meditation and clear your mind to enhance focus.",
    progress: 0,
    joined: true,
  },
];

const leaderboard = [
  { rank: 1, name: "Ahmed Mahmoud", dept: "Digital Marketing", points: 850, initials: "AM" },
  { rank: 2, name: "Sarah Khaled", dept: "Human Resources", points: 720, initials: "SK" },
  { rank: 3, name: "Omar Mostafa", dept: "Software Development", points: 680, initials: "OM" },
];

export default function WellnessChallenges() {
  const { theme: C } = useTheme();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 20% 0%, ${C.lavender}12, transparent 22%), radial-gradient(circle at 80% 18%, ${C.cyan}12, transparent 18%), ${C.bg}`,
        color: C.textHi,
        padding: "28px 20px 40px",
        fontFamily: "var(--font-ui)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            padding: "8px 10px 18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${C.lavender}22, ${C.cyan}18)`,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.lavSoft,
                fontWeight: 900,
              }}
            >
              N
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, letterSpacing: "0.06em", color: C.lavSoft }}>
              NABD SPACE
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.textHi,
                borderRadius: 999,
                padding: "8px 12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
            <button
              type="button"
              style={{
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textLo,
                borderRadius: 999,
                padding: "8px 12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Alerts
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", gap: 18 }}>
          <aside
            style={{
              background: "linear-gradient(180deg, rgba(21,27,45,0.9), rgba(21,27,45,0.7))",
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: "18px 14px",
              boxShadow: C.shadow,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 16px" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: C.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.bg,
                  fontWeight: 900,
                }}
              >
                N
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: C.textHi }}>Nabd Space</span>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {navItems.map(({ label, icon, active }) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    border: "none",
                    borderRadius: 14,
                    padding: "12px 12px",
                    background: active ? `linear-gradient(135deg, ${C.lavender}22, ${C.cyan}18)` : "transparent",
                    color: active ? C.lavSoft : C.textLo,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: active ? `0 0 0 1px ${C.glow}` : "none",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 28,
                border: `1px solid ${C.border}`,
                background: `linear-gradient(135deg, rgba(139,92,246,0.18), rgba(9,12,22,0.5) 40%, rgba(79,70,229,0.12)), ${C.surface}`,
                padding: "22px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(12,19,36,0.8), rgba(12,19,36,0.15), rgba(12,19,36,0.6))",
                }}
              />
              <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div style={{ maxWidth: 600 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      color: C.lavSoft,
                      background: `${C.lavender}1a`,
                      border: `1px solid ${C.border}`,
                      borderRadius: 999,
                      padding: "7px 12px",
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      local_fire_department
                    </span>
                    Featured Challenge
                  </div>
                  <h2
                    style={{
                      margin: "18px 0 10px",
                      fontFamily: "var(--font-heading)",
                      fontSize: 40,
                      lineHeight: 1,
                      letterSpacing: "-0.06em",
                      fontWeight: 800,
                    }}
                  >
                    10,000 Steps Challenge
                  </h2>
                  <p style={{ margin: 0, color: C.textMid, fontSize: 17, lineHeight: 1.6, maxWidth: 580 }}>
                    Join your colleagues in a month-long walking challenge. Boost your daily activity and achieve your health goals to win valuable prizes.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    alignSelf: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      background: C.gradient,
                      border: "none",
                      borderRadius: 999,
                      padding: "12px 18px",
                      color: C.bg,
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 16px 36px rgba(139, 92, 246, 0.28)",
                    }}
                  >
                    Join now
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18 }}>
              <div style={{ display: "grid", gap: 16 }}>
                <div
                  style={{
                    background: "linear-gradient(180deg, rgba(21,27,45,0.92), rgba(21,27,45,0.76))",
                    border: `1px solid ${C.border}`,
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20 }}>Active Programs</div>
                    <button type="button" style={{ border: "none", background: "transparent", color: C.lavSoft, fontWeight: 800, cursor: "pointer" }}>
                      View all
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
                    {challengeCards.map((card) => (
                      <div
                        key={card.title}
                        style={{
                          background: "linear-gradient(180deg, rgba(35,41,60,0.82), rgba(25,31,49,0.9))",
                          border: `1px solid ${C.border}`,
                          borderRadius: 20,
                          padding: 16,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 12,
                              background: card.tone === "secondary" ? `${C.cyan}1a` : `${C.pink}1a`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: card.tone === "secondary" ? C.cyan : C.pink,
                            }}
                          >
                            <span className="material-symbols-outlined">{card.icon}</span>
                          </div>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: "5px 8px",
                              fontSize: 11,
                              background: `${C.border}99`,
                              color: C.textMid,
                              fontWeight: 700,
                            }}
                          >
                            {card.label}
                          </span>
                        </div>

                        <h3 style={{ margin: "16px 0 8px", fontFamily: "var(--font-heading)", fontSize: 23, fontWeight: 800 }}>{card.title}</h3>
                        <p style={{ margin: 0, color: C.textLo, lineHeight: 1.6, minHeight: 72 }}>{card.description}</p>

                        <div style={{ marginTop: 18 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: C.textMid, fontSize: 12 }}>
                            <span>Personal Progress</span>
                            <span style={{ color: C.lavSoft, fontWeight: 800 }}>{card.progress}%</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 999, background: C.surfaceHi, overflow: "hidden", border: `1px solid ${C.border}` }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${card.progress}%`,
                                background: C.gradient,
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(180deg, rgba(21,27,45,0.92), rgba(21,27,45,0.76))",
                  border: `1px solid ${C.border}`,
                  borderRadius: 22,
                  padding: 18,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20 }}>Leaderboard</div>
                  <span style={{ color: C.textLo, fontSize: 12, fontWeight: 700 }}>This week</span>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        borderRadius: 16,
                        background: `${C.surfaceHi}cc`,
                        padding: "10px 12px",
                        border: `1px solid ${C.borderLo}`,
                      }}
                    >
                      <div style={{ width: 24, fontSize: 15, fontWeight: 800, color: entry.rank === 1 ? C.pink : C.textLo, textAlign: "center" }}>
                        {entry.rank}
                      </div>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${C.lavender}33, ${C.cyan}22)`,
                          color: C.lavSoft,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {entry.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, color: C.textHi, fontSize: 13 }}>{entry.name}</div>
                        <div style={{ color: C.textLo, fontSize: 11 }}>{entry.dept}</div>
                      </div>
                      <div style={{ color: C.cyan, fontWeight: 800, fontSize: 13 }}>{entry.points}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
