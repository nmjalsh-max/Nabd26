import { useEffect, useState } from "react";
import { C } from "../theme/tokens";

export function HeartLoader({ progress, label = "Measuring your team's pulse…" }: { progress?: number; label?: string }) {
  const [p, setP] = useState(progress ?? 0);
  const [heartFill, setHeartFill] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (typeof progress === "number") {
      const t = Math.max(0, Math.min(100, progress));
      const normalized = t / 100;
      setP(t);
      setHeartFill(normalized);
      setPulse(normalized);
      return;
    }

    // If progress is not provided, we still animate, but we DO NOT loop forever.
    // This avoids the UI looking "stuck" on a specific value (e.g. 71%).
    let frame: number | null = null;
    let start: number | null = null;

    const duration = 2600;
    const safetyTimeout = 5200;

    const stopAtEnd = () => {
      setP(100);
      setHeartFill(1);
      setPulse(1);
    };

    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setP(Math.round(eased * 100));
      setHeartFill(eased);
      setPulse(eased);

      if (t < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        stopAtEnd();
      }
    };

    frame = requestAnimationFrame(animate);
    const timeoutId = window.setTimeout(() => {
      // Fallback: even if RAF gets interrupted, we still end the loader.
      stopAtEnd();
    }, safetyTimeout);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(timeoutId);
    };
  }, [progress]);

  const logoPath = "M0 90 H52 L70 90 L95 90 L108 90 L120 32 L134 154 L148 90 L165 90 L205 90 L232 90 L262 90 L286 90 L300 70 L318 110 L334 70 L352 90 L382 90 L412 90 L438 90 L462 90 L520 90";

  const ecgPoints = "8,90 36,90 52,90 70,90 85,90 96,18 110,166 126,90 138,90 160,90 178,90 188,90 214,90 224,90 250,90 268,90 286,90 305,90 320,90 334,90 348,90 374,90 408,90 452,90 500,90";
  const totalPts = 14;
  const visiblePts = Math.max(2, Math.round(pulse * totalPts));
  const pts = ecgPoints.split(" ").slice(0, visiblePts).join(" ");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        gap: 32,
      }}
    >
      <style>{`
        @keyframes pulseRing { 0%,100%{opacity:.18;transform:scale(1)} 50%{opacity:.06;transform:scale(1.35)} }
      `}</style>

      {[1.6, 1.3, 1].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: `1px solid ${C.lavender}`,
            opacity: 0.06,
            transform: `scale(${s})`,
            animation: `pulseRing ${2 + i * 0.4}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            pointerEvents: "none",
          }}
        />
      ))}

      <svg width="520" height="220" viewBox="0 0 520 220" role="img" aria-label="Nabd pulse logo">
        <defs>
          <linearGradient id="logoStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={C.lavender} />
            <stop offset="100%" stopColor={C.lavender} />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d={logoPath}
          fill="none"
          stroke="url(#logoStroke)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#logoGlow)"
          opacity={0.95}
        />

        {pts.split(" ").length >= 2 && (
          <polyline
            points={pts}
            fill="none"
            stroke="url(#logoStroke)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logoGlow)"
            opacity={0.9}
          />
        )}
      </svg>

      <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: "100%", height: 3, background: C.surfaceHi, borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
              width: `${p}%`,
              transition: "width 0.05s linear",
              boxShadow: `0 0 10px ${C.lavender}`,
            }}
          />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.textMid }}>{p}%</span>
      </div>

      <span style={{ fontSize: 13, color: C.textLo, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

