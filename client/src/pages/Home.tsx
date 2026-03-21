// ═══════════════════════════════════════════════════════
// HOME PAGE — Mike Winters Portfolio
// Design: Terminal Clarity — dark navy, teal accents
// Sections: Hero → Metrics → About → Dashboards → SQL → Patterns → Pokémon → Chelsea → Contact
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { METRICS, SKILLS, DASHBOARDS, SQL_QUERIES, TECHNICAL_PATTERNS } from "@/lib/portfolioData";
import PokemonSection from "@/components/PokemonSection";
import ChelseaSection from "@/components/ChelseaSection";

// ── Animated counter hook ──────────────────────────────
function useCounter(target: number, duration = 1500, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

// ── Intersection observer hook ─────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Metric card ────────────────────────────────────────
function MetricCard({ value, label, sublabel, index }: { value: string; label: string; sublabel: string; index: number }) {
  const { ref, inView } = useInView();
  const numericPart = parseInt(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const count = useCounter(numericPart, 1200 + index * 100, inView);
  return (
    <div ref={ref} className="panel p-5 flex flex-col gap-1 teal-glow transition-all duration-500"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transitionDelay: `${index * 80}ms` }}>
      <div className="text-3xl font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.72 0.13 195)" }}>
        {inView ? `${count}${suffix}` : "0"}
      </div>
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="text-xs" style={{ color: "oklch(0.60 0.015 220)" }}>{sublabel}</div>
    </div>
  );
}

// ── SQL code block ─────────────────────────────────────
function SqlBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const highlighted = code
    .replace(/--[^\n]*/g, m => `<span style="color:oklch(0.55 0.015 220);font-style:italic">${m}</span>`)
    .replace(/\b(WITH|SELECT|FROM|WHERE|JOIN|LEFT JOIN|GROUP BY|ORDER BY|HAVING|AND|OR|NOT|IN|AS|ON|CASE|WHEN|THEN|ELSE|END|DISTINCT|COUNT|SUM|AVG|ROUND|CAST|NULLIF|COALESCE|VALUES|NULL|TRUE|FALSE)\b/g,
      m => `<span style="color:oklch(0.72 0.13 195);font-weight:600">${m}</span>`)
    .replace(/\{\{[^}]+\}\}/g, m => `<span style="color:oklch(0.78 0.18 55)">${m}</span>`)
    .replace(/\b(\d+)\b/g, m => `<span style="color:oklch(0.75 0.15 30)">${m}</span>`);

  return (
    <div className="terminal-block relative">
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "oklch(0.65 0.14 195 / 0.2)" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.18 80)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.20 145)" }} />
        </div>
        <span className="section-label" style={{ fontSize: "0.65rem" }}>SQL · Presto/Trino</span>
        <button onClick={handleCopy} className="text-xs px-2 py-0.5 rounded transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
            background: copied ? "oklch(0.65 0.14 195 / 0.2)" : "transparent",
            color: copied ? "oklch(0.72 0.13 195)" : "oklch(0.55 0.015 220)",
            border: "1px solid oklch(0.65 0.14 195 / 0.2)" }}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.82 0.008 220)", maxHeight: "420px" }}
        dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
}

// ── Sample output table ────────────────────────────────
function SampleTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
      <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <thead>
          <tr style={{ background: "oklch(0.24 0.035 240)" }}>
            {columns.map(c => (
              <th key={c} className="px-3 py-2 text-left font-semibold" style={{ color: "oklch(0.65 0.14 195)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "oklch(1 0 0 / 2%)" }}>
              {columns.map(c => (
                <td key={c} className="px-3 py-2" style={{ color: "oklch(0.82 0.008 220)", borderBottom: "1px solid oklch(1 0 0 / 5%)" }}>
                  {Object.values(row)[columns.indexOf(c)]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────
function Nav() {
  const [active, setActive] = useState("hero");
  const sections = ["about", "dashboards", "sql", "pokemon", "chelsea", "contact"];

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(s => { const el = document.getElementById(s); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{ background: "oklch(0.16 0.038 240 / 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
      <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.72 0.13 195)" }}>MW</span>
        <span className="text-sm font-medium text-foreground hidden sm:block">Mike Winters</span>
      </button>
      <div className="flex items-center gap-1">
        {sections.map(s => (
          <button key={s} onClick={() => scrollTo(s)}
            className="px-3 py-1.5 rounded text-xs font-medium capitalize transition-all"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: active === s ? "oklch(0.72 0.13 195)" : "oklch(0.60 0.015 220)",
              background: active === s ? "oklch(0.65 0.14 195 / 0.12)" : "transparent",
            }}>
            {s === "sql" ? "SQL" : s === "pokemon" ? "Pokémon" : s === "chelsea" ? "Chelsea FC" : s}
          </button>
        ))}
      </div>
      <a href="mailto:m.winters@me.com"
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all"
        style={{ background: "oklch(0.65 0.14 195 / 0.15)", border: "1px solid oklch(0.65 0.14 195 / 0.3)", color: "oklch(0.72 0.13 195)" }}>
        Hire Me
      </a>
    </nav>
  );
}

// ── Dashboard card ─────────────────────────────────────
function DashboardCard({ dash, index }: { dash: typeof DASHBOARDS[0]; index: number }) {
  const { ref, inView } = useInView();
  const [expanded, setExpanded] = useState(false);
  return (
    <div ref={ref} className="panel overflow-hidden transition-all duration-500"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transitionDelay: `${index * 120}ms` }}>
      {/* Screenshot */}
      <div className="relative overflow-hidden cursor-pointer" style={{ background: "oklch(0.13 0.03 240)" }}
        onClick={() => setExpanded(!expanded)}>
        <img src={dash.image} alt={dash.title} className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          style={{ maxHeight: expanded ? "none" : "260px", objectPosition: "top" }} />
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center pb-3"
            style={{ background: "linear-gradient(transparent, oklch(0.20 0.038 240))" }}>
            <span className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.14 195)" }}>
              click to expand ↓
            </span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="section-label mb-1">{dash.subtitle}</div>
            <h3 className="text-lg font-bold text-foreground">{dash.title}</h3>
          </div>
        </div>
        <p className="text-sm mb-4" style={{ color: "oklch(0.70 0.012 220)", lineHeight: "1.65" }}>{dash.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {dash.metrics.map(m => <span key={m} className="metric-pill">{m}</span>)}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dash.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(1 0 0 / 10%)", color: "oklch(0.65 0.015 220)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SQL query section ──────────────────────────────────
function QuerySection({ query, index }: { query: typeof SQL_QUERIES[0]; index: number }) {
  const { ref, inView } = useInView();
  const [tab, setTab] = useState<"sql" | "output">("sql");
  return (
    <div ref={ref} className="panel overflow-hidden transition-all duration-500"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transitionDelay: `${index * 100}ms` }}>
      <div className="p-5 border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
        <div className="section-label mb-1">Query {index + 1} · {query.panel}</div>
        <h3 className="text-base font-bold text-foreground mb-2">{query.title}</h3>
        <p className="text-sm mb-3" style={{ color: "oklch(0.70 0.012 220)", lineHeight: "1.6" }}>{query.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {query.patterns.map(p => (
            <span key={p} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "oklch(0.65 0.14 195 / 0.08)", border: "1px solid oklch(0.65 0.14 195 / 0.2)", color: "oklch(0.72 0.13 195)", fontFamily: "'JetBrains Mono', monospace" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
      {/* Tab switcher */}
      <div className="flex border-b" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
        {(["sql", "output"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 text-xs font-semibold transition-all"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: tab === t ? "oklch(0.72 0.13 195)" : "oklch(0.55 0.015 220)",
              borderBottom: tab === t ? "2px solid oklch(0.65 0.14 195)" : "2px solid transparent",
              background: "transparent",
            }}>
            {t === "sql" ? "SQL Query" : "Sample Output"}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tab === "sql" ? (
          <SqlBlock code={query.code} />
        ) : (
          <SampleTable rows={query.sampleOutput} columns={query.outputColumns} />
        )}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────
export default function Home() {
  const { ref: heroRef, inView: heroInView } = useInView(0.1);

  return (
    <div className="min-h-screen grid-bg" style={{ background: "oklch(0.16 0.038 240)" }}>
      <Nav />

      {/* ── HERO ── */}
      <section id="hero" className="min-h-screen flex flex-col justify-center pt-16"
        style={{ background: "linear-gradient(135deg, oklch(0.16 0.038 240) 0%, oklch(0.19 0.045 230) 100%)" }}>
        <div className="container max-w-5xl mx-auto px-6 py-24">
          <div ref={heroRef} className="transition-all duration-700" style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(40px)" }}>
            <div className="section-label mb-4">// data analytics portfolio</div>
            <h1 className="mb-4 leading-none" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(3rem, 8vw, 5.5rem)", color: "oklch(0.94 0.008 220)" }}>
              Mike<br /><span style={{ color: "oklch(0.72 0.13 195)" }}>Winters</span>
            </h1>
            <p className="text-lg mb-8 max-w-xl" style={{ color: "oklch(0.70 0.012 220)", lineHeight: "1.7" }}>
              Building <strong style={{ color: "oklch(0.88 0.008 220)" }}>production data systems from scratch</strong> — SQL pipelines, real-time dashboards, statistical validation, and the operational frameworks around them.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a href="mailto:m.winters@me.com" className="px-5 py-2.5 rounded font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "oklch(0.65 0.14 195)", color: "oklch(0.12 0.03 240)" }}>
                Get in Touch
              </a>
              <a href="https://www.linkedin.com/in/mwinters123/" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded font-semibold text-sm transition-all"
                style={{ background: "transparent", border: "1px solid oklch(0.65 0.14 195 / 0.4)", color: "oklch(0.72 0.13 195)" }}>
                LinkedIn ↗
              </a>
              <button onClick={() => document.getElementById("dashboards")?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-2.5 rounded font-semibold text-sm transition-all"
                style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(1 0 0 / 10%)", color: "oklch(0.82 0.008 220)" }}>
                View Work ↓
              </button>
            </div>
            {/* Inline tech stack */}
            <div className="flex flex-wrap gap-2">
              {["SQL · Presto/Trino", "Python", "R", "Tableau", "Looker", "ETL Pipelines", "Dashboard Design", "LLM-augmented Dev"].map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded"
                  style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 8%)", color: "oklch(0.65 0.015 220)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="py-16" style={{ background: "oklch(0.18 0.04 240)", borderTop: "1px solid oklch(1 0 0 / 8%)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-6 text-center">// by the numbers</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {METRICS.map((m, i) => <MetricCard key={m.label} {...m} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">// about</div>
          <h2 className="text-2xl font-bold text-foreground mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>Background & Approach</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-sm mb-4" style={{ color: "oklch(0.75 0.012 220)", lineHeight: "1.8" }}>
                Data analytics professional who builds <strong style={{ color: "oklch(0.88 0.008 220)" }}>production data systems from scratch</strong> — dashboards, SQL pipelines, statistical validation, and the processes around them. In the past year: designed 2 real-time dashboards (29 widgets), authored 15+ production SQL queries, built ETL workflows across 7+ source tables, and saved an estimated 100+ hrs/week in manual reporting across a 290-person AI program.
              </p>
              <p className="text-sm" style={{ color: "oklch(0.75 0.012 220)", lineHeight: "1.8" }}>
                15 years translating operational ambiguity into scalable, data-driven systems across AI, fintech, gaming, and lending. Currently focused on roles in <strong style={{ color: "oklch(0.88 0.008 220)" }}>Data Analytics, Data Science, Program Management, and Data Engineering</strong>.
              </p>
            </div>
            <div className="space-y-4">
              {Object.entries(SKILLS).map(([cat, skills]) => (
                <div key={cat}>
                  <div className="section-label mb-2" style={{ fontSize: "0.6rem" }}>{cat}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 8%)", color: "oklch(0.72 0.012 220)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARDS ── */}
      <section id="dashboards" className="py-20" style={{ background: "oklch(0.18 0.04 240)", borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">// dashboard work</div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Production Dashboards</h2>
          <p className="text-sm mb-10 max-w-2xl" style={{ color: "oklch(0.65 0.012 220)", lineHeight: "1.7" }}>
            Two production dashboards built from scratch on an enterprise BI platform — 29 total widgets used daily by 20+ team leads across 6 global regions. Sample views shown below with anonymized data.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {DASHBOARDS.slice(0, 2).map((d, i) => <DashboardCard key={d.id} dash={d} index={i} />)}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {DASHBOARDS.slice(2).map((d, i) => <DashboardCard key={d.id} dash={d} index={i + 2} />)}
          </div>
        </div>
      </section>

      {/* ── SQL SHOWCASE ── */}
      <section id="sql" className="py-20">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">// sql engineering</div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>SQL Query Showcase</h2>
          <p className="text-sm mb-10 max-w-2xl" style={{ color: "oklch(0.65 0.012 220)", lineHeight: "1.7" }}>
            Production-grade queries written in Presto/Trino SQL. Table and column names are generalized; the query architecture, CTE patterns, and JOIN logic are exactly as deployed. Toggle between SQL and sample output for each query.
          </p>
          <div className="space-y-6">
            {SQL_QUERIES.map((q, i) => <QuerySection key={q.id} query={q} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── TECHNICAL PATTERNS ── */}
      <section id="patterns" className="py-20" style={{ background: "oklch(0.18 0.04 240)", borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">// architecture</div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Technical Patterns</h2>
          <p className="text-sm mb-8 max-w-2xl" style={{ color: "oklch(0.65 0.012 220)", lineHeight: "1.7" }}>
            Recurring design patterns applied across all production queries — built for maintainability, scalability, and debuggability.
          </p>
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "oklch(0.24 0.035 240)", borderBottom: "1px solid oklch(1 0 0 / 8%)" }}>
                    <th className="px-5 py-3 text-left font-semibold" style={{ color: "oklch(0.65 0.14 195)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em" }}>Pattern</th>
                    <th className="px-5 py-3 text-left font-semibold" style={{ color: "oklch(0.65 0.14 195)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em" }}>Used In</th>
                    <th className="px-5 py-3 text-left font-semibold" style={{ color: "oklch(0.65 0.14 195)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.08em" }}>Why</th>
                  </tr>
                </thead>
                <tbody>
                  {TECHNICAL_PATTERNS.map((p, i) => (
                    <tr key={p.pattern} style={{ background: i % 2 === 0 ? "transparent" : "oklch(1 0 0 / 2%)", borderBottom: "1px solid oklch(1 0 0 / 5%)" }}>
                      <td className="px-5 py-3 font-medium" style={{ color: "oklch(0.88 0.008 220)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}>{p.pattern}</td>
                      <td className="px-5 py-3" style={{ color: "oklch(0.65 0.14 195)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>{p.usage}</td>
                      <td className="px-5 py-3" style={{ color: "oklch(0.68 0.012 220)" }}>{p.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── POKÉMON ANALYSIS ── */}
      <div id="pokemon"><PokemonSection /></div>

      {/* ── CHELSEA FC ANALYTICS ── */}
      <div id="chelsea"><ChelseaSection /></div>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20" style={{ background: "oklch(0.18 0.04 240)", borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="container max-w-5xl mx-auto px-6">
          <div className="section-label mb-3">// contact</div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Get in Touch</h2>
          <p className="text-sm mb-8 max-w-lg" style={{ color: "oklch(0.65 0.012 220)", lineHeight: "1.7" }}>
            Open to Data Analyst, Data Scientist, Program Manager, and Project Manager roles in tech. Based in Seattle, WA — open to remote.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:m.winters@me.com" className="flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "oklch(0.65 0.14 195)", color: "oklch(0.12 0.03 240)" }}>
              m.winters@me.com
            </a>
            <a href="tel:7758482670" className="flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm transition-all"
              style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(1 0 0 / 10%)", color: "oklch(0.82 0.008 220)" }}>
              775-848-2670
            </a>
            <a href="https://www.linkedin.com/in/mwinters123/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded font-semibold text-sm transition-all"
              style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(0.65 0.14 195 / 0.3)", color: "oklch(0.72 0.13 195)" }}>
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-6 text-center" style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
        <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.45 0.012 220)" }}>
          © 2026 Mike Winters · Data Analytics Portfolio · Seattle, WA
        </p>
      </footer>
    </div>
  );
}
