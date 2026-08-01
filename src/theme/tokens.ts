// ============================================================
// Nabd Space — Design Tokens
// Dark (default) + Light palettes + Font scale + helpers
// ============================================================

export const darkC = {
  bg: "#0D0D1A",
  surface: "#13132A",
  surfaceHi: "#1A1A38",
  border: "#2A2A50",
  borderLo: "#1E1E3C",
  lavender: "#A78BFA",
  lavSoft: "#C4B5FD",
  lavDim: "#6D5CB8",
  pink: "#E879A0",
  pinkSoft: "#F5A7C7",
  cyan: "#67E8F9",
  green: "#6EE7B7",
  amber: "#FCD34D",
  red: "#F87171",
  textHi: "#F0EEF8",
  textMid: "#B4B0D4",
  textLo: "#8B87B3",
  glow: "rgba(167, 139, 250, 0.22)",
  gradient: "linear-gradient(90deg, #A78BFA, #E879A0)",
  modalOverlay: "rgba(5, 7, 18, 0.72)",
  shadow: "0 24px 80px rgba(0, 0, 0, 0.38)",
  toastShadow: "0 18px 48px rgba(0, 0, 0, 0.35)",
} as const;

export const lightC = {
  bg: "#F6F5FB",
  surface: "#FFFFFF",
  surfaceHi: "#F1EFFA",
  border: "#D9D4EC",
  borderLo: "#E7E3F5",
  lavender: "#7C5CD6",
  lavSoft: "#6A48C0",
  lavDim: "#8A72D9",
  pink: "#D6537E",
  pinkSoft: "#E879A0",
  cyan: "#0E8A9E",
  green: "#0F9D6F",
  amber: "#B07D12",
  red: "#D63232",
  textHi: "#191726",
  textMid: "#3F3B57",
  textLo: "#6A6687",
  glow: "rgba(124, 92, 214, 0.12)",
  gradient: "linear-gradient(90deg, #7C5CD6, #D6537E)",
  modalOverlay: "rgba(30, 28, 50, 0.55)",
  shadow: "0 24px 70px rgba(70, 60, 120, 0.16)",
  toastShadow: "0 18px 44px rgba(70, 60, 120, 0.14)",
} as const;

// Generic palette type (strings, not literal values) so both themes satisfy it.
export type Palette = {
  bg: string;
  surface: string;
  surfaceHi: string;
  border: string;
  borderLo: string;
  lavender: string;
  lavSoft: string;
  lavDim: string;
  pink: string;
  pinkSoft: string;
  cyan: string;
  green: string;
  amber: string;
  red: string;
  textHi: string;
  textMid: string;
  textLo: string;
  glow: string;
  gradient: string;
  modalOverlay: string;
  shadow: string;
  toastShadow: string;
};

// Backward-compatible default (dark) — used until ThemeProvider overrides it.
export const C: Palette = darkC;

// ============================================================
// Font scale (px)
// ============================================================
export const FONT = {
  xxs: 11,
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 22,
  display: 28,
} as const;

// ============================================================
// Status keys + styles
// ============================================================
export type StatusKey = "healthy" | "watch" | "at-risk";

export const STATUS_STYLE: Record<StatusKey, { bg: string; text: string; label: string }> = {
  healthy: { bg: "#0D2A20", text: C.green, label: "Healthy" },
  watch: { bg: "#2A1F08", text: C.amber, label: "Watch" },
  "at-risk": { bg: "#2A0D0D", text: C.red, label: "At risk" },
};

// Light-mode variants for status backgrounds
export const STATUS_STYLE_LIGHT: Record<StatusKey, { bg: string; text: string; label: string }> = {
  healthy: { bg: "#E2F6EC", text: lightC.green, label: "Healthy" },
  watch: { bg: "#FBF1D8", text: lightC.amber, label: "Watch" },
  "at-risk": { bg: "#FBE4E4", text: lightC.red, label: "At risk" },
};

// ============================================================
// Helpers
// ============================================================

/** Convert a #hex color to rgba() with the given alpha (0–1). */
export function alpha(hex: string, a: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Resolve a palette color + alpha into an rgba string. */
export function tint(p: Palette, key: keyof Palette, a: number): string {
  return alpha(String(p[key]), a);
}

