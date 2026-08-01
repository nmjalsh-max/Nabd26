/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--nabd-bg)",
        surface: "var(--nabd-surface)",
        surfaceHi: "var(--nabd-surface-hi)",
        border: "var(--nabd-border)",
        borderLo: "var(--nabd-border-lo)",
        lavender: "var(--nabd-lavender)",
        lavSoft: "var(--nabd-lav-soft)",
        lavDim: "var(--nabd-lav-dim)",
        pink: "var(--nabd-pink)",
        pinkSoft: "var(--nabd-pink-soft)",
        cyan: "var(--nabd-cyan)",
        green: "var(--nabd-green)",
        amber: "var(--nabd-amber)",
        red: "var(--nabd-red)",
        textHi: "var(--nabd-text-hi)",
        textMid: "var(--nabd-text-mid)",
        textLo: "var(--nabd-text-lo)",
      },
fontFamily: {
        sora: ["Sora", "Cairo", "sans-serif"],
        cairo: ["Cairo", "sans-serif"],
        tajawal: ["Tajawal", "Cairo", "sans-serif"],
        inter: ["Inter", "Cairo", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xxs: ["11px", { lineHeight: "1.4" }],
        xs: ["12px", { lineHeight: "1.5" }],
        sm: ["13px", { lineHeight: "1.6" }],
        base: ["14px", { lineHeight: "1.6" }],
        md: ["15px", { lineHeight: "1.6" }],
        lg: ["16px", { lineHeight: "1.6" }],
        xl: ["18px", { lineHeight: "1.5" }],
        "2xl": ["22px", { lineHeight: "1.4" }],
        display: ["28px", { lineHeight: "1.3" }],
      },
    },
  },
  plugins: [],
};

