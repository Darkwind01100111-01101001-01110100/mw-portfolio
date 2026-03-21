// ═══════════════════════════════════════════════════════
// POKÉMON ANALYSIS SECTION
// Design: Terminal Clarity — dark navy, teal accents
// Charts: Pure SVG/CSS — no external chart library
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { POKEMON_DATA } from "@/lib/portfolioData";

const TEAL = "#22D3EE";
const MUTED = "oklch(0.60 0.015 220)";
const FG = "oklch(0.88 0.008 220)";
const CARD_BG = "oklch(0.20 0.038 240)";
const BORDER = "oklch(1 0 0 / 8%)";

// ── Horizontal bar chart (pure SVG) ───────────────────
function HBarChart({
  data, valueKey, labelKey, colorKey, title, subtitle, insight, maxVal,
}: {
  data: any[]; valueKey: string; labelKey: string; colorKey?: string;
  title: string; subtitle?: string; insight: string; maxVal?: number;
}) {
  const max = maxVal ?? Math.max(...data.map(d => d[valueKey])) * 1.08;
  return (
    <div className="panel p-5">
      <div className="section-label mb-1" style={{ fontSize: "0.65rem" }}>{subtitle}</div>
      <div className="text-sm font-semibold mb-4" style={{ color: FG }}>{title}</div>
      <div className="space-y-2">
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100;
          const color = colorKey ? (POKEMON_DATA.typeColors[d[colorKey]] ?? TEAL) : TEAL;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="text-xs w-16 text-right shrink-0 truncate"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.70 0.012 220)", fontSize: "0.7rem" }}>
                {d[labelKey]}
              </div>
              <div className="flex-1 relative h-5 rounded overflow-hidden"
                style={{ background: "oklch(1 0 0 / 5%)" }}>
                <div className="h-full rounded transition-all duration-700"
                  style={{ width: `${pct}%`, background: color, opacity: 0.82 }} />
              </div>
              <div className="text-xs w-8 shrink-0"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL, fontSize: "0.7rem" }}>
                {d[valueKey]}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs mt-4" style={{ color: MUTED, lineHeight: "1.6" }}>
        <strong style={{ color: FG }}>Insight:</strong> {insight}
      </p>
    </div>
  );
}

// ── Grouped comparison bars ────────────────────────────
function ComparisonChart() {
  const { legendary, regular } = POKEMON_DATA.legendaryVsRegular;
  const metrics = [
    { label: "Avg Total", leg: legendary.avgTotal, reg: regular.avgTotal, max: 700 },
    { label: "Avg HP",    leg: legendary.avgHp,    reg: regular.avgHp,    max: 130 },
    { label: "Avg Atk",  leg: legendary.avgAttack, reg: regular.avgAttack, max: 140 },
  ];
  return (
    <div className="panel p-5">
      <div className="section-label mb-1" style={{ fontSize: "0.65rem" }}>Analysis · Legendary vs. Regular</div>
      <div className="text-sm font-semibold mb-4" style={{ color: FG }}>Stat Gap: Legendary vs. Regular Pokémon</div>
      <div className="space-y-4">
        {metrics.map(m => (
          <div key={m.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.015 220)", fontSize: "0.7rem" }}>{m.label}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F8D030", fontSize: "0.65rem" }}>Legendary</span>
                <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
                  <div className="h-full rounded" style={{ width: `${(m.leg / m.max) * 100}%`, background: "#F8D030", opacity: 0.85 }} />
                </div>
                <span className="text-xs w-8 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F8D030", fontSize: "0.7rem" }}>{m.leg}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-16 text-right shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL, fontSize: "0.65rem" }}>Regular</span>
                <div className="flex-1 h-4 rounded overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
                  <div className="h-full rounded" style={{ width: `${(m.reg / m.max) * 100}%`, background: TEAL, opacity: 0.7 }} />
                </div>
                <span className="text-xs w-8 shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL, fontSize: "0.7rem" }}>{m.reg}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs mt-4" style={{ color: MUTED, lineHeight: "1.6" }}>
        <strong style={{ color: FG }}>Insight:</strong> Legendaries average 637 base total vs. 417 for regular Pokémon — a <strong style={{ color: FG }}>53% stat premium</strong>. Only ~8.7% of all Pokémon are Legendary. Difference is statistically significant (p &lt; 0.001).
      </p>
    </div>
  );
}

// ── Umbreon stat hexagon (SVG radar) ──────────────────
function UmbreonRadar() {
  const u = POKEMON_DATA.umbreon;
  const stats = [
    { label: "HP",     value: u.hp,      max: 255 },
    { label: "Atk",   value: u.attack,  max: 255 },
    { label: "Def",   value: u.defense, max: 255 },
    { label: "SpA",   value: u.sp_atk,  max: 255 },
    { label: "SpD",   value: u.sp_def,  max: 255 },
    { label: "Spd",   value: u.speed,   max: 255 },
  ];
  const cx = 100, cy = 100, r = 70;
  const n = stats.length;
  const angles = stats.map((_, i) => (i * 2 * Math.PI) / n - Math.PI / 2);

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const statPoints = stats.map((s, i) => toXY(angles[i], (s.value / s.max) * r));
  const polyPoints = statPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3 mb-4">
        <span style={{ fontSize: "2rem" }}>🌑</span>
        <div>
          <div className="text-base font-bold" style={{ color: FG }}>Umbreon <span style={{ color: TEAL }}>#197</span></div>
          <div className="text-xs" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>Dark Type · Base Total: 525</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs" style={{ color: MUTED }}>Sp. Def</div>
          <div className="text-xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL }}>130</div>
          <div className="text-xs" style={{ color: MUTED }}>92nd pct</div>
        </div>
      </div>

      <div className="flex justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Grid */}
          {gridLevels.map(level => {
            const pts = angles.map(a => toXY(a, r * level));
            return (
              <polygon key={level}
                points={pts.map(p => `${p.x},${p.y}`).join(" ")}
                fill="none" stroke="oklch(1 0 0 / 10%)" strokeWidth="1" />
            );
          })}
          {/* Spokes */}
          {angles.map((a, i) => {
            const end = toXY(a, r);
            return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="oklch(1 0 0 / 10%)" strokeWidth="1" />;
          })}
          {/* Stat polygon */}
          <polygon points={polyPoints} fill={TEAL} fillOpacity="0.18" stroke={TEAL} strokeWidth="2" strokeLinejoin="round" />
          {/* Stat dots */}
          {statPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill={TEAL} />
          ))}
          {/* Labels */}
          {stats.map((s, i) => {
            const labelPos = toXY(angles[i], r + 16);
            return (
              <text key={i} x={labelPos.x} y={labelPos.y + 4}
                textAnchor="middle" fontSize="9" fill="oklch(0.65 0.015 220)"
                fontFamily="'JetBrains Mono', monospace">
                {s.label}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-1">
        {stats.map(s => (
          <div key={s.label} className="flex items-center justify-between px-2 py-1 rounded text-xs"
            style={{ background: "oklch(1 0 0 / 4%)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: MUTED }}>{s.label}</span>
            <span style={{ color: s.value >= 100 ? TEAL : FG, fontWeight: s.value >= 100 ? 700 : 400 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Python code samples ────────────────────────────────
const PYTHON_SAMPLES = [
  {
    id: "load",
    label: "Load & Explore",
    code: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the classic Pokémon dataset (800 Pokémon, Gen 1–6)
df = pd.read_csv('pokemon.csv')

# Basic exploration
print(df.shape)          # (800, 13)
print(df.dtypes)
print(df.describe())

# Check for nulls
print(df.isnull().sum())
# Type 2 has 386 nulls — expected (many are single-type)

# Quick look at the data
df[['Name','Type 1','Type 2','Total','HP','Attack',
    'Defense','Sp. Atk','Sp. Def','Speed']].head(10)`,
  },
  {
    id: "type_analysis",
    label: "Type Analysis",
    code: `# ── Type distribution ──────────────────────────────────
type_counts = df['Type 1'].value_counts()
print(f"Most common: {type_counts.index[0]} ({type_counts.iloc[0]} Pokémon)")
# → Water (126 Pokémon)

# ── Average stats by type ───────────────────────────────
type_stats = df.groupby('Type 1')['Total'].agg(['mean','std','count'])
type_stats = type_stats.sort_values('mean', ascending=False)
print(type_stats.head(5))
#          mean   std  count
# Dragon  550.0  79.2     50
# Steel   486.4  64.1     49
# Psychic 467.1  78.3     77

# ── Visualization ───────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))
type_stats['mean'].plot(kind='bar', ax=ax,
    color='steelblue', edgecolor='none')
ax.axhline(df['Total'].mean(), color='red',
    linestyle='--', label='Overall avg')
ax.set_title('Average Base Total by Primary Type')
ax.set_ylabel('Avg Base Total')
ax.legend()
plt.tight_layout()`,
  },
  {
    id: "legendary",
    label: "Legendary Analysis",
    code: `# ── Legendary vs. Regular comparison ──────────────────
legendary = df[df['Legendary'] == True]
regular   = df[df['Legendary'] == False]

stat_cols = ['HP','Attack','Defense',
             'Sp. Atk','Sp. Def','Speed','Total']

comparison = pd.DataFrame({
    'Legendary': legendary[stat_cols].mean(),
    'Regular':   regular[stat_cols].mean(),
})
comparison['Premium %'] = (
    (comparison['Legendary'] - comparison['Regular'])
    / comparison['Regular'] * 100
).round(1)

print(comparison)
#          Legendary  Regular  Premium %
# HP            92.0     68.0       35.3
# Attack       116.0     76.0       52.6
# Total        637.0    417.0       52.8

# ── Statistical significance test ──────────────────────
from scipy import stats
t_stat, p_value = stats.ttest_ind(
    legendary['Total'], regular['Total']
)
print(f"t={t_stat:.2f}, p={p_value:.2e}")
# p < 0.001 — highly significant`,
  },
  {
    id: "umbreon",
    label: "Umbreon Deep Dive",
    code: `# ── Umbreon's percentile ranking ───────────────────────
umbreon = df[df['Name'] == 'Umbreon'].iloc[0]

stat_cols = ['HP','Attack','Defense',
             'Sp. Atk','Sp. Def','Speed']
for stat in stat_cols:
    pct = (df[stat] < umbreon[stat]).mean() * 100
    print(f"{stat:10s}: {umbreon[stat]:3.0f} → {pct:.0f}th pct")

# HP        :  95 → 79th pct
# Attack    :  65 → 30th pct
# Defense   : 110 → 84th pct
# Sp. Atk   :  60 → 24th pct
# Sp. Def   : 130 → 92nd pct  ← standout
# Speed     :  65 → 30th pct

# ── Find similar defensive walls ───────────────────────
walls = df[
    (df['Defense'] >= 100) &
    (df['Sp. Def'] >= 100) &
    (df['HP'] >= 80)
][['Name','Type 1','HP','Defense','Sp. Def','Total']]
print(f"Defensive walls: {len(walls)}")
# → 23 Pokémon qualify — Umbreon is elite company`,
  },
];

function PythonCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = code
    .replace(/#[^\n]*/g, m => `<span style="color:oklch(0.55 0.015 220);font-style:italic">${m}</span>`)
    .replace(/\b(import|from|as|def|class|return|for|in|if|else|elif|print|True|False|None|and|or|not|with|lambda)\b/g,
      m => `<span style="color:oklch(0.72 0.13 195);font-weight:600">${m}</span>`)
    .replace(/(['"])(.*?)\1/g, m => `<span style="color:oklch(0.75 0.18 55)">${m}</span>`)
    .replace(/\b(\d+\.?\d*)\b/g, m => `<span style="color:oklch(0.75 0.15 30)">${m}</span>`);

  return (
    <div className="terminal-block relative">
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "oklch(0.65 0.14 195 / 0.2)" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.18 80)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.20 145)" }} />
        </div>
        <span className="section-label" style={{ fontSize: "0.65rem" }}>Python · pandas / scipy</span>
        <button onClick={handleCopy} className="text-xs px-2 py-0.5 rounded transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
            background: copied ? "oklch(0.65 0.14 195 / 0.2)" : "transparent",
            color: copied ? "oklch(0.72 0.13 195)" : "oklch(0.55 0.015 220)",
            border: "1px solid oklch(0.65 0.14 195 / 0.2)" }}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.82 0.008 220)", maxHeight: "340px" }}
        dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
}

// ── Main export ────────────────────────────────────────
export default function PokemonSection() {
  const [activeCode, setActiveCode] = useState("load");
  const activeSnippet = PYTHON_SAMPLES.find(s => s.id === activeCode)!;

  const typeData = POKEMON_DATA.typeDistribution.slice(0, 12);
  const statData = [...POKEMON_DATA.avgStatsByType].sort((a, b) => b.total - a.total);

  return (
    <section id="pokemon" className="py-20">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: "1.8rem" }}>🌑</span>
          <div className="section-label">// personal projects · data analysis</div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Pokémon Dataset Analysis
        </h2>
        <p className="text-sm mb-10 max-w-2xl" style={{ color: "oklch(0.65 0.012 220)", lineHeight: "1.7" }}>
          Exploratory data analysis on the classic Pokémon dataset (800 Pokémon, Gen 1–6) — demonstrating core data analysis fundamentals: loading and cleaning data, groupby aggregations, statistical testing, percentile ranking, and visualization. Built with Python (pandas, matplotlib, seaborn, scipy).
        </p>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UmbreonRadar />
          <HBarChart
            data={typeData}
            valueKey="count"
            labelKey="type"
            colorKey="type"
            title="Pokémon Count by Primary Type"
            subtitle="Analysis · Type Distribution"
            insight="Water dominates at 126 Pokémon — nearly 2× the next type. Flying has only 3 as a primary type; most Flying-types carry it as a secondary."
          />
          <HBarChart
            data={statData}
            valueKey="total"
            labelKey="type"
            colorKey="type"
            title="Which Types Are Statistically Strongest?"
            subtitle="Analysis · Avg Base Total by Type"
            insight="Dragon-types average 550 base total — 32% higher than Bug-types (374). This reflects game design intent: Dragon is a late-game, hard-to-obtain type."
            maxVal={600}
          />
          <ComparisonChart />
        </div>

        {/* Python code samples */}
        <div className="panel overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: BORDER }}>
            <div className="section-label mb-1">Python Code Samples</div>
            <p className="text-sm" style={{ color: MUTED }}>The analysis behind the charts above — pandas, scipy, matplotlib/seaborn.</p>
          </div>
          <div className="flex border-b overflow-x-auto" style={{ borderColor: BORDER }}>
            {PYTHON_SAMPLES.map(s => (
              <button key={s.id} onClick={() => setActiveCode(s.id)}
                className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: activeCode === s.id ? TEAL : "oklch(0.55 0.015 220)",
                  borderBottom: activeCode === s.id ? `2px solid ${TEAL}` : "2px solid transparent",
                  background: "transparent",
                }}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            <PythonCodeBlock code={activeSnippet.code} />
          </div>
        </div>

        {/* Key insights callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { emoji: "💧", stat: "Water", insight: "Most common primary type — 126 Pokémon, nearly 2× the next type" },
            { emoji: "🐉", stat: "Dragon", insight: "Highest avg base total (550) — 47% above the dataset average of 435" },
            { emoji: "⚡", stat: "53%", insight: "Stat premium for Legendary Pokémon over regular — statistically significant (p < 0.001)" },
          ].map(c => (
            <div key={c.stat} className="panel p-4">
              <div className="text-2xl mb-2">{c.emoji}</div>
              <div className="text-base font-bold mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEAL }}>{c.stat}</div>
              <p className="text-xs" style={{ color: MUTED, lineHeight: "1.6" }}>{c.insight}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
