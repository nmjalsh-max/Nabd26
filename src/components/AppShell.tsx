import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { C } from "../theme/tokens";
import { AuthContext } from "../auth/BootContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import LangToggle from "./LangToggle";
import { useLang } from "../i18n/LangContext";

const ADMIN_NAV = [
  { to: "/admin", label: "لوحة الأدمن" },
  { to: "/upload", label: "رفع الملفات" },
  { to: "/reports", label: "التقارير" },
  { to: "/sessions", label: "الجلسات" },
  { to: "/analytics", label: "التحليل" },
  { to: "/analytics-2", label: "المقارنة" },
  { to: "/notifications", label: "الإشعارات" },
];

const EMPLOYEE_NAV = [
  { to: "/employee", label: "لوحة الموظف" },
  { to: "/mood", label: "المقياس اليومي" },
  { to: "/points", label: "النقاط" },
  { to: "/sessions", label: "الجلسات" },
  { to: "/notifications", label: "الإشعارات" },
];

export function AppShell({ children, role }: { children: React.ReactNode; role?: "admin" | "employee" }) {
  const { lang } = useLang();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { userId } = authContext;
  const resolvedRole = role ?? authContext.role ?? "employee";

  const navItems = resolvedRole === "admin" ? ADMIN_NAV : EMPLOYEE_NAV;

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
          background: `${C.bg}EF`,
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
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 900,
                  color: C.lavSoft,
                }}
              >
                Nabd Space
              </div>
              <div style={{ color: C.textLo, fontSize: 12 }}>Role: {resolvedRole === "admin" ? "Admin" : "Employee"}</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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
