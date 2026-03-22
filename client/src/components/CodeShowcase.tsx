// CHELSEA FC -- CODE SHOWCASE COMPONENT
// Design: Terminal Clarity -- dark navy, teal accents
// Purpose: Show annotated R pipeline (scrape → project → SoS)
// =======================================================

import { useState } from "react";

const TEAL = "#22D3EE";
const MUTED = "oklch(0.60 0.015 220)";

const DATA_COLLECTION = `library(rvest)
library(dplyr)
library(stringr)
library(purrr)

# -- Scrape EPL standings (BBC Sport) --------------------
# Using rvest for HTML table extraction -- same pattern
# as production ETL: identify selector, extract, normalise.
scrape_epl_table <- function() {
  url  <- "https://www.bbc.com/sport/football/premier-league/table"
  page <- read_html(url)

  # CSS selector targets the standings <tr> rows
  rows <- page |>
    html_nodes("table tr") |>
    html_text()

  # Parse each row: position + team name fused in first cell
  parsed <- rows[-1] |>   # drop header row
    map_dfr(~{
      vals <- str_split(.x, "\\\\s{2,}")[[1]] |>
        str_trim() |>
        .[nchar(.) > 0]

      tibble(
        pos    = as.integer(str_extract(vals[1], "^\\\\d+")),
        team   = str_remove(vals[1], "^\\\\d+"),
        played = as.integer(vals[2]),
        won    = as.integer(vals[3]),
        drawn  = as.integer(vals[4]),
        lost   = as.integer(vals[5]),
        gf     = as.integer(vals[6]),
        ga     = as.integer(vals[7]),
        gd     = as.integer(vals[8]),
        pts    = as.integer(vals[9]),
        # Extract last 6 W/D/L characters as form string
        form   = str_extract_all(vals[10], "[WDL]")[[1]] |>
                   tail(6) |> paste(collapse = "")
      )
    })

  return(parsed)
}

# Run and inspect
epl <- scrape_epl_table()
glimpse(epl)
# Rows: 20 | Cols: 11
# Chelsea: pos=6, pts=48, form="WDDLWL"`;

const PROJECTION_MODEL = `# -- Project end-of-season finish from current form ------
# Mirrors production SQL: CASE WHEN for classification,
# window functions for rolling aggregates.
calculate_projected_finish <- function(team_data) {
  team_data |>
    mutate(
      # Points per game -- simple rate metric
      ppg = pts / played,

      # Linear projection to 38 games
      # Note: does NOT account for fixture difficulty
      # (see strength-of-schedule model, tab 3)
      projected_pts = round(ppg * 38, 0),

      # Zone classification -- equivalent to SQL CASE WHEN
      projected_zone = case_when(
        projected_pts >= 82 ~ "Title Contention",
        projected_pts >= 67 ~ "Champions League",
        projected_pts >= 55 ~ "Europa League",
        projected_pts >= 40 ~ "Mid-table",
        TRUE                ~ "Relegation Battle"
      ),

      # Rolling form score: W=3, D=1, L=0 over last 5
      # purrr::map_dbl applies a lambda to each form string
      form_pts = purrr::map_dbl(form, ~{
        chars <- strsplit(.x, "")[[1]]
        sum(ifelse(chars == "W", 3,
            ifelse(chars == "D", 1, 0)))
      }),

      # Momentum: is recent form above season average?
      season_pts_per5 = (won * 3 + drawn) / played * 5,
      momentum = if_else(
        form_pts > season_pts_per5, "positive", "negative"
      )
    ) |>
    arrange(desc(pts))
}

# Chelsea output (MW30):
# ppg: 1.60 | projected: 61 pts | zone: Europa League
# form_pts: 5 | momentum: negative`;

const STRENGTH_OF_SCHEDULE = `# -- Strength of Remaining Schedule (SoRS) ---------------
# For each team: average pts of remaining opponents.
# Higher SoRS = harder remaining fixtures.
#
# Requires: fixtures data frame with home_team, away_team
# columns for unplayed matches only.

calculate_sos <- function(epl_table, fixtures_remaining) {
  # Build opponent strength lookup
  team_strength <- epl_table |>
    select(team, pts) |>
    rename(opp_pts = pts)

  # Join fixtures to get opponent strength
  sos_scores <- fixtures_remaining |>
    # pivot_longer to get both home and away perspectives
    pivot_longer(
      cols      = c(home_team, away_team),
      names_to  = "side",
      values_to = "team"
    ) |>
    mutate(
      opponent = if_else(side == "home_team",
                         away_team, home_team)
    ) |>
    left_join(team_strength, by = c("opponent" = "team")) |>
    group_by(team) |>
    summarise(
      remaining_games = n(),
      avg_opp_pts     = round(mean(opp_pts, na.rm = TRUE), 1),
      sos_rank        = dense_rank(desc(avg_opp_pts)),
      .groups = "drop"
    )

  # Merge back and compute SoS-adjusted projection
  epl_table |>
    left_join(sos_scores, by = "team") |>
    mutate(
      # Penalty/bonus: harder schedule reduces expected pts
      sos_adjusted_proj = projected_pts -
        round((avg_opp_pts - mean(avg_opp_pts)) * 0.15, 0)
    )
}

# Chelsea SoRS (MW31):
# avg_opp_pts = 44.2 | rank = 8th hardest
# SoS-adjusted projection: 59 pts (vs 61 raw)`;

const CODE_TABS = [
  {
    id: "scrape",
    label: "1. Data Collection",
    lang: "R · rvest + httr",
    description:
      "Scraping EPL standings from BBC Sport using rvest. The HTML table extraction pattern mirrors production ETL: identify selector, extract, normalise, type-cast. The form string parser uses regex to pull the last 6 W/D/L characters.",
    code: DATA_COLLECTION,
  },
  {
    id: "project",
    label: "2. Projection Model",
    lang: "R · dplyr + purrr",
    description:
      "Points-per-game projection to 38 games, rolling form scoring (last 5 results), and zone classification. The case_when block is a direct analogue of CASE WHEN in production SQL -- same logic, different syntax.",
    code: PROJECTION_MODEL,
  },
  {
    id: "sos",
    label: "3. Strength of Schedule",
    lang: "R · dplyr + tidyr",
    description:
      "Remaining fixture difficulty per team, weighted by opponent current points. Uses pivot_longer to get both home and away perspectives from a fixtures table -- the same unpivot pattern used in production data modelling.",
    code: STRENGTH_OF_SCHEDULE,
  },
];

export default function CodeShowcase() {
  const [activeCode, setActiveCode] = useState("scrape");
  const active = CODE_TABS.find((t) => t.id === activeCode)!;

  return (
    <div>
      <div
        className="section-label mb-3"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: TEAL,
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        // how it&apos;s built -- annotated R pipeline
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {CODE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveCode(t.id)}
            className="px-3 py-1.5 rounded text-xs transition-all"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background:
                activeCode === t.id
                  ? "oklch(0.65 0.14 195 / 0.15)"
                  : "oklch(1 0 0 / 4%)",
              border: `1px solid ${
                activeCode === t.id
                  ? "oklch(0.65 0.14 195 / 0.4)"
                  : "oklch(1 0 0 / 8%)"
              }`,
              color: activeCode === t.id ? TEAL : MUTED,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p
        className="text-xs mb-3"
        style={{ color: MUTED, lineHeight: "1.6" }}
      >
        {active.description}
      </p>

      {/* Terminal block */}
      <div
        className="overflow-hidden rounded"
        style={{
          background: "oklch(0.13 0.03 240)",
          border: "1px solid oklch(0.65 0.14 195 / 0.2)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: "oklch(0.65 0.14 195 / 0.2)" }}
        >
          <div className="flex gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.65 0.22 25)" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.75 0.18 80)" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.65 0.20 145)" }}
            />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: MUTED,
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {active.lang}
          </span>
        </div>

        {/* Code */}
        <pre
          className="p-4 overflow-x-auto overflow-y-auto leading-relaxed"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: "oklch(0.82 0.008 220)",
            maxHeight: "360px",
            fontSize: "0.72rem",
            margin: 0,
            whiteSpace: "pre",
            fontStyle: "normal",
          }}
        >
          {active.code}
        </pre>
      </div>
    </div>
  );
}
