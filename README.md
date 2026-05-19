# Mike Winters — Data Analytics Portfolio

**Live site:** [mikewinters.netlify.app](https://mikewinters.netlify.app)

Personal data analytics portfolio showcasing production-level SQL, dashboard builds, and exploratory analysis projects. All data is anonymized — no internal or proprietary information is included. The logic, structure, and scale are representative of real work.

---

## What's Inside

| Section | Description |
|---|---|
| **Hero** | Two-column layout with core competency cards, tech stack tags, and career metrics |
| **By the Numbers** | Animated metric counters — 15+ years, 100+ dashboard widgets, 50+ SQL queries, 100+ hrs/week saved, 400+ contractors managed |
| **About** | Background and skills breakdown — languages, data engineering, BI & visualization, analytics, AI & automation, operations |
| **Production Dashboards** | 10+ production dashboards and automated pipelines — productivity, quality, operational performance, and capacity/workforce views. 100+ total widgets, used daily by 20+ team leads across 6 global regions |
| **SQL Showcase** | Production-grade Presto/Trino queries — multi-level CTEs (4-6 deep), VALUES-based task mapping, window functions, UNION ALL period comparisons, statistical QA coverage checks |
| **Technical Patterns** | Recurring design patterns across all production queries: VALUES-based task mapping, calendar dimension JOINs, UNION ALL period stacking, conditional aggregation, LEFT JOIN preservation |
| **Tech Layoffs 2022–2026** | Analysis of the 4-year tech layoff cycle across 5,000+ events — annual trends, sector breakdown, top company events, and 2026 YTD pacing vs. prior peaks. Data sourced from trueup.io |
| **Seattle Link Light Rail** | Post-pandemic ridership divergence study — Link 1 Line at 130% of 2019 baseline while commuter rail remains at 59%; station character, fare compliance, and Lynnwood extension impact. Built in R/ggplot2 |
| **This Portfolio** | The portfolio itself as a project entry — custom design system, live SQL explorer with sample outputs, React 19 + TypeScript + Tailwind |
| **Contact** | Netlify Forms contact form with honeypot spam protection; links to email, LinkedIn, GitHub |

---

## Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Data (Tech Layoffs) | Python — pandas, SQL, trueup.io dataset |
| Data (Link Light Rail) | R — ggplot2, Sound Transit open data |
| Hosting | Netlify (auto-deploy from this repo via GitHub) |

---

## CV

The portfolio includes an inline CV preview modal — "View CV" opens a Google Drive embed with a direct PDF download. The CV uses an Amber/dark sidebar layout, is ATS-optimized with plain-text bullet markers, and fits on a single page.

---

## Data Notes

All dashboard and SQL examples use anonymized data. No internal Meta systems, proprietary datasets, or personally identifiable information is included. Tech layoff data is sourced from [trueup.io](https://www.trueup.io/layoffs). Transit ridership data is from [Sound Transit open data](https://www.soundtransit.org/help-center/open-transit-data-otd). The 2026 layoff figures are clearly labeled as partial-year (YTD) snapshots.

---

## Changelog

### May 19, 2026
- Refreshed hero and about copy — plain first-person voice, automation/pipeline framing
- Deleted dead components: ChelseaSection, PokemonSection, CodeShowcase
- Removed POKEMON_DATA from portfolioData.ts
- Fixed patterns table min-width (mobile-only, no longer overlaps large screens)
- Updated AI & Automation skills: GenAI Data Operations, Multi-modal Annotation, LLM Workflow Design, Automated Reporting
- Updated dashboard count to 10+ with automation context across all sections
- Improved text contrast site-wide (TEXT2 #b8b4cc, TEXT3 #8a8699)
- Added 2026 Big Tech layoff breakdown table with sourced trueup.io figures
- Transit tabs: pill-style with visible active state; chart titles white
- Hero side-by-side layout restored on desktop

### May 18, 2026
- Replaced Chelsea FC Analytics and Pokémon tabs with Tech Layoffs 2022–2026 and Seattle Link Light Rail: Two Recoveries
- Added mobile layout fixes: grid-mobile-stack scoped to <768px, section padding, SQL code blocks, project tabs
- Updated 2026 layoff figures with verified trueup.io data (Q1: 81,706 / Q2 partial: 37,641 as of May 18)
- Fixed vite.config.ts allowedHosts for deployment

### May 12, 2026
- Mobile responsive layout fix: hero, about, contact, and dashboard grids collapse correctly on small screens

### May 1, 2026
- Added inline CV preview modal with Google Drive embed and PDF download
- Added Netlify contact form with honeypot spam protection
- Wired "Hire Me" buttons to scroll to contact section
- Removed all third-party build tooling fingerprints from source files

---

## Contact

**Mike Winters** · [m.winters@me.com](mailto:m.winters@me.com) · [LinkedIn](https://www.linkedin.com/in/mwinters123) · [mikewinters.netlify.app](https://mikewinters.netlify.app)
