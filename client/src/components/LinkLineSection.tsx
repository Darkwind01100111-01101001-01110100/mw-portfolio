// LinkLineSection.tsx
// Project: Link 1 Line — Two Recoveries
// Design: Obsidian V3 — matches portfolio theme
// Data sources: Sound Transit Annual Reports, PSRC, Queen Anne News
// Data as of: May 2026 (2025 annual figures)

import { useState } from "react";

const BG   = "#0a0a0b";
const BG2  = "#111113";
const BG3  = "#16161a";
const BORDER  = "rgba(255,255,255,0.07)";
const TEXT  = "#e8e6f0";
const TEXT2 = "#9b97b0";
const TEXT3 = "#6b6880";
const ACCENT  = "#7c6aff";
const ACCENT2 = "#a594ff";
const TEAL    = "#2dd4bf";
const TEAL2   = "#5eead4";
const MONO    = "'JetBrains Mono', monospace";
const DISPLAY = "'Fraunces', serif";
const SANS    = "'Space Grotesk', sans-serif";

// ── Data ──────────────────────────────────────────────
// Sound Transit systemwide boardings (millions) — annual
// Source: Sound Transit Annual Reports + PSRC 2025
const RIDERSHIP = [
  { year: 2019, total: 46.9,  link: 23.1, commuter: 23.8, baseline: true },
  { year: 2020, total: 15.5,  link: 8.2,  commuter: 7.3  },
  { year: 2021, total: 17.4,  link: 9.8,  commuter: 7.6  },
  { year: 2022, total: 31.8,  link: 19.2, commuter: 12.6 },
  { year: 2023, total: 37.3,  link: 23.4, commuter: 13.9 },
  { year: 2024, total: 41.4,  link: 27.6, commuter: 13.8 },
  { year: 2025, total: 44.2,  link: 30.1, commuter: 14.1 },
];

// Recovery % vs 2019 baseline
const RECOVERY = [
  { year: 2020, link: 35,  commuter: 31 },
  { year: 2021, link: 42,  commuter: 32 },
  { year: 2022, link: 83,  commuter: 53 },
  { year: 2023, link: 101, commuter: 58 },
  { year: 2024, link: 119, commuter: 58 },
  { year: 2025, link: 130, commuter: 59 },
];

// Key 1 Line stations with ridership character
const STATIONS = [
  { name: "SeaTac / Airport", type: "Airport", character: "Leisure + essential travel", trend: "Fully recovered" },
  { name: "Rainier Beach",    type: "Residential", character: "Transit-dependent community", trend: "Above 2019" },
  { name: "Columbia City",   type: "Residential", character: "Gentrifying corridor", trend: "Above 2019" },
  { name: "Capitol Hill",    type: "Urban core", character: "Nightlife, events, residents", trend: "Significantly above 2019" },
  { name: "UW / Husky",      type: "Institutional", character: "Students + medical center", trend: "Above 2019" },
  { name: "Northgate",       type: "Suburban hub", character: "Park & ride + mall", trend: "Mixed recovery" },
  { name: "Lynnwood CC",     type: "New (2024)", character: "Suburban extension", trend: "New station" },
];

// Fare compliance — proxy for rider demographics shift
const FARE_COMPLIANCE = [
  { year: 2019, pct: 86 },
  { year: 2020, pct: 52 },
  { year: 2021, pct: 48 },
  { year: 2022, pct: 51 },
  { year: 2023, pct: 56 },
  { year: 2024, pct: 61 },
];

const R_CODE = `library(tidyverse)

# Load Sound Transit annual ridership data
ridership <- read_csv("sound_transit_ridership.csv")

# Compute recovery index vs 2019 baseline
baseline_2019 <- ridership %>%
  filter(year == 2019) %>%
  select(mode, boardings) %>%
  rename(baseline = boardings)

recovery <- ridership %>%
  left_join(baseline_2019, by = "mode") %>%
  mutate(recovery_pct = round(boardings / baseline * 100, 1))

# Divergence plot: Link vs commuter rail
recovery %>%
  filter(mode %in% c("Link light rail", "Commuter rail + Express")) %>%
  ggplot(aes(x = year, y = recovery_pct, color = mode)) +
  geom_hline(yintercept = 100, linetype = "dashed",
             color = "grey60", linewidth = 0.5) +
  geom_line(linewidth = 1.2) +
  geom_point(size = 3) +
  annotate("text", x = 2023.1, y = 103,
           label = "Link crosses 100%", size = 3,
           hjust = 0, color = "#2dd4bf") +
  scale_color_manual(values = c("#2dd4bf", "#7c6aff")) +
  labs(title = "Two Recoveries: Link vs Commuter Rail",
       subtitle = "% of 2019 ridership baseline",
       x = NULL, y = "Recovery Index (2019 = 100%)") +
  theme_minimal()`;

const SQL_CODE = `-- Recovery index by mode and year
SELECT
  year,
  mode,
  boardings_millions,
  ROUND(
    100.0 * boardings_millions
      / FIRST_VALUE(boardings_millions)
          OVER (PARTITION BY mode ORDER BY year),
    1
  ) AS recovery_pct_vs_2019
FROM transit_ridership
WHERE year BETWEEN 2019 AND 2025
ORDER BY mode, year;`;

export default function LinkLineSection({ embedded }: { embedded?: boolean }) {
  const [codeTab, setCodeTab] = useState<"r" | "sql">("r");
  const [view, setView] = useState<"recovery" | "stations" | "fare">("recovery");

  const maxTotal = Math.max(...RIDERSHIP.map(d => d.total));

  return (
    <div style={{ fontFamily: SANS }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          // data analysis · r · ggplot2 · seattle · sound transit · psrc
        </div>
        <h3 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 300, color: TEXT, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Seattle Link Light Rail: Two Recoveries
        </h3>
        <p style={{ fontSize: "0.875rem", color: TEXT2, lineHeight: 1.8, maxWidth: 680, marginBottom: "0.5rem" }}>
          Sound Transit's commuter rail and express buses are stuck at ~59% of their 2019 ridership. Seattle's Link 1 Line — the light rail spine running from Lynnwood through downtown to the airport — is at 130% and climbing. This isn't a recovery story. It's a transformation: from a downtown commuter tool to a regional lifestyle infrastructure layer serving events, students, and transit-dependent communities who were always there.
        </p>
        <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3 }}>
          Data as of 2025 annual figures · Sources: Sound Transit Annual Reports, PSRC Regional Transportation Plan 2025
        </div>
      </div>

      {/* ── Key stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
        {[
          { label: "Link Recovery", value: "130%", sub: "of 2019 baseline (2025)", color: TEAL2 },
          { label: "Commuter Rail", value: "59%",  sub: "of 2019 baseline (2025)", color: ACCENT2 },
          { label: "Oct 2024 Record", value: "106K", sub: "avg weekday boardings",  color: TEAL2 },
          { label: "Lynnwood Ext.", value: "Aug '24", sub: "+8.5 mi, 4 stations",  color: ACCENT2 },
        ].map(s => (
          <div key={s.label} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.5rem", padding: "1rem" }}>
            <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>{s.label}</div>
            <div style={{ fontFamily: MONO, fontSize: "1.4rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "0.7rem", color: TEXT3, marginTop: "0.25rem" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── View toggle ── */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem", borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
        {([
          { id: "recovery", label: "Recovery Divergence" },
          { id: "stations", label: "Station Character" },
          { id: "fare",     label: "Fare Compliance" },
        ] as const).map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            style={{
              fontFamily: MONO, fontSize: "0.65rem",
              background: "transparent", border: "none", cursor: "pointer",
              color: view === v.id ? TEAL2 : TEXT3,
              padding: "0.5rem 0.9rem",
              borderBottom: view === v.id ? `2px solid ${TEAL}` : "2px solid transparent",
              marginBottom: "-1px",
              transition: "all 0.15s",
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* ── Recovery divergence chart ── */}
      {view === "recovery" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>
            Recovery Index vs 2019 Baseline (100% = pre-pandemic)
          </div>
          {/* Chart */}
          <div style={{ position: "relative", height: 180 }}>
            {/* 100% line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: "33%", borderTop: "1px dashed rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <span style={{ fontFamily: MONO, fontSize: "0.5rem", color: TEXT3, paddingRight: "0.25rem" }}>100%</span>
            </div>
            {/* Bars side by side */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "100%", paddingBottom: "1.5rem" }}>
              {RECOVERY.map(r => (
                <div key={r.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: 140 }}>
                    {/* Link bar */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ fontFamily: MONO, fontSize: "0.45rem", color: TEAL2, marginBottom: 2 }}>{r.link}%</div>
                      <div style={{
                        width: "100%",
                        height: `${Math.min(r.link, 140)}px`,
                        background: r.link >= 100
                          ? `linear-gradient(to top, ${TEAL}, ${TEAL2})`
                          : `linear-gradient(to top, rgba(45,212,191,0.4), rgba(94,234,212,0.4))`,
                        borderRadius: "2px 2px 0 0",
                        maxHeight: 140,
                      }} />
                    </div>
                    {/* Commuter bar */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ fontFamily: MONO, fontSize: "0.45rem", color: ACCENT2, marginBottom: 2 }}>{r.commuter}%</div>
                      <div style={{
                        width: "100%",
                        height: `${Math.min(r.commuter, 140)}px`,
                        background: `linear-gradient(to top, rgba(124,106,255,0.4), rgba(165,148,255,0.4))`,
                        borderRadius: "2px 2px 0 0",
                        maxHeight: 140,
                      }} />
                    </div>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>{r.year}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 10, height: 10, background: TEAL, borderRadius: 2 }} />
              <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>Link light rail</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 10, height: 10, background: ACCENT, borderRadius: 2, opacity: 0.5 }} />
              <span style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>Commuter rail + ST Express</span>
            </div>
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            Link crossed 100% recovery in 2023 and has continued climbing — driven by the Lynnwood extension, East Link opening, and a structural shift toward non-commute trips (events, airport, students). Commuter modes remain at ~59%, reflecting the permanent reduction in downtown office density.
          </p>
        </div>
      )}

      {/* ── Station character ── */}
      {view === "stations" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            1 Line Station Character — Angle Lake → Lynnwood City Center
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {STATIONS.map((s, i) => (
              <div key={s.name} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5rem", padding: "0.75rem",
                background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.4rem",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: "0.7rem", color: TEXT }}>{s.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, marginTop: "0.15rem" }}>{s.type}</div>
                </div>
                <div style={{ fontSize: "0.75rem", color: TEXT2 }}>{s.character}</div>
                <div style={{
                  fontFamily: MONO, fontSize: "0.6rem",
                  color: s.trend.includes("above") || s.trend.includes("Significantly") ? TEAL2
                       : s.trend === "New station" ? ACCENT2
                       : s.trend === "Mixed recovery" ? "#f59e0b"
                       : TEXT2,
                  textAlign: "right",
                }}>{s.trend}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            The Rainier Valley corridor (Rainier Beach → Columbia City → Beacon Hill) serves Seattle's most transit-dependent communities and has recovered fastest — these riders never had the option to work from home. Capitol Hill and UW stations reflect the lifestyle and institutional demand that now drives the line's above-baseline performance.
          </p>
        </div>
      )}

      {/* ── Fare compliance ── */}
      {view === "fare" && (
        <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Fare Compliance Rate — Link Light Rail (% of boardings with valid fare media)
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: 120, marginBottom: "0.75rem" }}>
            {FARE_COMPLIANCE.map(f => (
              <div key={f.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ fontFamily: MONO, fontSize: "0.6rem", color: f.pct >= 80 ? TEAL2 : f.pct >= 60 ? ACCENT2 : "#f59e0b" }}>
                  {f.pct}%
                </div>
                <div style={{
                  width: "100%", height: `${f.pct}px`,
                  background: f.pct >= 80
                    ? `linear-gradient(to top, ${TEAL}, ${TEAL2})`
                    : f.pct >= 60
                    ? `linear-gradient(to top, ${ACCENT}, ${ACCENT2})`
                    : "linear-gradient(to top, #f59e0b, #fbbf24)",
                  borderRadius: "2px 2px 0 0",
                  maxHeight: 100,
                }} />
                <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3 }}>{f.year}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.78rem", color: TEXT2, lineHeight: 1.7, marginBottom: 0 }}>
            Fare compliance dropped from 86% in 2019 to 48% at the pandemic nadir — reflecting both suspended enforcement and a shift toward more transit-dependent riders who face greater financial barriers. The Fare Ambassador program launched in 2022 has driven recovery to 61% by 2024, but the gap from 2019 remains a proxy for the changed demographic composition of the ridership base.
          </p>
        </div>
      )}

      {/* ── Code section ── */}
      <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: "0.625rem", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
          {(["r", "sql"] as const).map(t => (
            <button key={t} onClick={() => setCodeTab(t)}
              style={{
                fontFamily: MONO, fontSize: "0.65rem", fontWeight: 500,
                background: "transparent", border: "none", cursor: "pointer",
                color: codeTab === t ? TEAL2 : TEXT3,
                padding: "0.6rem 1.25rem",
                borderBottom: codeTab === t ? `2px solid ${TEAL}` : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.15s",
              }}>
              {t === "r" ? "R — ggplot2 divergence chart" : "SQL — recovery index"}
            </button>
          ))}
        </div>
        <div className="query-card-pad">
          <pre className="sql-pre-mobile" style={{
            fontFamily: MONO, fontSize: "0.72rem", color: TEXT2,
            margin: 0, overflowX: "auto", lineHeight: 1.7,
            whiteSpace: "pre",
          }}>
            <code>{codeTab === "r" ? R_CODE : SQL_CODE}</code>
          </pre>
        </div>
      </div>

      {/* ── Methodology ── */}
      <div style={{ marginTop: "1.25rem", padding: "1rem", background: BG2, border: `1px solid ${BORDER}`, borderRadius: "0.5rem" }}>
        <div style={{ fontFamily: MONO, fontSize: "0.55rem", color: TEXT3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Methodology</div>
        <p style={{ fontSize: "0.75rem", color: TEXT3, lineHeight: 1.7, margin: 0 }}>
          Ridership figures from Sound Transit Annual Reports (2019–2025) and PSRC Puget Sound Trends (June 2025). "Commuter rail + ST Express" aggregates Sounder commuter rail and ST Express bus boardings. Fare compliance data from Sound Transit Fare Revenue Reports. Station character classifications are qualitative, based on Sound Transit ridership pattern reports and Seattle Transit Blog analysis. 2025 figures are preliminary annual estimates.
        </p>
      </div>
    </div>
  );
}
