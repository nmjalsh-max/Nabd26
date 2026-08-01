import { useTheme } from "../theme/ThemeContext";
import { C } from "../theme/tokens";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
      style={{
        border: `1px solid ${C.border}`,
        background: "transparent",
        borderRadius: 999,
        padding: "8px 12px",
        color: C.lavSoft,
        fontWeight: 900,
        fontSize: 12,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>{mode === "dark" ? "☀️" : "🌙"}</span>
      <span>{mode === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

