// ============================================================
// Nabd Space — Design Tokens
// Dark (default) + Light palettes + Font scale + helpers
// ============================================================

// Updated "Nabd Space" branding — synced with the Google Stitch design (violet + teal)
export const darkC = {
  bg: "#0C1324",
  surface: "#151B2D",
  surfaceHi: "#23293C",
  border: "#2E3447",
  borderLo: "#191F31",
  lavender: "#8B5CF6",
  lavSoft: "#C0C1FF",
  lavDim: "#6D28D9",
  pink: "#FF5451",
  pinkSoft: "#FF9D9A",
  cyan: "#4FDBC8",
  green: "#6EE7B7",
  amber: "#FCD34D",
  red: "#F87171",
  textHi: "#DCE1FB",
  textMid: "#C7C4D7",
  textLo: "#908FA0",
  glow: "rgba(139, 92, 246, 0.22)",
  gradient: "linear-gradient(90deg, #8B5CF6, #4FDBC8)",
  modalOverlay: "rgba(5, 7, 18, 0.72)",
  shadow: "0 24px 80px rgba(0, 0, 0, 0.38)",
  toastShadow: "0 18px 48px rgba(0, 0, 0, 0.35)",
} as const;

export const lightC = {
  bg: "#F7F7FC",
  surface: "#FFFFFF",
  surfaceHi: "#F1F0FA",
  border: "#DCD9F0",
  borderLo: "#EAE8F7",
  lavender: "#7C3AED",
  lavSoft: "#6D28D9",
  lavDim: "#8B5CF6",
  pink: "#E11D48",
  pinkSoft: "#F43F5E",
  cyan: "#0D9488",
  green: "#0F9D6F",
  amber: "#B07D12",
  red: "#D63232",
  textHi: "#131B2E",
  textMid: "#4B5065",
  textLo: "#6B7280",
  glow: "rgba(124, 58, 237, 0.12)",
  gradient: "linear-gradient(90deg, #7C3AED, #0D9488)",
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

