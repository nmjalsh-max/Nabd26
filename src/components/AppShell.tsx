import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { AuthContext } from "../auth/BootContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "../i18n/LangContext";

const ADMIN_NAV_EN = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/hr", label: "HR", icon: "badge" },
  { to: "/employees", label: "Employees", icon: "group" },
  { to: "/leaves", label: "Leaves", icon: "event_busy" },
  { to: "/challenges", label: "Wellness Challenges", icon: "fitness_center" },
  { to: "/kaizen", label: "Kaizen", icon: "lightbulb" },
  { to: "/upload", label: "Upload", icon: "upload_file" },
  { to: "/reports", label: "Reports", icon: "description" },
  { to: "/sessions", label: "Sessions", icon: "event" },
  { to: "/analytics", label: "Analytics", icon: "analytics" },
  { to: "/analytics-2", label: "Compare", icon: "compare_arrows" },
  { to: "/notifications", label: "Notifications", icon: "notifications" },
];

const ADMIN_NAV_AR = [
  { to: "/admin", label: "لوحة الأدمن", icon: "dashboard" },
  { to: "/hr", label: "الموارد البشرية", icon: "badge" },
  { to: "/employees", label: "الموظفون", icon: "group" },
  { to: "/leaves", label: "الإجازات", icon: "event_busy" },
  { to: "/challenges", label: "تحديات العافية", icon: "fitness_center" },
  { to: "/kaizen", label: "الكايزن", icon: "lightbulb" },
  { to: "/upload", label: "رفع الملفات", icon: "upload_file" },
  { to: "/reports", label: "التقارير", icon: "description" },
  { to: "/sessions", label: "الجلسات", icon: "event" },
  { to: "/analytics", label: "التحليل", icon: "analytics" },
  { to: "/analytics-2", label: "المقارنة", icon: "compare_arrows" },
  { to: "/notifications", label: "الإشعارات", icon: "notifications" },
];

const EMPLOYEE_NAV_EN = [
  { to: "/employee", label: "Dashboard", icon: "dashboard" },
  { to: "/mood", label: "Daily Mood", icon: "mood" },
  { to: "/points", label: "Points", icon: "military_tech" },
  { to: "/challenges", label: "Wellness Challenges", icon: "fitness_center" },
  { to: "/sessions", label: "Sessions", icon: "event" },
  { to: "/leaves", label: "My Leaves", icon: "event_busy" },
  { to: "/kaizen", label: "Kaizen", icon: "lightbulb" },
  { to: "/notifications", label: "Notifications", icon: "notifications" },
];

const EMPLOYEE_NAV_AR = [
  { to: "/employee", label: "لوحة الموظف", icon: "dashboard" },
  { to: "/mood", label: "المقياس اليومي", icon: "mood" },
  { to: "/points", label: "النقاط", icon: "military_tech" },
  { to: "/challenges", label: "تحديات العافية", icon: "fitness_center" },
  { to: "/sessions", label: "الجلسات", icon: "event" },
  { to: "/leaves", label: "إجازاتي", icon: "event_busy" },
  { to: "/kaizen", label: "الكايزن", icon: "lightbulb" },
  { to: "/notifications", label: "الإشعارات", icon: "notifications" },
];

export function AppShell({ children, role }: { children: React.ReactNode; role?: "admin" | "employee" }) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { userId } = authContext;
  const { theme: C } = useTheme();
  const resolvedRole = role ?? authContext.role ?? "employee";

  const navItems = resolvedRole === "admin"
    ? (lang === "en" ? ADMIN_NAV_EN : ADMIN_NAV_AR)
    : (lang === "en" ? EMPLOYEE_NAV_EN : EMPLOYEE_NAV_AR);

  async function handleLogout() {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut();
    }
    localStorage.removeItem("mock_auth");
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(circle at 20% 0%, ${C.lavender}12, transparent 24%), radial-gradient(circle at 80% 18%, ${C.cyan}12, transparent 20%), ${C.bg}`, color: C.textHi }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(12, 19, 36, 0.82)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 18px 12px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <NavLink
                to="/"
                aria-label="Go to Nabd Space home page"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: `1px solid ${C.border}`,
                  background: "rgba(19, 27, 46, 0.9)",
                  borderRadius: 16,
                  padding: "9px 12px",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: C.lavSoft,
                  boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.18)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    display: "inline-block",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${C.lavender}, ${C.cyan})`,
                    boxShadow: `0 0 18px ${C.lavender}`,
                  }}
                />
                Nabd <span style={{ color: C.lavender }}>Space</span>
              </NavLink>
              <div style={{ color: C.textLo, fontSize: 12, fontWeight: 700 }}>
                {resolvedRole === "admin" ? (lang === "en" ? "Admin" : "أدمن") : (lang === "en" ? "Employee" : "موظف")}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <ThemeToggle />
              <LangToggle />
              <button
                type="button"
                onClick={() => void handleLogout()}
                style={{
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  borderRadius: 999,
                  padding: "8px 12px",
                  color: C.textLo,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {lang === "en" ? "Sign out" : "تسجيل الخروج"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${isActive ? C.border : C.borderLo}`,
                  background: isActive ? `linear-gradient(135deg, ${C.lavender}22, ${C.cyan}16)` : "rgba(19, 27, 46, 0.55)",
                  color: isActive ? C.lavSoft : C.textLo,
                  fontWeight: 800,
                  fontSize: 12,
                  boxShadow: isActive ? `0 0 0 1px ${C.glow}` : "none",
                })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px" }}>
        <div style={{ marginBottom: 12, color: C.textLo, fontSize: 12, fontWeight: 600 }}>
          {userId ? (lang === "en" ? "Session active" : "الجلسة نشطة") : (lang === "en" ? "Preview mode" : "وضع المعاينة")}
        </div>
        {children}
      </div>
    </div>
  );
}

