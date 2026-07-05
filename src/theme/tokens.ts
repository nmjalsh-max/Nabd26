export const C = {
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
  textMid: "#A8A4C8",
  textLo: "#5C5880",
} as const;

export type StatusKey = "healthy" | "watch" | "at-risk";

export const STATUS_STYLE: Record<StatusKey, { bg: string; text: string; label: string }> = {
  healthy: { bg: "#0D2A20", text: C.green, label: "Healthy" },
  watch: { bg: "#2A1F08", text: C.amber, label: "Watch" },
  "at-risk": { bg: "#2A0D0D", text: C.red, label: "At risk" },
};

