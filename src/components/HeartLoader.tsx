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

    let frame: number | null = null;
    let start: number | null = null;
    const duration = 2600;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setP(Math.round(eased * 100));
      setHeartFill(eased);
      setPulse(eased);

      if (t < 1) frame = requestAnimationFrame(animate);
      else {
        // loop subtly for smoother perceived loading
        setTimeout(() => {
          start = null;
          frame = requestAnimationFrame(animate);
        }, 350);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress]);

  const heartPath =
    "M80 130 C80 130 20 96 20 58 C20 37 35 22 54 22 C65 22 74 28 80 36 C86 28 95 22 106 22 C125 22 140 37 140 58 C140 96 80 130 80 130Z";

  const ecgPoints = "10,40 28,40 34,20 40,60 48,8 54,52 60,28 66,52 72,8 78,60 84,20 90,40 110,40 150,40";
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

      <svg width="160" height="145" viewBox="0 0 160 145">
        <defs>
          <linearGradient id="hFill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={C.pink} />
            <stop offset="100%" stopColor={C.lavender} />
          </linearGradient>
          <linearGradient id="hStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.lavender} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
          <clipPath id="heartClip">
            <path d={heartPath} />
          </clipPath>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={heartPath} fill="none" stroke={C.lavDim} strokeWidth="2" opacity="0.4" />

        <g clipPath="url(#heartClip)">
          <rect
            x="0"
            y={130 - heartFill * 130}
            width="160"
            height="160"
            fill="url(#hFill)"
            opacity="0.35"
            style={{ transition: "none" }}
          />
        </g>

        <path
          d={heartPath}
          fill="none"
          stroke="url(#hStroke)"
          strokeWidth="2.5"
          filter="url(#glow2)"
          style={{ opacity: 0.5 + heartFill * 0.5 }}
        />

        {pts.split(" ").length >= 2 && (
          <polyline
            points={pts}
            stroke="url(#hStroke)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow2)"
            transform="translate(0, 20)"
          />
        )}

        {heartFill > 0.85 && <circle cx="80" cy="68" r={4 * heartFill} fill={C.pink} opacity={heartFill} filter="url(#glow2)" />}
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

