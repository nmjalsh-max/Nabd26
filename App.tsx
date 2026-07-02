import { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Users, BarChart3, Heart, Settings, Bell, Search,
  TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, CheckCircle2,
  ChevronRight, Sparkles, Video, MapPin, X
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

/* ── PALETTE ─────────────────────────────────────────────────────── */
const C = {
  bg:        "#0D0D1A",
  surface:   "#13132A",
  surfaceHi: "#1A1A38",
  border:    "#2A2A50",
  borderLo:  "#1E1E3C",
  lavender:  "#A78BFA",
  lavSoft:   "#C4B5FD",
  lavDim:    "#6D5CB8",
  pink:      "#E879A0",
  pinkSoft:  "#F5A7C7",
  cyan:      "#67E8F9",
  green:     "#6EE7B7",
  amber:     "#FCD34D",
  red:       "#F87171",
  textHi:    "#F0EEF8",
  textMid:   "#A8A4C8",
  textLo:    "#5C5880",
};

/* ── MOCK DATA ───────────────────────────────────────────────────── */
const trendData = [
  { month: "Jan", score: 71 }, { month: "Feb", score: 73 }, { month: "Mar", score: 70 },
  { month: "Apr", score: 75 }, { month: "May", score: 78 }, { month: "Jun", score: 76 },
];
const teams = [
  { name: "Engineering",    headcount: 84, engagement: 68, wellbeing: 71, trend: -8, status: "watch" },
  { name: "Sales",          headcount: 46, engagement: 82, wellbeing: 79, trend:  4, status: "healthy" },
  { name: "Customer Support",headcount:38, engagement: 61, wellbeing: 58, trend: -3, status: "at-risk" },
  { name: "Marketing",      headcount: 22, engagement: 88, wellbeing: 84, trend:  6, status: "healthy" },
  { name: "Operations",     headcount: 31, engagement: 74, wellbeing: 70, trend:  1, status: "healthy" },
  { name: "Finance & HR",   headcount: 19, engagement: 79, wellbeing: 77, trend:  2, status: "healthy" },
];
const sessions = [
  { title: "Sunday Morning Yoga",       time: "Sun · 7:30 AM",   mode: "In-person", location: "Studio A",    spots: "18 / 25 joined" },
  { title: "Stress Management Workshop",time: "Tue · 1:00 PM",   mode: "Virtual",   location: "Zoom",        spots: "42 / 60 joined" },
  { title: "1:1 Counseling Slots",      time: "Wed · open slots",mode: "Virtual",   location: "Private",     spots: "6 slots left" },
  { title: "Midday Mindfulness Break",  time: "Daily · 3:00 PM", mode: "In-person", location: "Wellness Room",spots: "Drop-in" },
];
const alerts = [
  { level: "warn", text: "Engineering engagement dropped 8% over the past 4 weeks", time: "2h ago" },
  { level: "risk", text: "Customer Support wellbeing score fell below 60 threshold", time: "1d ago" },
  { level: "info", text: "3 employees requested 1:1 counseling this week",           time: "1d ago" },
  { level: "good", text: "Marketing hit 88% engagement — highest this quarter",      time: "3d ago" },
];
const programParticipation = [
  { name: "Yoga & Movement",       value: 342 },
  { name: "Mental Health Support", value: 198 },
  { name: "Mindfulness Breaks",    value: 276 },
  { name: "Workshops",             value: 154 },
];
const engagementByDept = teams.map(t => ({
  name: t.name.split(" ")[0], engagement: t.engagement, wellbeing: t.wellbeing
}));
const PIE_COLORS = [C.lavender, C.cyan, C.pink, C.amber];
const STATUS_STYLE = {
  healthy:  { bg: "#0D2A20", text: C.green,   label: "Healthy" },
  watch:    { bg: "#2A1F08", text: C.amber,   label: "Watch" },
  "at-risk":{ bg: "#2A0D0D", text: C.red,     label: "At risk" },
};

/* ── LOGO SVG ────────────────────────────────────────────────────── */
function NabdLogo({ size = 28 }) {
  /* Heart drawn from ECG-style path: flat → spike → heart curve */
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <defs>
        <linearGradient id="lgLogo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.lavender} />
          <stop offset="100%" stopColor={C.pink} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Heart shape */}
      <path
        d="M28 46 C28 46 8 34 8 20 C8 13 13 8 19 8 C23 8 26 10 28 13 C30 10 33 8 37 8 C43 8 48 13 48 20 C48 34 28 46 28 46Z"
        fill="url(#lgLogo)" opacity="0.18"
      />
      <path
        d="M28 46 C28 46 8 34 8 20 C8 13 13 8 19 8 C23 8 26 10 28 13 C30 10 33 8 37 8 C43 8 48 13 48 20 C48 34 28 46 28 46Z"
        stroke="url(#lgLogo)" strokeWidth="2" fill="none" filter="url(#glow)"
      />
      {/* ECG pulse line inside heart */}
      <polyline
        points="12,28 17,28 19,22 21,34 24,20 26,32 28,24 30,32 32,20 35,34 37,22 39,28 44,28"
        stroke="url(#lgLogo)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#glow)"
      />
    </svg>
  );
}

/* ── LOADING SCREEN ──────────────────────────────────────────────── */
function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [heartFill, setHeartFill] = useState(0);
  const [pulse, setPulse] = useState(0); // 0-1 for ECG line draw

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 2600;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      // Ease in-out
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setProgress(Math.round(eased * 100));
      setHeartFill(eased);
      setPulse(eased);
      if (t < 1) { frame = requestAnimationFrame(animate); }
      else { setTimeout(onDone, 350); }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* SVG heart clip path filled from bottom */
  const heartPath = "M80 130 C80 130 20 96 20 58 C20 37 35 22 54 22 C65 22 74 28 80 36 C86 28 95 22 106 22 C125 22 140 37 140 58 C140 96 80 130 80 130Z";

  /* ECG points scaled to 160×80 viewbox */
  const ecgPoints = "10,40 28,40 34,20 40,60 48,8 54,52 60,28 66,52 72,8 78,60 84,20 90,40 110,40 150,40";
  /* partial draw based on pulse */
  const totalPts = 14;
  const visiblePts = Math.max(2, Math.round(pulse * totalPts));
  const pts = ecgPoints.split(" ").slice(0, visiblePts).join(" ");

  return (
    <div style={{
      position:"fixed", inset:0, background:C.bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:100, gap:32
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        @keyframes pulseRing { 0%,100%{opacity:.18;transform:scale(1)} 50%{opacity:.06;transform:scale(1.35)} }
      `}</style>

      {/* Ambient rings */}
      {[1.6,1.3,1].map((s,i)=>(
        <div key={i} style={{
          position:"absolute", width:260, height:260, borderRadius:"50%",
          border:`1px solid ${C.lavender}`, opacity:.06,
          transform:`scale(${s})`,
          animation:`pulseRing ${2+i*0.4}s ease-in-out infinite`,
          animationDelay:`${i*0.3}s`,
          pointerEvents:"none"
        }}/>
      ))}

      {/* Heart SVG */}
      <svg width="160" height="145" viewBox="0 0 160 145">
        <defs>
          <linearGradient id="hFill" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor={C.pink} />
            <stop offset="100%" stopColor={C.lavender} />
          </linearGradient>
          <linearGradient id="hStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={C.lavender} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
          <clipPath id="heartClip">
            <path d={heartPath} />
          </clipPath>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Heart outline (dim) */}
        <path d={heartPath} fill="none" stroke={C.lavDim} strokeWidth="2" opacity="0.4"/>

        {/* Fill that rises from bottom */}
        <g clipPath="url(#heartClip)">
          <rect
            x="0" y={130 - heartFill * 130} width="160" height="160"
            fill="url(#hFill)" opacity="0.35"
            style={{ transition: "none" }}
          />
        </g>

        {/* Heart glowing outline */}
        <path d={heartPath} fill="none" stroke="url(#hStroke)" strokeWidth="2.5"
          filter="url(#glow2)"
          style={{ opacity: 0.5 + heartFill * 0.5 }}
        />

        {/* ECG line animating inside */}
        {pts.split(" ").length >= 2 && (
          <polyline
            points={pts}
            stroke="url(#hStroke)" strokeWidth="2.2" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#glow2)"
            transform="translate(0, 20)"
          />
        )}

        {/* Center beat dot */}
        {heartFill > 0.85 && (
          <circle cx="80" cy="68" r={4 * heartFill} fill={C.pink} opacity={heartFill} filter="url(#glow2)"/>
        )}
      </svg>

      {/* Brand */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <NabdLogo size={32} />
        <span style={{
          fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:26,
          background:`linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
        }}>Nabd Space</span>
      </div>

      {/* Progress bar */}
      <div style={{ width:200, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
        <div style={{ width:"100%", height:3, background:C.surfaceHi, borderRadius:4, overflow:"hidden" }}>
          <div style={{
            height:"100%", borderRadius:4,
            background:`linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
            width:`${progress}%`, transition:"width 0.05s linear",
            boxShadow:`0 0 10px ${C.lavender}`
          }}/>
        </div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:C.textMid }}>
          {progress}%
        </span>
      </div>

      <span style={{ fontSize:13, color:C.textLo, letterSpacing:2, textTransform:"uppercase" }}>
        Measuring your team's pulse…
      </span>
    </div>
  );
}

/* ── SMALL COMPONENTS ────────────────────────────────────────────── */
function TrendBadge({ value }) {
  const up = value > 0, flat = value === 0;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  const color = flat ? C.textMid : up ? C.green : C.red;
  return (
    <span style={{ color }} className="inline-flex items-center gap-1 text-xs font-semibold">
      <Icon size={13} strokeWidth={2.5} />
      {value === 0 ? "0%" : `${up ? "+" : ""}${value}%`}
    </span>
  );
}

function KPICard({ label, value, sub, trend, accent }) {
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 20px" }}
         className="flex flex-col gap-2">
      <div style={{ color:accent, fontSize:10, textTransform:"uppercase", letterSpacing:2, fontWeight:700 }}>{label}</div>
      <div className="flex items-end justify-between">
        <span style={{ fontSize:28, fontWeight:800, color:C.textHi, fontFamily:"'JetBrains Mono',monospace" }}>{value}</span>
        {trend !== undefined && <TrendBadge value={trend} />}
      </div>
      <div style={{ fontSize:11, color:C.textLo }}>{sub}</div>
    </div>
  );
}

function PulseRing({ score }) {
  const r = 54, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width:140, height:140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform:"rotate(-90deg)" }}>
        <defs>
          <linearGradient id="prGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.lavender} />
            <stop offset="100%" stopColor={C.pink} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.borderLo} strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="url(#prGrad)" strokeWidth="12"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1s ease", filter:`drop-shadow(0 0 6px ${C.lavender})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Heart size={15} style={{ color:C.pink, animation:"beat 1.6s ease-in-out infinite", marginBottom:3 }} fill={C.pink} />
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:800, color:C.textHi }}>{score}</span>
        <span style={{ fontSize:9, color:C.textLo, textTransform:"uppercase", letterSpacing:2 }}>Team Pulse</span>
      </div>
    </div>
  );
}

/* ── DASHBOARD TAB ───────────────────────────────────────────────── */
function DashboardTab({ onSelectTeam }) {
  const ttStyle = { borderRadius:10, border:`1px solid ${C.border}`, fontSize:12, background:C.surfaceHi, color:C.textHi };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Active employees"   value="240" sub="across 6 teams"                       accent={C.lavender} />
        <KPICard label="Engagement rate"    value="76%" sub="of employees active this month" trend={3}  accent={C.cyan} />
        <KPICard label="Avg wellbeing score"value="76"  sub="self-reported + activity"       trend={2}  accent={C.green} />
        <KPICard label="Upcoming sessions"  value="4"   sub="this week across programs"             accent={C.pink} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:4 }}>Wellbeing trend</div>
          <div style={{ fontSize:11, color:C.textLo, marginBottom:16 }}>Company-wide average, last 6 months</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ left:-20, right:10 }}>
              <defs>
                <linearGradient id="tFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.lavender} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={C.pink}     stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="tStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor={C.lavender} />
                  <stop offset="100%" stopColor={C.pink} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLo} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textLo }} axisLine={false} tickLine={false} />
              <YAxis domain={[50,90]}  tick={{ fontSize:11, fill:C.textLo }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey="score" stroke="url(#tStroke)" strokeWidth={2.5} fill="url(#tFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20,
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <PulseRing score={76} />
          <div style={{ fontSize:11, color:C.textLo, textAlign:"center", marginTop:12, lineHeight:1.6 }}>
            Composite of engagement,<br/>program use &amp; self-reports
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:16 }}>Team snapshot</div>
          <div className="flex flex-col gap-1">
            {teams.map(t => {
              const s = STATUS_STYLE[t.status];
              return (
                <button key={t.name} onClick={() => onSelectTeam(t.name)}
                  style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"9px 10px", borderRadius:10, border:"none", cursor:"pointer",
                    background:"transparent", borderBottom:`1px solid ${C.borderLo}` }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surfaceHi}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ width:7, height:7, borderRadius:"50%", background:s.text, display:"block",
                      boxShadow:`0 0 6px ${s.text}` }}/>
                    <span style={{ fontSize:13, fontWeight:500, color:C.textHi }}>{t.name}</span>
                    <span style={{ fontSize:11, color:C.textLo }}>{t.headcount} people</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20,
                      background:s.bg, color:s.text }}>{s.label}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700,
                      color:C.textHi, minWidth:24, textAlign:"right" }}>{t.wellbeing}</span>
                    <ChevronRight size={14} style={{ color:C.textLo }}/>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:16 }}>Recent activity</div>
          <div className="flex flex-col gap-4">
            {alerts.map((a, i) => {
              const Icon = a.level==="good" ? CheckCircle2 : a.level==="info" ? Sparkles : AlertTriangle;
              const color = a.level==="risk" ? C.red : a.level==="warn" ? C.amber : a.level==="good" ? C.green : C.lavender;
              return (
                <div key={i} className="flex gap-2.5">
                  <Icon size={14} style={{ color, flexShrink:0, marginTop:2 }} />
                  <div>
                    <div style={{ fontSize:11, color:C.textMid, lineHeight:1.5 }}>{a.text}</div>
                    <div style={{ fontSize:10, color:C.textLo, marginTop:3 }}>{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── TEAM WELLBEING TAB ──────────────────────────────────────────── */
function TeamWellbeingTab({ selected, setSelected }) {
  const [query, setQuery] = useState("");
  const filtered = teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));
  const detail = teams.find(t => t.name === selected);
  return (
    <div className="flex gap-4">
      <div style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.borderLo}`, display:"flex", alignItems:"center", gap:8 }}>
          <Search size={14} style={{ color:C.textLo }} />
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search teams"
            style={{ background:"none", border:"none", outline:"none", fontSize:13, color:C.textHi,
              flex:1 }} />
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.borderLo}` }}>
              {["Team","Headcount","Engagement","Wellbeing","30-day trend","Status"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10,
                  textTransform:"uppercase", letterSpacing:1.5, color:C.textLo, fontWeight:700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const s = STATUS_STYLE[t.status];
              const active = t.name === selected;
              return (
                <tr key={t.name} onClick={()=>setSelected(t.name)}
                  style={{ cursor:"pointer", background: active ? C.surfaceHi : "transparent",
                    borderBottom:`1px solid ${C.borderLo}`, transition:"background .15s" }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=C.surfaceHi+"88" }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent" }}
                >
                  <td style={{ padding:"11px 16px", fontSize:13, fontWeight:600, color:C.textHi }}>{t.name}</td>
                  <td style={{ padding:"11px 16px", fontSize:13, color:C.textMid }}>{t.headcount}</td>
                  <td style={{ padding:"11px 16px", fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:C.textMid }}>{t.engagement}%</td>
                  <td style={{ padding:"11px 16px", fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:C.lavSoft }}>{t.wellbeing}</td>
                  <td style={{ padding:"11px 16px" }}><TrendBadge value={t.trend}/></td>
                  <td style={{ padding:"11px 16px" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"2px 9px", borderRadius:20,
                      background:s.bg, color:s.text }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {detail && (
        <div style={{ width:272, flexShrink:0, background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:16, padding:20, height:"fit-content" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.textHi }}>{detail.name}</span>
            <button onClick={()=>setSelected(null)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textLo }}>
              <X size={15}/>
            </button>
          </div>
          <div style={{ fontSize:11, color:C.textLo, marginBottom:16 }}>{detail.headcount} team members</div>
          <div style={{ display:"flex", justifyContent:"center" }}><PulseRing score={detail.wellbeing}/></div>
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
            {[
              ["Engagement",   `${detail.engagement}%`, null],
              ["30-day trend", null, detail.trend],
              ["Status",       STATUS_STYLE[detail.status].label, null],
            ].map(([k,v,trend])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textMid }}>
                <span>{k}</span>
                {trend !== null ? <TrendBadge value={trend}/> :
                  <span style={{ fontWeight:700, color:k==="Status"?STATUS_STYLE[detail.status].text:C.lavSoft }}>{v}</span>}
              </div>
            ))}
          </div>
          {detail.status !== "healthy" && (
            <div style={{ marginTop:14, fontSize:11, color:C.red, background:"#2A0D0D", borderRadius:10,
              padding:"10px 12px", lineHeight:1.6 }}>
              Wellbeing dipped below target. Consider scheduling a check-in or team workshop.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── ANALYTICS TAB ───────────────────────────────────────────────── */
function AnalyticsTab() {
  const tt = { borderRadius:10, border:`1px solid ${C.border}`, fontSize:12, background:C.surfaceHi, color:C.textHi };
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:4 }}>Engagement vs. Wellbeing</div>
          <div style={{ fontSize:11, color:C.textLo, marginBottom:16 }}>By team, current month</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementByDept} margin={{ left:-20, right:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.borderLo} vertical={false}/>
              <XAxis dataKey="name" tick={{ fontSize:10, fill:C.textLo }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:C.textLo }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Bar dataKey="engagement" fill={C.lavender} radius={[4,4,0,0]} name="Engagement %"
                style={{ filter:`drop-shadow(0 0 4px ${C.lavender})` }}/>
              <Bar dataKey="wellbeing"  fill={C.cyan}     radius={[4,4,0,0]} name="Wellbeing score"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:4 }}>Program participation</div>
          <div style={{ fontSize:11, color:C.textLo, marginBottom:16 }}>Unique participants, last 30 days</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={programParticipation} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={50} outerRadius={80} paddingAngle={3}>
                {programParticipation.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={tt}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
            {programParticipation.map((p,i)=>(
              <div key={p.name} className="flex items-center gap-1.5" style={{ fontSize:11, color:C.textMid }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:PIE_COLORS[i%PIE_COLORS.length], display:"block" }}/>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textHi, marginBottom:4 }}>Company wellbeing trend</div>
        <div style={{ fontSize:11, color:C.textLo, marginBottom:16 }}>6-month view</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData} margin={{ left:-20, right:10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.borderLo} vertical={false}/>
            <XAxis dataKey="month" tick={{ fontSize:11, fill:C.textLo }} axisLine={false} tickLine={false}/>
            <YAxis domain={[50,90]} tick={{ fontSize:11, fill:C.textLo }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tt}/>
            <Line type="monotone" dataKey="score" stroke={C.lavender} strokeWidth={2.5} dot={{ r:3, fill:C.lavender }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── NAV ─────────────────────────────────────────────────────────── */
const NAV = [
  { key:"dashboard", label:"Dashboard",      icon:LayoutDashboard },
  { key:"team",      label:"Team wellbeing", icon:Users },
  { key:"analytics", label:"Analytics",      icon:BarChart3 },
  { key:"programs",  label:"Programs",       icon:Heart },
  { key:"settings",  label:"Settings",       icon:Settings },
];

/* ── SHELL ───────────────────────────────────────────────────────── */
export default function NabdHRAdmin() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState("dashboard");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const title = useMemo(()=>NAV.find(n=>n.key===tab)?.label??"Dashboard",[tab]);

  if (loading) return <LoadingScreen onDone={()=>setLoading(false)} />;

  return (
    <div style={{ display:"flex", width:"100%", minHeight:720, background:C.bg, fontFamily:"'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        @keyframes beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius:4px; }
        input::placeholder { color: ${C.textLo}; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width:220, flexShrink:0, background:C.surface,
        borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"20px 0" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 20px", marginBottom:32 }}>
          <NabdLogo size={30} />
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:C.textHi,
            background:`linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Nabd Space
          </span>
        </div>

        {/* Nav */}
        <nav style={{ display:"flex", flexDirection:"column", gap:2, padding:"0 12px" }}>
          {NAV.map(n => {
            const Icon = n.icon;
            const active = tab === n.key;
            return (
              <button key={n.key} onClick={()=>setTab(n.key)}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"9px 12px", borderRadius:10, border:"none", cursor:"pointer",
                  background: active ? `linear-gradient(135deg, ${C.lavDim}55, ${C.pink}33)` : "transparent",
                  color: active ? C.lavSoft : C.textLo,
                  fontSize:13, fontWeight: active ? 600 : 400,
                  borderLeft: active ? `2px solid ${C.lavender}` : "2px solid transparent",
                  transition:"all .15s",
                }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background=C.surfaceHi; e.currentTarget.style.color=C.textMid; }}}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.textLo; }}}
              >
                <Icon size={16} strokeWidth={2} />
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ marginTop:"auto", padding:"0 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
            borderRadius:10, background:C.surfaceHi, border:`1px solid ${C.border}` }}>
            <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
              background:`linear-gradient(135deg, ${C.lavender}, ${C.pink})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:800, color:"#fff" }}>HR</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.textHi }}>HR Admin</div>
              <div style={{ fontSize:10, color:C.textLo }}>admin@nabdspace.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"16px 32px", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <div>
            <h1 style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:20,
              color:C.textHi, margin:0 }}>{title}</h1>
            <div style={{ fontSize:11, color:C.textLo, marginTop:4, display:"flex", alignItems:"center", gap:5 }}>
              <Calendar size={11}/> Last updated today at 9:00 AM
            </div>
          </div>
          <button style={{ width:36, height:36, borderRadius:"50%", background:C.surfaceHi,
            border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", color:C.textLo }}>
            <Bell size={15}/>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:"auto", padding:28 }}>
          {tab==="dashboard" && <DashboardTab onSelectTeam={name=>{ setSelectedTeam(name); setTab("team"); }}/>}
          {tab==="team"      && <TeamWellbeingTab selected={selectedTeam} setSelected={setSelectedTeam}/>}
          {tab==="analytics" && <AnalyticsTab/>}
          {tab==="programs"  && (
            <div className="grid grid-cols-2 gap-4">
              {sessions.map(s=>(
                <div key={s.title} style={{ background:C.surface, border:`1px solid ${C.border}`,
                  borderRadius:16, padding:20, display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:13, fontWeight:700, color:C.textHi }}>{s.title}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20,
                      background:"#0D2A20", color:C.green }}>{s.spots}</span>
                  </div>
                  <div style={{ display:"flex", gap:16, fontSize:11, color:C.textLo }}>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}><Calendar size={11}/>{s.time}</span>
                    <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                      {s.mode==="Virtual" ? <Video size={11}/> : <MapPin size={11}/>}{s.location}
                    </span>
                  </div>
                  <button style={{ alignSelf:"flex-start", fontSize:11, fontWeight:700, color:C.lavender,
                    background:"none", border:"none", cursor:"pointer", padding:0, marginTop:4 }}>
                    Manage session →
                  </button>
                </div>
              ))}
            </div>
          )}
          {tab==="settings" && (
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
              padding:28, maxWidth:480 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.textHi, marginBottom:4 }}>Settings</div>
              <div style={{ fontSize:12, color:C.textLo, marginBottom:20 }}>Manage your HR admin preferences</div>
              {["Notification preferences","Data export","Team thresholds","Integrations"].map(item=>(
                <div key={item} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                  padding:"13px 0", borderBottom:`1px solid ${C.borderLo}`, cursor:"pointer" }}>
                  <span style={{ fontSize:13, color:C.textMid }}>{item}</span>
                  <ChevronRight size={14} style={{ color:C.textLo }}/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
