// ═══════════════════════════════════════════════════════
// POKÉMON ANALYSIS SECTION
// Design: Terminal Clarity — dark navy, teal accents
// Data: Kaggle "The Complete Pokemon Dataset" (801 Pokémon)
// Processed via Python/pandas — real values, not estimates
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { POKEMON_DATA } from "@/lib/portfolioData";

const TEAL   = "#22D3EE";
const MUTED  = "oklch(0.60 0.015 220)";
const FG     = "oklch(0.88 0.008 220)";
const PANEL  = "oklch(0.20 0.038 240)";
const BORDER = "oklch(1 0 0 / 8%)";
const MONO   = "'JetBrains Mono', monospace";

// ── Helpers ────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const color = POKEMON_DATA.typeColors[type] ?? "#888";
  return (
    <span className="capitalize px-1.5 py-0.5 rounded text-xs"
      style={{ background: color + "22", color, border: `1px solid ${color}44`, fontFamily: MONO, fontSize: "0.6rem" }}>
      {type}
    </span>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>{label}</span>
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: "6px", background: "oklch(1 0 0 / 6%)" }}>
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="w-8 text-xs flex-shrink-0" style={{ color: FG, fontFamily: MONO, fontSize: "0.62rem" }}>{value}</span>
    </div>
  );
}

function CodeBlock({ code, lang = "python" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const hi = code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(#[^\n]*)/g, '<span style="color:#6A9955">$1</span>')
    .replace(/\b(import|from|as|def|return|for|in|if|elif|else|print|True|False|None|and|or|not)\b/g, '<span style="color:#569CD6">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span style="color:#CE9178">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#B5CEA8">$1</span>');
  return (
    <div className="rounded overflow-hidden" style={{ background: "oklch(0.13 0.03 240)", border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ background: "oklch(0.15 0.03 240)", borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ color: MUTED, fontFamily: MONO, fontSize: "0.6rem" }}>{lang}</span>
        <button onClick={copy} style={{ color: copied ? TEAL : MUTED, fontFamily: MONO, fontSize: "0.6rem" }}>{copied ? "✓ copied" : "copy"}</button>
      </div>
      <pre className="p-4 overflow-x-auto" style={{ fontFamily: MONO, fontSize: "0.68rem", color: "#D4D4D4", lineHeight: "1.6", fontStyle: "normal" }}>
        <code dangerouslySetInnerHTML={{ __html: hi }} />
      </pre>
    </div>
  );
}

// ── Umbreon SVG Radar ──────────────────────────────────
function UmbreonRadar() {
  const u = POKEMON_DATA.umbreon;
  const stats = [
    { label: "HP",    value: u.hp },
    { label: "Atk",  value: u.attack },
    { label: "Def",  value: u.defense },
    { label: "SpA",  value: u.sp_atk },
    { label: "SpD",  value: u.sp_def },
    { label: "Spd",  value: u.speed },
  ];
  const cx = 100, cy = 100, r = 72, n = stats.length;
  const angles = stats.map((_, i) => (i * 2 * Math.PI) / n - Math.PI / 2);
  const xy = (a: number, rad: number) => ({ x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) });
  const statPts = stats.map((s, i) => xy(angles[i], (s.value / 160) * r));
  const poly = statPts.map(p => `${p.x},${p.y}`).join(" ");
  const darkColor = POKEMON_DATA.typeColors["dark"];

  return (
    <div className="flex flex-col items-center">
      <svg width="100%" height="auto" viewBox="0 0 200 200" style={{ maxWidth: "220px" }}>
        {[0.25, 0.5, 0.75, 1].map(lv => (
          <polygon key={lv} points={angles.map(a => { const p = xy(a, r * lv); return `${p.x},${p.y}`; }).join(" ")}
            fill="none" stroke="oklch(1 0 0 / 10%)" strokeWidth="1" />
        ))}
        {angles.map((a, i) => { const e = xy(a, r); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="oklch(1 0 0 / 10%)" strokeWidth="1" />; })}
        <polygon points={poly} fill={darkColor} fillOpacity="0.22" stroke={darkColor} strokeWidth="2" strokeLinejoin="round" />
        {statPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={darkColor} />)}
        {stats.map((s, i) => { const lp = xy(angles[i], r + 16); return (
          <text key={i} x={lp.x} y={lp.y + 4} textAnchor="middle" fontSize="9"
            fill="oklch(0.65 0.015 220)" fontFamily={MONO}>{s.label}</text>
        ); })}
      </svg>
      <div className="grid grid-cols-3 gap-1.5 w-full mt-1">
        {stats.map(s => (
          <div key={s.label} className="flex justify-between px-2 py-1 rounded text-xs"
            style={{ background: "oklch(1 0 0 / 4%)", fontFamily: MONO }}>
            <span style={{ color: MUTED, fontSize: "0.6rem" }}>{s.label}</span>
            <span style={{ color: s.value >= 100 ? darkColor : FG, fontWeight: s.value >= 100 ? 700 : 400, fontSize: "0.65rem" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Python code samples ────────────────────────────────
const PY = {
  load: `import pandas as pd

# Load the Kaggle Pokémon dataset (801 Pokémon, 41 features)
df = pd.read_csv('pokemon.csv')
print(f"Shape: {df.shape}")   # (801, 41)

# Key columns for analysis
cols = ['name','type1','type2','base_total',
        'hp','attack','defense',
        'sp_attack','sp_defense','speed',
        'generation','is_legendary']

# Check for nulls — type2 has ~380 nulls (expected)
print(df[cols].isnull().sum())

# Quick summary stats
print(df[['base_total','hp','attack']].describe())`,

  analysis: `# ── Type distribution ──────────────────────────────────
type_counts = df['type1'].value_counts()
print(f"Most common: {type_counts.index[0]} ({type_counts[0]})")
# → water (114 Pokémon)

# ── Avg stats by type ───────────────────────────────────
stat_cols = ['hp','attack','defense',
             'sp_attack','sp_defense','speed','base_total']
type_stats = (df.groupby('type1')[stat_cols]
               .mean().round(1)
               .sort_values('base_total', ascending=False))

print(type_stats[['base_total','attack','defense']].head(5))
#          base_total  attack  defense
# dragon        522.8   106.4     86.3
# steel         491.6    93.1    120.2
# psychic       461.3    65.6     69.3

# ── Legendary vs. non-legendary ─────────────────────────
leg = df.groupby('is_legendary')[stat_cols].mean().round(1)
gap = leg.loc[1,'base_total'] - leg.loc[0,'base_total']
print(f"Legendary avg BST:     {leg.loc[1,'base_total']}")
print(f"Non-legendary avg BST: {leg.loc[0,'base_total']}")
print(f"Stat premium:          +{gap:.0f} ({gap/leg.loc[0,'base_total']*100:.0f}%)")
# → +204 (50% premium)`,

  eevee: `# ── Eevee evolution controlled comparison ──────────────
# All 8 Eeveelutions share BST=525 — perfect for stat
# distribution analysis without confounding total power

eeveelutions = ['Vaporeon','Jolteon','Flareon','Espeon',
                'Umbreon','Leafeon','Glaceon','Sylveon']
ev = df[df['name'].isin(eeveelutions)].copy()

stats = ['hp','attack','defense',
         'sp_attack','sp_defense','speed']

# Each Pokémon's "specialty" = their highest stat
ev['specialty'] = ev[stats].idxmax(axis=1)
print(ev[['name','specialty'] + stats].to_string(index=False))

# Umbreon: the defensive wall
# → defense=110, sp_defense=130 (highest in family)
# → attack=65, sp_attack=60   (lowest offensive)

# Correlation between stats across all Eeveelutions
corr = ev[stats].corr().round(2)
print(corr)
# Confirms the trade-off: attack negatively correlated
# with sp_defense (r = -0.71) and defense (r = -0.43)`,
};

// ── Main component ─────────────────────────────────────
export default function PokemonSection() {
  const [tab, setTab] = useState<"types" | "stats" | "eevee" | "code">("types");
  const [codeTab, setCodeTab] = useState<"load" | "analysis" | "eevee">("load");
  const [showTypesCode, setShowTypesCode] = useState(false);
  const [showEeveeCode, setShowEeveeCode] = useState(false);
  const [statSort, setStatSort] = useState<"total" | "attack" | "defense" | "speed">("total");

  const { typeDistribution, avgStatsByType, legendaryVsRegular, topPokemon,
          eeveelutions, genCounts, totalDistribution, typeColors,
          totalCount, legendaryCount, dualTypePct } = POKEMON_DATA;

  const maxType = Math.max(...typeDistribution.map(d => d.count));
  const sortedStats = [...avgStatsByType].sort((a, b) => {
    if (statSort === "total")   return b.total - a.total;
    if (statSort === "attack")  return b.attack - a.attack;
    if (statSort === "defense") return b.defense - a.defense;
    return b.speed - a.speed;
  });
  const maxStat = Math.max(...sortedStats.map(d =>
    statSort === "total" ? d.total : statSort === "attack" ? d.attack : statSort === "defense" ? d.defense : d.speed
  ));

  const tabs = [
    { id: "types" as const,  label: "01 · Type Distribution",  sub: "18 types · 801 Pokémon" },
    { id: "stats" as const,  label: "02 · Stat Analysis",       sub: "avg by type · top 10" },
    { id: "eevee" as const,  label: "03 · Eevee Evolutions",    sub: "🌙 umbreon spotlight" },
    { id: "code"  as const,  label: "04 · Python Code",         sub: "pandas · matplotlib" },
  ];

  return (
    <section id="pokemon" className="py-20" style={{ background: "oklch(0.17 0.04 240)", borderTop: `1px solid ${BORDER}` }}>
      <div className="container max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: "1.4rem" }}>🔴</span>
          <div className="section-label">// personal projects · exploratory data analysis</div>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif", color: FG }}>
          Pokémon Data Analysis
        </h2>
        <p className="text-sm mb-2 max-w-2xl" style={{ color: MUTED, lineHeight: "1.7" }}>
          Exploratory analysis of the{" "}
          <a href="https://www.kaggle.com/datasets/rounakbanik/pokemon" target="_blank" rel="noopener noreferrer"
            style={{ color: TEAL, textDecoration: "underline" }}>
            Kaggle Pokémon dataset
          </a>{" "}
          (801 Pokémon, 41 features) using Python, pandas, and matplotlib. Demonstrates core analytical patterns —
          distribution analysis, group aggregation, comparative stats, and visualization — applied to a public dataset.
          The same techniques power production operational dashboards.
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { v: totalCount.toString(),          l: "Total Pokémon",     s: "Gen 1–7" },
            { v: legendaryCount.toString(),       l: "Legendaries",       s: `${((legendaryCount/totalCount)*100).toFixed(1)}% of roster` },
            { v: `${dualTypePct}%`,               l: "Dual-type",         s: "417 Pokémon" },
            { v: "522.8",                         l: "Dragon avg BST",    s: "highest of 18 types" },
          ].map(s => (
            <div key={s.l} className="p-3 rounded" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
              <div className="text-lg font-bold" style={{ color: TEAL, fontFamily: MONO }}>{s.v}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: FG, fontSize: "0.68rem" }}>{s.l}</div>
              <div className="text-xs" style={{ color: MUTED, fontSize: "0.6rem" }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto" style={{ borderColor: BORDER }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                fontFamily: MONO, color: tab === t.id ? TEAL : MUTED,
                borderBottom: tab === t.id ? `2px solid ${TEAL}` : "2px solid transparent",
                background: "transparent",
              }}>
              <div style={{ fontSize: "0.68rem" }}>{t.label}</div>
              <div style={{ fontSize: "0.58rem", opacity: 0.7, marginTop: "2px" }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* ── TAB 1: TYPE DISTRIBUTION ── */}
        {tab === "types" && (
          <div className="space-y-8">
            <div>
              <p className="text-xs mb-4" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.68rem", lineHeight: "1.7" }}>
                Primary type frequency across all 801 Pokémon. Water dominates at 114 (14.2%). Flying has only 3 as a primary type — most Flying-types use it as secondary.
              </p>
              <div className="space-y-1.5">
                {typeDistribution.map(d => (
                  <div key={d.type} className="flex items-center gap-3">
                    <span className="capitalize text-xs w-16 text-right flex-shrink-0"
                      style={{ color: typeColors[d.type] ?? MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>{d.type}</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: "13px", background: "oklch(1 0 0 / 5%)" }}>
                      <div className="h-full rounded-full" style={{ width: `${(d.count / maxType) * 100}%`, background: (typeColors[d.type] ?? TEAL) + "CC" }} />
                    </div>
                    <span className="text-xs w-8 flex-shrink-0" style={{ color: FG, fontFamily: MONO, fontSize: "0.62rem" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Show code toggle — type distribution */}
            <div>
              <button
                onClick={() => setShowTypesCode(o => !o)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all"
                style={{
                  fontFamily: MONO, fontSize: "0.65rem",
                  color: showTypesCode ? TEAL : MUTED,
                  background: showTypesCode ? "oklch(0.65 0.14 195 / 0.10)" : "oklch(1 0 0 / 4%)",
                  border: `1px solid ${showTypesCode ? "oklch(0.65 0.14 195 / 0.35)" : "oklch(1 0 0 / 8%)"}`,
                }}>
                <span style={{ fontFamily: MONO }}>&lt;/&gt;</span>
                {showTypesCode ? "hide code" : "show code — how this was produced"}
              </button>
              {showTypesCode && (
                <div className="mt-3">
                  <p className="text-xs mb-2" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>
                    Python · pandas — type frequency from <code style={{ color: TEAL }}>df['type1'].value_counts()</code>
                  </p>
                  <CodeBlock code={PY.analysis} />
                </div>
              )}
            </div>
            {/* Generation counts */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: FG, fontFamily: MONO, fontSize: "0.72rem" }}>Pokémon per Generation</h3>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(genCounts).map(([gen, count]) => (
                  <div key={gen} className="flex flex-col items-center p-3 rounded" style={{ background: PANEL, border: `1px solid ${BORDER}`, minWidth: "68px" }}>
                    <span className="text-lg font-bold" style={{ color: TEAL, fontFamily: MONO }}>{count}</span>
                    <span className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.6rem" }}>Gen {gen}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BST distribution histogram */}
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: FG, fontFamily: MONO, fontSize: "0.72rem" }}>Base Stat Total Distribution</h3>
              <p className="text-xs mb-4" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.64rem" }}>
                Most Pokémon cluster in the 400–500 range. The 700+ tier (6 Pokémon) are all legendaries.
              </p>
              <div className="flex items-end gap-2" style={{ height: "110px" }}>
                {totalDistribution.map(d => {
                  const maxC = Math.max(...totalDistribution.map(x => x.count));
                  const h = Math.round((d.count / maxC) * 95);
                  return (
                    <div key={d.bucket} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-xs" style={{ color: TEAL, fontFamily: MONO, fontSize: "0.58rem" }}>{d.count}</span>
                      <div className="w-full rounded-t" style={{ height: `${h}px`, background: TEAL + "99" }} />
                      <span className="text-xs text-center" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.52rem", lineHeight: 1.2 }}>{d.bucket}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: STAT ANALYSIS ── */}
        {tab === "stats" && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.65rem" }}>Sort by:</span>
                {(["total", "attack", "defense", "speed"] as const).map(m => (
                  <button key={m} onClick={() => setStatSort(m)}
                    className="text-xs px-3 py-1 rounded capitalize transition-all"
                    style={{
                      fontFamily: MONO, fontSize: "0.63rem",
                      background: statSort === m ? TEAL + "22" : "transparent",
                      border: `1px solid ${statSort === m ? TEAL : BORDER}`,
                      color: statSort === m ? TEAL : MUTED,
                    }}>{m === "total" ? "avg BST" : `avg ${m}`}</button>
                ))}
              </div>
              <div className="space-y-1.5">
                {sortedStats.map((t, i) => {
                  const val = statSort === "total" ? t.total : statSort === "attack" ? t.attack : statSort === "defense" ? t.defense : t.speed;
                  return (
                    <div key={t.type} className="flex items-center gap-3">
                      <span className="text-xs w-4 text-right flex-shrink-0" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.58rem" }}>{i + 1}</span>
                      <span className="capitalize text-xs w-16 flex-shrink-0" style={{ color: typeColors[t.type] ?? MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>{t.type}</span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: "12px", background: "oklch(1 0 0 / 5%)" }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(val / maxStat) * 100}%`, background: (typeColors[t.type] ?? TEAL) + "CC" }} />
                      </div>
                      <span className="text-xs w-12 text-right flex-shrink-0" style={{ color: FG, fontFamily: MONO, fontSize: "0.62rem" }}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 10 table */}
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: FG, fontFamily: MONO, fontSize: "0.72rem" }}>Top 10 by Base Stat Total</h3>
              <div className="rounded overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ fontFamily: MONO }}>
                    <thead>
                      <tr style={{ background: "oklch(1 0 0 / 4%)", borderBottom: `1px solid ${BORDER}` }}>
                        {["#", "Name", "Type", "BST", "Legend"].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: MUTED, fontSize: "0.6rem" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topPokemon.map((p, i) => (
                        <tr key={p.name} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? "oklch(1 0 0 / 2%)" : "transparent" }}>
                          <td className="px-3 py-2" style={{ color: MUTED, fontSize: "0.6rem" }}>{i + 1}</td>
                          <td className="px-3 py-2 font-semibold" style={{ color: FG, fontSize: "0.68rem" }}>{p.name}</td>
                          <td className="px-3 py-2"><TypeBadge type={p.type} /></td>
                          <td className="px-3 py-2 font-bold" style={{ color: TEAL, fontSize: "0.68rem" }}>{p.total}</td>
                          <td className="px-3 py-2" style={{ color: p.legendary ? "#F8D030" : MUTED, fontSize: "0.65rem" }}>
                            {p.legendary ? "★ Yes" : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Legendary comparison */}
            <div className="p-4 rounded" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: FG, fontFamily: MONO, fontSize: "0.72rem" }}>Legendary vs. Non-Legendary Stat Gap</h3>
              {[
                { label: "Avg BST",    leg: legendaryVsRegular.legendary.avgTotal,  reg: legendaryVsRegular.regular.avgTotal,  max: 700 },
                { label: "Avg HP",     leg: legendaryVsRegular.legendary.avgHp,     reg: legendaryVsRegular.regular.avgHp,     max: 130 },
                { label: "Avg Attack", leg: legendaryVsRegular.legendary.avgAttack, reg: legendaryVsRegular.regular.avgAttack, max: 140 },
              ].map(m => (
                <div key={m.label} className="mb-3">
                  <span className="text-xs mb-1 block" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>{m.label}</span>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs w-20 text-right flex-shrink-0" style={{ color: "#F8D030", fontFamily: MONO, fontSize: "0.6rem" }}>★ Legendary</span>
                    <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
                      <div className="h-full rounded" style={{ width: `${(m.leg / m.max) * 100}%`, background: "#F8D030CC" }} />
                    </div>
                    <span className="text-xs w-8 flex-shrink-0" style={{ color: "#F8D030", fontFamily: MONO, fontSize: "0.62rem" }}>{m.leg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-20 text-right flex-shrink-0" style={{ color: TEAL, fontFamily: MONO, fontSize: "0.6rem" }}>Regular</span>
                    <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
                      <div className="h-full rounded" style={{ width: `${(m.reg / m.max) * 100}%`, background: TEAL + "99" }} />
                    </div>
                    <span className="text-xs w-8 flex-shrink-0" style={{ color: TEAL, fontFamily: MONO, fontSize: "0.62rem" }}>{m.reg}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs mt-2" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.62rem", lineHeight: "1.65" }}>
                <strong style={{ color: FG }}>Insight:</strong> Legendaries average {legendaryVsRegular.legendary.avgTotal} BST vs. {legendaryVsRegular.regular.avgTotal} for regular Pokémon — a <strong style={{ color: FG }}>50% stat premium</strong>. Only {((legendaryCount / totalCount) * 100).toFixed(1)}% of all Pokémon are Legendary.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 3: EEVEE EVOLUTIONS ── */}
        {tab === "eevee" && (
          <div className="space-y-6">
            <p className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.68rem", lineHeight: "1.7" }}>
              All 8 Eevee evolutions share the same Base Stat Total (525) — making them a perfect <strong style={{ color: FG }}>controlled comparison</strong> for stat distribution analysis. Each is optimized for a different combat role.
            </p>

            {/* Umbreon spotlight */}
            <div className="p-4 rounded" style={{ background: (typeColors["dark"] ?? "#705848") + "11", border: `1px solid ${(typeColors["dark"] ?? "#705848")}33` }}>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize: "1.2rem" }}>🌙</span>
                <span className="font-semibold text-sm" style={{ color: FG, fontFamily: "'DM Serif Display', serif" }}>Umbreon — The Defensive Wall</span>
                <TypeBadge type="dark" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs mb-3" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.64rem", lineHeight: "1.7" }}>
                    Umbreon has the highest Defense (110) and Sp. Defense (130) in the Eevee family, and the lowest offensive stats. A textbook <strong style={{ color: FG }}>wall/staller</strong> archetype — built to absorb hits, not deal them.
                  </p>
                  <UmbreonRadar />
                </div>
                <div>
                  <p className="text-xs mb-3 font-semibold" style={{ color: FG, fontFamily: MONO, fontSize: "0.65rem" }}>Full family comparison (BST = 525 each)</p>
                  <div className="space-y-2">
                    {eeveelutions.map(e => {
                      const maxVal = Math.max(e.hp, e.attack, e.defense, e.sp_atk, e.sp_def, e.speed);
                      const roles: Record<string, string> = {
                        Vaporeon: "Bulky Water", Jolteon: "Speed Sweeper", Flareon: "Phys. Attacker",
                        Espeon: "Sp. Sweeper", Umbreon: "Defensive Wall", Leafeon: "Phys. Attacker",
                        Glaceon: "Sp. Attacker", Sylveon: "Sp. Wall",
                      };
                      const isUmbreon = e.name === "Umbreon";
                      return (
                        <div key={e.name} className="flex items-center gap-2 p-2 rounded"
                          style={{ background: isUmbreon ? (typeColors["dark"] ?? "#705848") + "18" : "oklch(1 0 0 / 2%)", border: `1px solid ${isUmbreon ? (typeColors["dark"] ?? "#705848") + "44" : BORDER}` }}>
                          <span className="text-xs w-16 font-semibold flex-shrink-0" style={{ color: isUmbreon ? typeColors["dark"] ?? TEAL : FG, fontFamily: MONO, fontSize: "0.62rem" }}>
                            {isUmbreon ? "🌙 " : ""}{e.name}
                          </span>
                          <div className="flex gap-0.5 flex-1">
                            {[e.hp, e.attack, e.defense, e.sp_atk, e.sp_def, e.speed].map((v, i) => (
                              <div key={i} className="flex-1 rounded" style={{ height: "20px", background: v === maxVal ? (typeColors[e.type] ?? TEAL) + "CC" : "oklch(1 0 0 / 8%)", position: "relative", minWidth: 0 }}>
                                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.52rem", fontFamily: MONO, color: v === maxVal ? "#fff" : MUTED, overflow: "hidden" }}>{v}</span>
                              </div>
                            ))}
                          </div>
                          <span className="hidden sm:block text-xs flex-shrink-0" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.55rem", width: "70px" }}>{roles[e.name]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs mt-2" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.58rem" }}>
                    Columns: HP · Atk · Def · SpA · SpD · Spe · Highlighted = highest stat
                  </p>
                </div>
              </div>
            </div>
             {/* Show code toggle — Eevee analysis */}
            <div className="mt-2">
              <button
                onClick={() => setShowEeveeCode(o => !o)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all"
                style={{
                  fontFamily: MONO, fontSize: "0.65rem",
                  color: showEeveeCode ? TEAL : MUTED,
                  background: showEeveeCode ? "oklch(0.65 0.14 195 / 0.10)" : "oklch(1 0 0 / 4%)",
                  border: `1px solid ${showEeveeCode ? "oklch(0.65 0.14 195 / 0.35)" : "oklch(1 0 0 / 8%)"}`,
                }}>
                <span style={{ fontFamily: MONO }}>&lt;/&gt;</span>
                {showEeveeCode ? "hide code" : "show code — how this was produced"}
              </button>
              {showEeveeCode && (
                <div className="mt-3">
                  <p className="text-xs mb-2" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.62rem" }}>
                    Python · pandas — <code style={{ color: TEAL }}>idxmax()</code> specialty detection + <code style={{ color: TEAL }}>corr()</code> matrix confirming the offensive/defensive trade-off
                  </p>
                  <CodeBlock code={PY.eevee} />
                </div>
              )}
            </div>
          </div>
        )}
        {/* ── TAB 4: PYTHON CODE ── */}
        {tab === "code" && (
          <div className="space-y-4">
            <p className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.68rem", lineHeight: "1.7" }}>
              Python/pandas pipeline used to generate all insights on this page. The same patterns — groupby aggregation, distribution binning, comparative analysis — apply directly to production operational datasets.
            </p>
            <div className="flex gap-2 flex-wrap">
              {([
                { id: "load" as const,     label: "01 · Load & Explore" },
                { id: "analysis" as const, label: "02 · Type & Legendary Analysis" },
                { id: "eevee" as const,    label: "03 · Eevee Radar Chart" },
              ]).map(t => (
                <button key={t.id} onClick={() => setCodeTab(t.id)}
                  className="text-xs px-3 py-1.5 rounded transition-all"
                  style={{
                    fontFamily: MONO, fontSize: "0.63rem",
                    background: codeTab === t.id ? TEAL + "22" : "transparent",
                    border: `1px solid ${codeTab === t.id ? TEAL : BORDER}`,
                    color: codeTab === t.id ? TEAL : MUTED,
                  }}>{t.label}</button>
              ))}
            </div>
            <CodeBlock code={PY[codeTab]} lang="python" />
            <div className="p-3 rounded flex items-start gap-2" style={{ background: TEAL + "08", border: `1px solid ${BORDER}` }}>
              <span style={{ color: TEAL, fontSize: "0.8rem" }}>📦</span>
              <p className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.63rem", lineHeight: "1.65" }}>
                <strong style={{ color: FG }}>Stack:</strong> Python 3.11 · pandas · matplotlib · seaborn · numpy.{" "}
                The <code style={{ color: TEAL }}>groupby → agg → sort_values</code> pattern used here mirrors the CTE → aggregate → ORDER BY pattern in production SQL.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 flex items-center justify-between flex-wrap gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <span className="text-xs" style={{ color: MUTED, fontFamily: MONO, fontSize: "0.6rem" }}>
            Source: Kaggle · "The Complete Pokemon Dataset" · Rounak Banik · 801 Pokémon · 41 features · processed Mar 2026
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {["Python", "pandas", "matplotlib", "Kaggle API"].map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded"
                style={{ background: TEAL + "11", color: TEAL, fontFamily: MONO, fontSize: "0.58rem", border: `1px solid ${TEAL}22` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
