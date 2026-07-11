import { C } from "../../theme/tokens";

type ToastProps = {
  open: boolean;
  message: string;
  tone?: "info" | "success" | "error";
  onDismiss: () => void;
};

const toneStyle = {
  info: { bg: C.surfaceHi, border: C.borderLo, text: C.textHi },
  success: { bg: "#10271C", border: C.green, text: C.green },
  error: { bg: "#2A0D0D", border: C.red, text: C.red },
} as const;

export function Toast({ open, message, tone = "info", onDismiss }: ToastProps) {
  if (!open) return null;

  const s = toneStyle[tone];

  return (
    <div
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 60,
        maxWidth: 420,
        borderRadius: 14,
        padding: "12px 14px",
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.text,
        fontSize: 12,
        lineHeight: 1.6,
        boxShadow: "0 18px 48px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>{message}</div>
        <button
          type="button"
          onClick={onDismiss}
          style={{
            border: "none",
            background: "transparent",
            color: C.textLo,
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
