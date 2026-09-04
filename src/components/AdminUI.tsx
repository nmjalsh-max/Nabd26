import type { ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT } from "../theme/tokens";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const { theme: C } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "flex-start",
        marginBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: FONT.xxl,
            color: C.textHi,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ color: C.textLo, fontSize: FONT.sm, marginTop: 8, lineHeight: 1.6 }}>{description}</div>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const { theme: C } = useTheme();
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(19,27,46,0.94), rgba(12,19,36,0.82))",
        border: `1px solid ${C.border}`,
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 16px 40px rgba(12, 19, 36, 0.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      {title && (
        <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: C.textHi, fontSize: FONT.lg }}>
          {title}
        </div>
      )}
      {description && (
        <div style={{ color: C.textLo, fontSize: FONT.sm, marginTop: 6, lineHeight: 1.7 }}>{description}</div>
      )}
      <div style={{ marginTop: title || description ? 14 : 0 }}>{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: string;
}) {
  const { theme: C } = useTheme();
  return (
    <div
      style={{
        background: "linear-gradient(180deg, rgba(35,41,60,0.85), rgba(22,29,44,0.9))",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: -28,
            right: -22,
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: `${accent}22`,
            filter: "blur(10px)",
          }}
        />
      )}
      <div style={{ color: C.textLo, fontSize: FONT.xs, position: "relative" }}>{label}</div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 800,
          fontSize: 28,
          marginTop: 8,
          color: accent ?? C.textHi,
          position: "relative",
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function StatusPill({ tone, children }: { tone: "green" | "amber" | "red" | "lavender" | "gray"; children: ReactNode }) {
  const { theme: C } = useTheme();
  const map: Record<string, string> = {
    green: C.green,
    amber: C.amber,
    red: C.red,
    lavender: C.lavender,
    gray: C.textLo,
  };
  const color = map[tone];
  return (
    <span
      style={{
        border: `1px solid ${color}66`,
        background: `${color}1f`,
        color,
        fontWeight: 700,
        fontSize: FONT.sm,
        padding: "6px 12px",
        borderRadius: 999,
        display: "inline-flex",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function GhostButton({
  active,
  onClick,
  children,
  type = "button",
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
}) {
  const { theme: C } = useTheme();
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        border: `1px solid ${active ? C.lavender : C.border}`,
        background: active ? `${C.lavender}22` : "transparent",
        borderRadius: 999,
        padding: "9px 16px",
        color: active ? C.lavSoft : C.textLo,
        fontWeight: 700,
        fontSize: FONT.sm,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function GradientButton({
  onClick,
  children,
  type = "button",
  disabled,
}: {
  onClick?: () => void;
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const { theme: C } = useTheme();
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: `linear-gradient(90deg, ${C.lavender}, #4F46E5)`,
        border: "none",
        borderRadius: 14,
        padding: "10px 18px",
        color: C.bg,
        fontWeight: 800,
        fontSize: FONT.sm,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        boxShadow: "0 14px 28px rgba(139, 92, 246, 0.24)",
      }}
    >
      {children}
    </button>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  const { theme: C } = useTheme();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 20% 0%, ${C.lavender}12, transparent 24%), radial-gradient(circle at 80% 18%, ${C.cyan}12, transparent 20%), ${C.bg}`,
        color: C.textHi,
        padding: "24px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

