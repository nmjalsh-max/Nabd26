import type { ReactNode } from "react";
import { C } from "../../theme/tokens";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children?: ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        background: "rgba(5, 7, 18, 0.72)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.38)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 18, color: C.textHi }}>{title}</div>
        {description ? (
          <div style={{ marginTop: 6, color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>{description}</div>
        ) : null}
        <div style={{ marginTop: 14 }}>{children}</div>
      </div>
    </div>
  );
}
