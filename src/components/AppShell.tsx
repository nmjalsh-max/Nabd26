import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { AuthContext } from "../auth/BootContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "../i18n/LangContext";

const ADMIN_NAV_EN = [
  { to: "/admin", label: "Dashboard" },
  { to: "/hr", label: "HR" },
  { to: "/employees", label: "Employees" },
  { to: "/leaves", label: "Leaves" },
  { to: "/kaizen", label: "Kaizen" },
  { to: "/upload", label: "Upload" },
  { to: "/reports", label: "Reports" },
  { to: "/sessions", label: "Sessions" },
  { to: "/analytics", label: "Analytics" },
  { to: "/analytics-2", label: "Compare" },
  { to: "/notifications", label: "Notifications" },
];

const ADMIN_NAV_AR = [
  { to: "/admin", label: "لوحة الأدمن" },
  { to: "/hr", label: "الموارد البشرية" },
  { to: "/employees", label: "الموظفون" },
  { to: "/leaves", label: "الإجازات" },
  { to: "/kaizen", label: "الكايزن" },
  { to: "/upload", label: "رفع الملفات" },
  { to: "/reports", label: "التقارير" },
  { to: "/sessions", label: "الجلسات" },
  { to: "/analytics", label: "التحليل" },
  { to: "/analytics-2", label: "المقارنة" },
  { to: "/notifications", label: "الإشعارات" },
];

const EMPLOYEE_NAV_EN = [
  { to: "/employee", label: "Dashboard" },
  { to: "/mood", label: "Daily Mood" },
  { to: "/points", label: "Points" },
  { to: "/sessions", label: "Sessions" },
  { to: "/leaves", label: "My Leaves" },
  { to: "/kaizen", label: "Kaizen" },
  { to: "/notifications", label: "Notifications" },
];

const EMPLOYEE_NAV_AR = [
  { to: "/employee", label: "لوحة الموظف" },
  { to: "/mood", label: "المقياس اليومي" },
  { to: "/points", label: "النقاط" },
  { to: "/sessions", label: "الجلسات" },
  { to: "/leaves", label: "إجازاتي" },
  { to: "/kaizen", label: "الكايزن" },
  { to: "/notifications", label: "الإشعارات" },
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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          borderBottom: `1px solid ${C.border}`,
          background: C.bg + "EF",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 18px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  borderRadius: 16,
                  padding: "10px 12px",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 900,
                  color: C.lavSoft,
                }}
              >
                Nabd Space
              </div>
              <div style={{ color: C.textLo, fontSize: 12 }}>Role: {resolvedRole === "admin" ? "Admin" : "Employee"}</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <ThemeToggle />
              <LangToggle />
              <button
                type="button"
                onClick={() => void handleLogout()}
                style={{
                  border: `1px solid ${C.borderLo}`,
                  background: "transparent",
                  borderRadius: 999,
                  padding: "8px 12px",
                  color: C.textLo,
                  fontWeight: 900,
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
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${isActive ? C.border : C.borderLo}`,
                  background: isActive ? `linear-gradient(135deg, ${C.lavender}22, ${C.pink}16)` : "transparent",
                  color: isActive ? C.lavSoft : C.textLo,
                  fontWeight: 900,
                  fontSize: 12,
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px" }}>
        <div style={{ marginBottom: 12, color: C.textLo, fontSize: 12 }}>
          {userId ? (lang === "en" ? "Session active" : "الجلسة نشطة") : (lang === "en" ? "Preview mode" : "وضع المعاينة")}
        </div>
        {children}
      </div>
    </div>
  );
}

