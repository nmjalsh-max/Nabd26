import { ReactNode } from "react";
import { C } from "../theme/tokens";

export type DataStateVariant = "loading" | "empty" | "data";

export function DataState({
  variant,
  title,
  description,
  children,
  loading,
}: {
  variant: DataStateVariant;
  title?: string;
  description?: string;
  children?: ReactNode;
  loading?: ReactNode;
}) {
  if (variant === "loading") {
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
        {loading ?? (
          <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.6 }}>
            جارٍ التحميل…
          </div>
        )}
      </div>
    );
  }

  if (variant === "empty") {
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
        <div style={{ color: C.textHi, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title ?? "لا توجد بيانات"}</div>
        <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.6 }}>{description ?? "جرّب لاحقًا أو غيّر الفلاتر."}</div>
      </div>
    );
  }

  return <>{children}</>;
}

