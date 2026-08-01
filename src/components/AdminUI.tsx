import type { ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";
import { FONT } from "../theme/tokens";

// عنوان الصفحة الموحّد لكل صفحات الأدمن — عنوان + وصف + عناصر يمين اختيارية
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
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: FONT.xxl, color: C.textHi }}>
          {title}
        </div>
        {description && (
          <div style={{ color: C.textLo, fontSize: FONT.sm, marginTop: 6, lineHeight: 1.6 }}>{description}</div>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

// بطاقة قسم رئيسية — الحاوية الموحّدة لكل كتلة محتوى
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
        background: C.surface,
        border: `0.5px solid ${C.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      {title && (
        <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: C.textHi, fontSize: FONT.lg }}>
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

// بطاقة رقم/مؤشر بلمسة تظليل ملوّن اختيارية (glow)
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
        background: C.surfaceHi,
        border: `0.5px solid ${C.borderLo}`,
        borderRadius: 16,
        padding: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: -30,
            insetInlineEnd: -30,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: `${accent}22`,
          }}
        />
      )}
      <div style={{ color: C.textLo, fontSize: FONT.xs, position: "relative" }}>{label}</div>
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontWeight: 700,
          fontSize: 26,
          marginTop: 8,
          color: accent ?? C.textHi,
          position: "relative",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// شارة حالة صغيرة (stable / watch / at-risk وما شابه)
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
        border: `0.5px solid ${color}66`,
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

// زر ثانوي بحدود فقط — يستخدم بكثرة في الفلاتر والأزرار الجانبية
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
        border: `0.5px solid ${active ? C.lavender : C.borderLo}`,
        background: active ? `${C.lavender}1f` : "transparent",
        borderRadius: 999,
        padding: "9px 16px",
        color: active ? C.lavSoft : C.textLo,
        fontWeight: 700,
        fontSize: FONT.sm,
        cursor: "pointer",
        transition: "border-color .15s, color .15s, background .15s",
      }}
    >
      {children}
    </button>
  );
}

// زر رئيسي بتدرج الخزامي → الوردي
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
        background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
        border: "none",
        borderRadius: 14,
        padding: "10px 18px",
        color: C.bg,
        fontWeight: 700,
        fontSize: FONT.sm,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
      }}
    >
      {children}
    </button>
  );
}

// حاوية الصفحة الموحّدة (خلفية + عرض أقصى + حشو)
export function PageShell({ children }: { children: ReactNode }) {
  const { theme: C } = useTheme();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: "24px 20px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

