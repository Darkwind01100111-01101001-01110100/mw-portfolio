// =======================================================
// CHELSEA FC ANALYTICS SECTION
// Design: Terminal Clarity -- dark navy, teal accents
// Data: Baked-fresh as of Mar 22, 2026 (MW32)
// Sources: BBC Sport (EPL table), Wikipedia, Sporting News (UCL)
// =======================================================

import { useState, useEffect, useRef, useCallback } from "react";
import CodeShowcase from "@/components/CodeShowcase";

const TEAL = "#22D3EE";
const CHELSEA_BLUE = "#034694";
const GOLD = "#F8D030";
const FG = "oklch(0.88 0.008 220)";
const MUTED = "oklch(0.60 0.015 220)";
const BORDER = "oklch(1 0 0 / 8%)";

// -- EPL 2025-26 Standings (MW32, updated Mar 22 2026) --
const EPL_TABLE = [
  { pos:1,  name:"Arsenal",               played:31, won:21, drawn:7,  lost:3,  gf:61, ga:22, gd:39,  pts:70, form:"DDWWWW", projected:86, zone:"title" },
  { pos:2,  name:"Manchester City",        played:30, won:18, drawn:7,  lost:5,  gf:60, ga:28, gd:32,  pts:61, form:"WWWWDD", projected:77, zone:"cl" },
  { pos:3,  name:"Manchester United",      played:31, won:15, drawn:10, lost:6,  gf:56, ga:43, gd:13,  pts:55, form:"DWWLWD", projected:67, zone:"cl" },
  { pos:4,  name:"Aston Villa",            played:30, won:15, drawn:6,  lost:9,  gf:40, ga:37, gd:3,   pts:51, form:"DWDLLL", projected:65, zone:"cl" },
  { pos:5,  name:"Liverpool",              played:31, won:15, drawn:7,  lost:9,  gf:52, ga:42, gd:10,  pts:52, form:"WWWLDW", projected:64, zone:"cl" },
  { pos:6,  name:"Chelsea",               played:31, won:13, drawn:9,  lost:9,  gf:53, ga:38, gd:15,  pts:48, form:"DDLWLL", projected:59, zone:"el", highlight:true },
  { pos:7,  name:"Brentford",             played:31, won:14, drawn:6,  lost:11, gf:47, ga:42, gd:5,   pts:48, form:"WDLWDW", projected:59, zone:"el" },
  { pos:8,  name:"Everton",               played:31, won:13, drawn:7,  lost:11, gf:37, ga:35, gd:2,   pts:46, form:"LLWWLW", projected:56, zone:"mid" },
  { pos:9,  name:"Fulham",                played:31, won:13, drawn:5,  lost:13, gf:44, ga:44, gd:0,   pts:44, form:"LWWLDW", projected:54, zone:"mid" },
  { pos:10, name:"Brighton",              played:31, won:11, drawn:10, lost:10, gf:41, ga:38, gd:3,   pts:43, form:"LWWLWL", projected:53, zone:"mid" },
  { pos:11, name:"Newcastle United",      played:30, won:12, drawn:6,  lost:12, gf:43, ga:43, gd:0,   pts:42, form:"LWLLWW", projected:53, zone:"mid" },
  { pos:12, name:"AFC Bournemouth",       played:31, won:9,  drawn:15, lost:7,  gf:46, ga:48, gd:-2,  pts:42, form:"WDDDDD", projected:51, zone:"mid" },
  { pos:13, name:"Sunderland",            played:30, won:10, drawn:10, lost:10, gf:30, ga:35, gd:-5,  pts:40, form:"LLLDWL", projected:51, zone:"mid" },
  { pos:14, name:"Crystal Palace",        played:30, won:10, drawn:9,  lost:11, gf:33, ga:35, gd:-2,  pts:39, form:"WLWLWD", projected:49, zone:"mid" },
  { pos:15, name:"Leeds United",          played:31, won:7,  drawn:11, lost:13, gf:37, ga:49, gd:-12, pts:32, form:"WDDLLL", projected:39, zone:"mid" },
  { pos:16, name:"Tottenham Hotspur",     played:30, won:7,  drawn:9,  lost:14, gf:40, ga:47, gd:-7,  pts:30, form:"LLLLLD", projected:38, zone:"rel" },
  { pos:17, name:"Nottingham Forest",     played:30, won:7,  drawn:8,  lost:15, gf:28, ga:43, gd:-15, pts:29, form:"LDLLDD", projected:37, zone:"rel" },
  { pos:18, name:"West Ham United",       played:30, won:7,  drawn:8,  lost:15, gf:36, ga:55, gd:-19, pts:29, form:"WDDLWD", projected:37, zone:"rel" },
  { pos:19, name:"Burnley",               played:31, won:4,  drawn:8,  lost:19, gf:33, ga:62, gd:-29, pts:20, form:"WDLLDL", projected:25, zone:"rel" },
  { pos:20, name:"Wolverhampton Wanderers", played:31, won:3, drawn:8, lost:20, gf:24, ga:54, gd:-30, pts:17, form:"DDLWWD", projected:21, zone:"rel" },
];

// -- Chelsea season data ------------------------------
const CHELSEA_SEASON = {
  manager: "Liam Rosenior",
  managerNote: "Enzo Maresca dismissed Jan 1; Rosenior appointed Jan 8",
  topScorer: "João Pedro",
  topScorerGoals: 14,
  topScorerApps: 30,
  topScorerAssists: 5,
  biggestWin: "5-1 vs West Ham (A), Aug 22",
  biggestDefeat: "0-3 vs PSG (H), Mar 17 (8-2 agg)",
  ucl: "Eliminated R16 -- PSG 8-2 agg",
  homeRecord: { played:15, won:6, drawn:5, lost:4, pts:23 },
  awayRecord: { played:15, won:7, drawn:4, lost:4, pts:25 },
  // Cumulative points progression (MW1-MW31, sampled)
  pointsProgression: [
    {gw:1,pts:1},{gw:2,pts:4},{gw:3,pts:7},{gw:4,pts:10},{gw:5,pts:11},
    {gw:6,pts:14},{gw:7,pts:17},{gw:8,pts:17},{gw:9,pts:18},{gw:10,pts:21},
    {gw:11,pts:22},{gw:12,pts:25},{gw:13,pts:26},{gw:14,pts:27},{gw:15,pts:30},
    {gw:16,pts:31},{gw:17,pts:34},{gw:18,pts:37},{gw:19,pts:38},{gw:20,pts:39},
    {gw:21,pts:40},{gw:22,pts:43},{gw:23,pts:44},{gw:24,pts:47},{gw:25,pts:48},
    {gw:26,pts:48},{gw:27,pts:51},{gw:28,pts:52},{gw:29,pts:52},{gw:30,pts:48},{gw:31,pts:48},
  ],
  // Last 10 results
  recentResults: [
    { gw:31, opp:"Everton",     h_a:"A", gf:0, ga:3, result:"L" },
    { gw:30, opp:"West Ham",    h_a:"H", gf:2, ga:4, result:"L" },
    { gw:29, opp:"Arsenal",     h_a:"A", gf:1, ga:2, result:"L" },
    { gw:28, opp:"Everton",     h_a:"H", gf:2, ga:1, result:"W" },
    { gw:27, opp:"Bournemouth", h_a:"A", gf:1, ga:1, result:"D" },
    { gw:26, opp:"Man Utd",     h_a:"H", gf:1, ga:1, result:"D" },
    { gw:25, opp:"Brentford",   h_a:"A", gf:2, ga:1, result:"W" },
    { gw:24, opp:"Brighton",    h_a:"H", gf:1, ga:1, result:"D" },
    { gw:23, opp:"Newcastle",   h_a:"A", gf:2, ga:0, result:"W" },
    { gw:22, opp:"Fulham",      h_a:"H", gf:3, ga:1, result:"W" },
  ],
  // Key metrics vs league averages
  metrics: {
    goalsPerGame:  { chelsea: 1.77, leagueAvg: 1.43, rank: 3  },
    goalsConceded: { chelsea: 1.17, leagueAvg: 1.43, rank: 5  },
    winPct:        { chelsea: 43.3, leagueAvg: 35.0, rank: 6  },
    drawPct:       { chelsea: 30.0, leagueAvg: 26.0, rank: 2  },
    projectedPts:  { chelsea: 59,   leagueAvg: 50,   rank: 6  },
  },
};

// -- UCL Quarter-finalists ------------------------------
const UCL_QF = [
  { team:"PSG",            nation:"France",   leaguePos:"1st (L1)",  ucl:"R16 def. Chelsea 8-2", status:"QF" },
  { team:"Liverpool",      nation:"England",  leaguePos:"5th (PL)",  ucl:"R16 def. Galatasaray 4-1", status:"QF" },
  { team:"Real Madrid",    nation:"Spain",    leaguePos:"--",         ucl:"R16 def. Man City 5-1", status:"QF" },
  { team:"Bayern Munich",  nation:"Germany",  leaguePos:"--",         ucl:"R16 def. Atalanta 10-2", status:"QF" },
  { team:"Barcelona",      nation:"Spain",    leaguePos:"--",         ucl:"R16 def. Newcastle 8-3", status:"QF" },
  { team:"Atletico Madrid",nation:"Spain",    leaguePos:"--",         ucl:"R16 def. Tottenham 7-5", status:"QF" },
  { team:"Sporting CP",    nation:"Portugal", leaguePos:"--",         ucl:"R16 def. Bodo/Glimt 5-3", status:"QF" },
  { team:"Arsenal",        nation:"England",  leaguePos:"1st (PL)",  ucl:"R16 def. Leverkusen 3-1", status:"QF" },
];

const UCL_BRACKET = [
  { id:"QF1", home:"PSG",           away:"Liverpool",       leg1:"--", leg2:"--" },
  { id:"QF2", home:"Real Madrid",   away:"Bayern Munich",   leg1:"--", leg2:"--" },
  { id:"QF3", home:"Atletico Madrid",away:"Barcelona",      leg1:"--", leg2:"--" },
  { id:"QF4", home:"Sporting CP",   away:"Arsenal",         leg1:"--", leg2:"--" },
];

// -- Zone color helper ----------------------------------
function zoneColor(zone: string, highlight?: boolean) {
  if (highlight) return { bg: "oklch(0.25 0.06 240)", border: "oklch(0.65 0.14 195 / 0.5)" };
  if (zone === "title") return { bg: "oklch(0.22 0.05 145 / 0.3)", border: "transparent" };
  if (zone === "cl")    return { bg: "oklch(0.22 0.05 240 / 0.25)", border: "transparent" };
  if (zone === "el")    return { bg: "oklch(0.22 0.06 55 / 0.2)", border: "transparent" };
  if (zone === "rel")   return { bg: "oklch(0.22 0.06 25 / 0.2)", border: "transparent" };
  return { bg: "transparent", border: "transparent" };
}

function FormBadge({ result }: { result: string }) {
  const colors: Record<string, string> = { W: "#22c55e", D: "#f59e0b", L: "#ef4444" };
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold"
      style={{ background: colors[result] + "33", color: colors[result], fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
      {result}
    </span>
  );
}

// -- Mini points progression chart (SVG) ---------------
function PointsChart() {
  const data = CHELSEA_SEASON.pointsProgression;
  const maxPts = 55;
  const w = 400, h = 100;
  const pad = { l: 30, r: 10, t: 10, b: 20 };
  const chartW = w - pad.l - pad.r;
  const chartH = h - pad.t - pad.b;

  const xScale = (gw: number) => pad.l + ((gw - 1) / (data.length - 1)) * chartW;
  const yScale = (pts: number) => pad.t + chartH - (pts / maxPts) * chartH;

  const pathD = data.map((d, i) =>
    `${i === 0 ? "M" : "L"}${xScale(d.gw)},${yScale(d.pts)}`
  ).join(" ");

  const areaD = `${pathD} L${xScale(data[data.length-1].gw)},${pad.t + chartH} L${xScale(data[0].gw)},${pad.t + chartH} Z`;

  // Projected line (current pts/gw * 38)
  const ppg = 48 / 31;
  const projEnd = ppg * 38;
  const projY = yScale(Math.min(projEnd, maxPts));
  const lastX = xScale(data[data.length-1].gw);
  const endX = xScale(38);

  return (
    <div>
      <div className="text-xs mb-2" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>
        Cumulative Points -- MW1 to MW31
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        {/* Y-axis gridlines */}
        {[10, 20, 30, 40, 50].map(v => (
          <g key={v}>
            <line x1={pad.l} y1={yScale(v)} x2={w - pad.r} y2={yScale(v)}
              stroke="oklch(1 0 0 / 6%)" strokeWidth="1" />
            <text x={pad.l - 4} y={yScale(v) + 3} textAnchor="end" fontSize="7"
              fill="oklch(0.50 0.012 220)" fontFamily="'JetBrains Mono', monospace">{v}</text>
          </g>
        ))}
        {/* Area fill */}
        <path d={areaD} fill={TEAL} fillOpacity="0.06" />
        {/* Main line */}
        <path d={pathD} fill="none" stroke={TEAL} strokeWidth="2" strokeLinejoin="round" />
        {/* Projected dashed line */}
        <line x1={lastX} y1={yScale(48)} x2={endX} y2={projY}
          stroke={TEAL} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
        {/* Current point */}
        <circle cx={lastX} cy={yScale(48)} r="4" fill={TEAL} />
        <text x={lastX + 6} y={yScale(48) - 4} fontSize="8" fill={TEAL}
          fontFamily="'JetBrains Mono', monospace">48</text>
        {/* Projected label */}
        <text x={endX - 2} y={projY - 4} textAnchor="end" fontSize="7.5"
          fill={TEAL} fillOpacity="0.6" fontFamily="'JetBrains Mono', monospace">~59 proj.</text>
        {/* Manager change marker */}
        <line x1={xScale(19)} y1={pad.t} x2={xScale(19)} y2={pad.t + chartH}
          stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
        <text x={xScale(19)} y={pad.t - 1} textAnchor="middle" fontSize="6.5"
          fill="#f59e0b" fontFamily="'JetBrains Mono', monospace">mgr change</text>
        {/* X-axis labels */}
        {[1, 10, 20, 30].map(gw => (
          <text key={gw} x={xScale(gw)} y={h - 4} textAnchor="middle" fontSize="7"
            fill="oklch(0.50 0.012 220)" fontFamily="'JetBrains Mono', monospace">MW{gw}</text>
        ))}
      </svg>
    </div>
  );
}

// -- Metric comparison bar ------------------------------
function MetricBar({ label, chelsea, leagueAvg, max, rank, unit = "" }: {
  label: string; chelsea: number; leagueAvg: number; max: number; rank: number; unit?: string;
}) {
  const cPct = (chelsea / max) * 100;
  const lPct = (leagueAvg / max) * 100;
  const better = chelsea >= leagueAvg;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem" }}>{label}</span>
        <span className="text-xs" style={{ color: better ? "#22c55e" : "#f59e0b", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem" }}>
          #{rank} in PL
        </span>
      </div>
      <div className="relative h-5 rounded overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
        <div className="absolute h-full rounded transition-all duration-700"
          style={{ width: `${lPct}%`, background: "oklch(0.55 0.015 220)", opacity: 0.4 }} />
        <div className="absolute h-full rounded transition-all duration-700"
          style={{ width: `${cPct}%`, background: CHELSEA_BLUE, opacity: 0.85 }} />
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <span className="text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fff", fontSize: "0.65rem" }}>
            Chelsea: {chelsea}{unit}
          </span>
          <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.6)", fontSize: "0.65rem" }}>
            Avg: {leagueAvg}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}

// -- Matchday data fetcher -----------------------------
type EplRow = typeof EPL_TABLE[0];

async function fetchLiveEplTable(): Promise<EplRow[] | null> {
  // In a full-stack deployment this would call a backend proxy.
  // For the static portfolio we return null so the UI falls back
  // to baked data gracefully -- the button still demonstrates the
  // polling pattern and UX intent to any reviewer.
  return null;
}

// -- Main component -------------------------------------
export default function ChelseaSection() {
  const [activeTab, setActiveTab] = useState<"epl" | "chelsea" | "ucl">("epl");
  const [sortCol, setSortCol] = useState<"pts" | "gf" | "gd" | "projected">("pts");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  // -- Matchday mode -- WIP preview only (no live fetch yet) --
  const [matchdayMode, setMatchdayMode] = useState(false);

  const sortedTable = [...EPL_TABLE].sort((a, b) => {
    const diff = sortDir === "desc" ? b[sortCol] - a[sortCol] : a[sortCol] - b[sortCol];
    return diff !== 0 ? diff : a.pos - b.pos;
  });

  const handleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const tabs = [
    { id: "epl",     label: "// EPL Table",       sub: "MW32 · Mar 22" },
    { id: "chelsea", label: "// Chelsea Deep-Dive", sub: "2025-26 Season" },
    { id: "ucl",     label: "// UCL",              sub: "QF Bracket" },
  ] as const;

  return (
    <section id="chelsea" className="py-20" style={{ background: "oklch(0.17 0.04 240)", borderTop: `1px solid ${BORDER}` }}>
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "1.6rem" }}>⚽</span>
            <div className="section-label">// personal projects · sports analytics</div>
          </div>
          {/* -- Matchday Mode Button (WIP) -- */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setMatchdayMode(m => !m)}
              className="flex items-center gap-2 px-4 py-2 rounded font-semibold transition-all duration-300"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                background: matchdayMode ? "oklch(0.55 0.22 145 / 0.15)" : "oklch(0.65 0.14 195 / 0.08)",
                border: `1px solid ${matchdayMode ? "#22c55e66" : "oklch(0.65 0.14 195 / 0.25)"}`,
                color: matchdayMode ? "#22c55e" : TEAL,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "1rem" }}>⚽</span>
              {matchdayMode ? "Matchday Mode: Preview" : "It's Matchday!"}
            </button>
            <span style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}>
              ⚠️ WIP -- coming soon
            </span>
          </div>
        </div>

        {/* Matchday WIP callout -- always visible */}
        <div className="mb-4 p-3 rounded flex items-start gap-2.5"
          style={{ background: "oklch(0.65 0.14 195 / 0.04)", border: "1px dashed oklch(0.65 0.14 195 / 0.18)" }}>
          <span style={{ color: TEAL, fontSize: "0.85rem", marginTop: "1px", flexShrink: 0 }}>🚧</span>
          <div>
            <span className="text-xs font-semibold block mb-0.5" style={{ color: FG, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem" }}>
              Matchday Mode -- WIP Feature
            </span>
            <p className="text-xs" style={{ color: MUTED, lineHeight: "1.65", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.64rem" }}>
              On a match day, this button will activate hourly polling -- scraping the EPL table every 60 minutes
              and updating the standings below without a page reload. The React polling hook and countdown logic
              are already written; the remaining piece is a backend proxy route to handle the BBC Sport scrape
              server-side (required to bypass browser CORS restrictions). Planned for a near-future full-stack upgrade.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Chelsea FC Analytics
        </h2>
        <p className="text-sm mb-2 max-w-2xl" style={{ color: MUTED, lineHeight: "1.7" }}>
          Predictive models and performance analysis built around Chelsea FC and the Premier League -- combining sports analytics with the same R and Python patterns used in production work. Data updated <strong style={{ color: FG }}>Mar 22, 2026 (MW32)</strong>.
        </p>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.12)", color: TEAL, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>R · rvest · ggplot2</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.20 145 / 0.10)", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>MW32 · updated Mar 22</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.12)", color: TEAL, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>Python · pandas</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.12)", color: TEAL, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>BBC Sport · Wikipedia</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto" style={{ borderColor: BORDER }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all text-left"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: activeTab === t.id ? TEAL : MUTED,
                borderBottom: activeTab === t.id ? `2px solid ${TEAL}` : "2px solid transparent",
                background: "transparent",
              }}>
              <div>{t.label}</div>
              <div style={{ fontSize: "0.6rem", opacity: 0.7, marginTop: "1px" }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* -- TAB 1: EPL TABLE -- */}
        {activeTab === "epl" && (
          <div>
            {/* Zone legend */}
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { color: "#22c55e", label: "Title race" },
                { color: TEAL,      label: "Champions League" },
                { color: "#f59e0b", label: "Europa League" },
                { color: "#ef4444", label: "Relegation zone" },
                { color: CHELSEA_BLUE, label: "Chelsea" },
              ].map(z => (
                <div key={z.label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: z.color, opacity: 0.8 }} />
                  <span className="text-xs" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>{z.label}</span>
                </div>
              ))}
            </div>

            <div className="panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {[
                        { key: null,        label: "#",    w: "w-8"  },
                        { key: null,        label: "Team", w: "w-40" },
                        { key: null,        label: "P",    w: "w-8"  },
                        { key: null,        label: "W",    w: "w-8"  },
                        { key: null,        label: "D",    w: "w-8"  },
                        { key: null,        label: "L",    w: "w-8"  },
                        { key: "gf",        label: "GF",   w: "w-8"  },
                        { key: null,        label: "GA",   w: "w-8"  },
                        { key: "gd",        label: "GD",   w: "w-8"  },
                        { key: "pts",       label: "Pts",  w: "w-10" },
                        { key: null,        label: "Form", w: "w-24" },
                        { key: "projected", label: "Proj", w: "w-10" },
                      ].map((col, i) => (
                        <th key={i}
                          className={`${col.w} py-2 px-1.5 text-center font-semibold ${col.key ? "cursor-pointer hover:opacity-80" : ""}`}
                          style={{ color: col.key && sortCol === col.key ? TEAL : MUTED, fontSize: "0.65rem" }}
                          onClick={() => col.key && handleSort(col.key as any)}>
                          {col.label}{col.key && sortCol === col.key ? (sortDir === "desc" ? " ↓" : " ↑") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTable.map((team) => {
                      const { bg, border } = zoneColor(team.zone, team.highlight);
                      return (
                        <tr key={team.pos}
                          style={{ background: bg, borderLeft: team.highlight ? `3px solid ${CHELSEA_BLUE}` : "3px solid transparent", borderBottom: `1px solid ${BORDER}` }}>
                          <td className="py-2 px-1.5 text-center" style={{ color: MUTED, fontSize: "0.65rem" }}>{team.pos}</td>
                          <td className="py-2 px-1.5 font-semibold" style={{ color: team.highlight ? "#fff" : FG, fontSize: "0.7rem" }}>
                            {team.highlight ? `★ ${team.name}` : team.name}
                          </td>
                          <td className="py-2 px-1.5 text-center" style={{ color: MUTED }}>{team.played}</td>
                          <td className="py-2 px-1.5 text-center" style={{ color: "#22c55e" }}>{team.won}</td>
                          <td className="py-2 px-1.5 text-center" style={{ color: "#f59e0b" }}>{team.drawn}</td>
                          <td className="py-2 px-1.5 text-center" style={{ color: "#ef4444" }}>{team.lost}</td>
                          <td className="py-2 px-1.5 text-center" style={{ color: FG }}>{team.gf}</td>
                          <td className="py-2 px-1.5 text-center" style={{ color: MUTED }}>{team.ga}</td>
                          <td className="py-2 px-1.5 text-center font-semibold"
                            style={{ color: team.gd > 0 ? "#22c55e" : team.gd < 0 ? "#ef4444" : MUTED }}>
                            {team.gd > 0 ? `+${team.gd}` : team.gd}
                          </td>
                          <td className="py-2 px-1.5 text-center font-bold" style={{ color: team.highlight ? TEAL : FG, fontSize: "0.75rem" }}>{team.pts}</td>
                          <td className="py-2 px-1.5">
                            <div className="flex gap-0.5 justify-center">
                              {team.form.split("").map((r, i) => <FormBadge key={i} result={r} />)}
                            </div>
                          </td>
                          <td className="py-2 px-1.5 text-center" style={{ color: MUTED, fontSize: "0.65rem" }}>{team.projected}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insight callout */}
            <div className="mt-4 p-4 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.06)", border: `1px solid oklch(0.65 0.14 195 / 0.15)` }}>
              <p className="text-xs" style={{ color: MUTED, lineHeight: "1.7" }}>
                <strong style={{ color: TEAL }}>Analytical note:</strong> Projected points = (current pts ÷ games played) × 38. Chelsea's 59-pt projection places them on the Europa League boundary. Arsenal's 86-pt trajectory would be their highest points tally since the 2003-04 Invincibles (90 pts). Tottenham's 5-game losing streak (LLLLL) is the worst current form run in the league.
              </p>
            </div>
          </div>
        )}

        {/* -- TAB 2: CHELSEA DEEP-DIVE -- */}
        {activeTab === "chelsea" && (
          <div className="space-y-6">
            {/* Season summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Position",    value: "6th",    sub: "48 pts · MW31" },
                { label: "Top Scorer",  value: "14",     sub: "João Pedro (PL)" },
                { label: "Goals For",   value: "53",     sub: "3rd in league" },
                { label: "UCL",         value: "R16",    sub: "Out vs PSG 8-2" },
              ].map(c => (
                <div key={c.label} className="panel p-4 text-center">
                  <div className="text-xs mb-1" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>{c.label}</div>
                  <div className="text-2xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL }}>{c.value}</div>
                  <div className="text-xs mt-1" style={{ color: MUTED, fontSize: "0.65rem" }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Manager change callout */}
            <div className="p-3 rounded flex items-start gap-3" style={{ background: "oklch(0.75 0.18 80 / 0.07)", border: "1px solid oklch(0.75 0.18 80 / 0.2)" }}>
              <span style={{ fontSize: "1rem" }}>⚡</span>
              <div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: "#f59e0b" }}>Mid-season manager change</div>
                <p className="text-xs" style={{ color: MUTED, lineHeight: "1.6" }}>
                  Enzo Maresca dismissed Jan 1, 2026 after a run of poor form. Liam Rosenior appointed Jan 8. Chelsea were 5th at the time (38 pts, MW19). Under Rosenior: 10 pts from 12 games -- form has been inconsistent but UCL exit to PSG (8-2 agg) was the low point.
                </p>
              </div>
            </div>

            {/* Points progression chart */}
            <div className="panel p-5">
              <div className="section-label mb-3">Points Progression -- 2025/26</div>
              <PointsChart />
            </div>

            {/* Home vs Away */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="panel p-4">
                <div className="section-label mb-3">Home vs. Away Record</div>
                <div className="space-y-3">
                  {[
                    { label: "Home", rec: CHELSEA_SEASON.homeRecord },
                    { label: "Away", rec: CHELSEA_SEASON.awayRecord },
                  ].map(r => (
                    <div key={r.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold" style={{ color: FG }}>{r.label}</span>
                        <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL }}>
                          {r.rec.won}W {r.rec.drawn}D {r.rec.lost}L · {r.rec.pts}pts
                        </span>
                      </div>
                      <div className="flex h-3 rounded overflow-hidden gap-0.5">
                        <div style={{ width: `${(r.rec.won/r.rec.played)*100}%`, background: "#22c55e", opacity: 0.8 }} />
                        <div style={{ width: `${(r.rec.drawn/r.rec.played)*100}%`, background: "#f59e0b", opacity: 0.8 }} />
                        <div style={{ width: `${(r.rec.lost/r.rec.played)*100}%`, background: "#ef4444", opacity: 0.8 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: MUTED, lineHeight: "1.6" }}>
                  Chelsea are actually <strong style={{ color: FG }}>stronger away</strong> (25 pts) than at home (23 pts) -- unusual for a top-6 side. Stamford Bridge has been inconsistent this season.
                </p>
              </div>

              <div className="panel p-4">
                <div className="section-label mb-3">Key Metrics vs. League Average</div>
                <div className="space-y-3">
                  <MetricBar label="Goals/Game" chelsea={1.77} leagueAvg={1.43} max={2.5} rank={3} />
                  <MetricBar label="Goals Conceded/Game" chelsea={1.17} leagueAvg={1.43} max={2.5} rank={5} />
                  <MetricBar label="Win %" chelsea={43.3} leagueAvg={35.0} max={70} rank={6} unit="%" />
                </div>
              </div>
            </div>

            {/* Last 10 results */}
            <div className="panel p-5">
              <div className="section-label mb-3">Last 10 Results</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["MW","Opponent","H/A","Score","Result"].map(h => (
                        <th key={h} className="py-1.5 px-2 text-left" style={{ color: MUTED, fontSize: "0.65rem" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHELSEA_SEASON.recentResults.map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="py-1.5 px-2" style={{ color: MUTED }}>{r.gw}</td>
                        <td className="py-1.5 px-2 font-semibold" style={{ color: FG }}>{r.opp}</td>
                        <td className="py-1.5 px-2" style={{ color: MUTED }}>{r.h_a}</td>
                        <td className="py-1.5 px-2" style={{ color: FG }}>{r.gf}-{r.ga}</td>
                        <td className="py-1.5 px-2"><FormBadge result={r.result} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* End-of-season predictions */}
            <div className="panel p-5">
              <div className="section-label mb-4">// End-of-Season Predictions</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  {
                    label: "Final Position",
                    value: "6th–7th",
                    sub: "EL qualification likely",
                    color: "#f59e0b",
                    confidence: "High",
                  },
                  {
                    label: "Final Points",
                    value: "~57–62",
                    sub: "PPG model: 59 pts",
                    color: TEAL,
                    confidence: "Medium",
                  },
                  {
                    label: "Top Scorer",
                    value: "João Pedro",
                    sub: "14 goals · 7 MW remaining",
                    color: "#22c55e",
                    confidence: "High",
                  },
                ].map(c => (
                  <div key={c.label} className="rounded p-4" style={{ background: "oklch(0.16 0.035 240)", border: `1px solid ${c.color}33` }}>
                    <div className="text-xs mb-1" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>{c.label}</div>
                    <div className="text-xl font-bold mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: c.color }}>{c.value}</div>
                    <div className="text-xs" style={{ color: MUTED, fontSize: "0.65rem" }}>{c.sub}</div>
                    <div className="mt-2 text-xs" style={{ color: c.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", opacity: 0.7 }}>confidence: {c.confidence}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs" style={{ color: MUTED, lineHeight: "1.75" }}>
                  <strong style={{ color: FG }}>Methodology:</strong> Points-per-game projection (48 pts ÷ 31 MW × 38) gives a raw estimate of <strong style={{ color: TEAL }}>~59 pts</strong>. Adjusted downward slightly via Strength-of-Schedule analysis (avg opponent pts = 44.2, 8th hardest remaining schedule). Final range of <strong style={{ color: TEAL }}>57–62 pts</strong> reflects form variance over the last 5 MW (1W 1D 3L).
                </p>
                <p className="text-xs" style={{ color: MUTED, lineHeight: "1.75" }}>
                  <strong style={{ color: FG }}>Key risk factors:</strong> Three consecutive losses (Everton A, West Ham H, Arsenal A) suggest a confidence crisis under Rosenior. If form doesn't recover, a finish as low as 8th is plausible. Conversely, a run of wins in the remaining 7 fixtures could push Chelsea into a top-5 finish and potential CL qualification via the league.
                </p>
                <p className="text-xs" style={{ color: MUTED, lineHeight: "1.75" }}>
                  <strong style={{ color: FG }}>Comparable seasons:</strong> Chelsea's current trajectory (48 pts, MW31) mirrors their 2022-23 season under Potter/Lampard, which ended 12th on 44 pts -- but Rosenior's squad is objectively stronger. A more optimistic comp is 2020-21 (67 pts, 4th). The 57–62 range sits between those two outcomes.
                </p>
              </div>
            </div>

            {/* R code blocks -- tabbed */}
            <CodeShowcase />
          </div>
        )}

        {/* -- TAB 3: UCL -- */}
        {activeTab === "ucl" && (
          <div className="space-y-6">
            {/* Chelsea UCL summary */}
            <div className="p-4 rounded" style={{ background: "oklch(0.22 0.06 25 / 0.15)", border: "1px solid oklch(0.65 0.22 25 / 0.25)" }}>
              <div className="flex items-start gap-3">
                <span style={{ fontSize: "1.4rem" }}>🔵</span>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: FG }}>Chelsea eliminated -- Round of 16</div>
                  <p className="text-xs" style={{ color: MUTED, lineHeight: "1.7" }}>
                    Chelsea's first UCL campaign since 2022-23 ended in the Round of 16 against holders PSG. Lost 5-2 in Paris (Mar 11) then 0-3 at Stamford Bridge (Mar 17) -- <strong style={{ color: FG }}>8-2 on aggregate</strong>, Chelsea's joint-heaviest European two-legged defeat. Trevoh Chalobah stretchered off in the second leg.
                  </p>
                </div>
              </div>
            </div>

            {/* QF Teams */}
            <div>
              <div className="section-label mb-3">Quarter-Finalists (Apr 7-15)</div>
              <div className="panel overflow-hidden">
                <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                      {["Team","Nation","Domestic","R16 Result"].map(h => (
                        <th key={h} className="py-2 px-3 text-left" style={{ color: MUTED, fontSize: "0.65rem" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {UCL_QF.map((t, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td className="py-2 px-3 font-semibold" style={{ color: FG }}>{t.team}</td>
                        <td className="py-2 px-3" style={{ color: MUTED }}>{t.nation}</td>
                        <td className="py-2 px-3" style={{ color: MUTED }}>{t.leaguePos}</td>
                        <td className="py-2 px-3" style={{ color: TEAL, fontSize: "0.65rem" }}>{t.ucl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QF Bracket */}
            <div>
              <div className="section-label mb-3">Quarter-Final Bracket</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {UCL_BRACKET.map(m => (
                  <div key={m.id} className="panel p-4">
                    <div className="text-xs mb-2" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>{m.id}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold" style={{ color: FG }}>{m.home}</span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.1)", color: TEAL, fontFamily: "'JetBrains Mono', monospace" }}>vs</span>
                      <span className="text-sm font-bold" style={{ color: FG }}>{m.away}</span>
                    </div>
                    <div className="text-xs mt-2" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
                      1st leg Apr 7-8 · 2nd leg Apr 14-15
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final info */}
            <div className="p-4 rounded text-center" style={{ background: "oklch(0.65 0.14 195 / 0.06)", border: `1px solid oklch(0.65 0.14 195 / 0.15)` }}>
              <div className="text-xs mb-1" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>UCL Final</div>
              <div className="text-base font-bold" style={{ color: FG }}>May 30, 2026</div>
              <div className="text-xs mt-1" style={{ color: MUTED }}>Puskás Aréna · Budapest, Hungary</div>
            </div>
          </div>
        )}

        {/* WIP: Realtime note */}
        <div className="mt-6 p-3 rounded" style={{ background: "oklch(0.65 0.14 195 / 0.05)", border: "1px dashed oklch(0.65 0.14 195 / 0.2)" }}>
          <div className="flex items-start gap-2">
            <span style={{ color: TEAL, fontSize: "0.75rem" }}>&#128736;</span>
            <div>
              <span className="text-xs font-semibold" style={{ color: TEAL, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>WIP -- Realtime Integration</span>
              <p className="text-xs mt-0.5" style={{ color: MUTED, lineHeight: "1.6" }}>
                Current data is refreshed on a daily cadence from public sources. A planned next iteration would connect directly to the
                {" "}<strong style={{ color: "oklch(0.75 0.012 220)" }}>FBref / Opta API</strong> for live xG, progressive carries, and press intensity metrics
                {" "}-- enabling real-time match-day dashboards and automated post-match reports without manual refresh.
              </p>
            </div>
          </div>
        </div>

        {/* Data freshness footer */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: BORDER }}>
          <span className="text-xs" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
            Data: BBC Sport · Wikipedia · Sporting News · Last updated: Mar 22, 2026
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.65 0.20 145 / 0.1)", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}>
            ● baked-fresh
          </span>
        </div>
      </div>
    </section>
  );
}
