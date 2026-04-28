# Mike Winters — Data Analytics Portfolio

**Live site:** [mikewinters.netlify.app](https://mikewinters.netlify.app)

Personal data analytics portfolio showcasing production-level SQL, dashboard builds, and exploratory analysis projects. All data is anonymized — no internal or proprietary information is included. The logic, structure, and scale are representative of real work.

---

## What's Inside

| Section | Description |
|---|---|
| **SQL Showcase** | 15+ Presto/Trino queries — multi-level CTEs, 5-way JOINs, dynamic task mapping, conditional aggregation across 7+ source tables |
| **Production Dashboards** | Two dashboard builds totaling 29 widgets covering productivity, quality, and capacity metrics for a 350-person AI program |
| **Technical Patterns** | Recurring design patterns applied across production queries: VALUES-based task mapping, calendar dimension JOINs, UNION ALL period stacking, LEFT JOIN preservation |
| **Chelsea FC Analytics** | EPL standings model with PPG-based points projection, Chelsea Deep-Dive tab, and UCL bracket — built in R (rvest, dplyr, ggplot2) |
| **Pokémon Analysis** | Controlled stat comparison across all 8 Eeveelutions using Python/pandas — a natural experiment where all subjects share an identical base stat total of 525 |

---

## Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Data (Chelsea) | R — rvest, dplyr, tidyr, ggplot2 |
| Data (Pokémon) | Python — pandas, numpy |
| Hosting | Netlify (auto-deploy from this repo) |

---

## Data Notes

All dashboard and SQL examples use anonymized data. No internal Meta systems, proprietary datasets, or personally identifiable information is included. The Chelsea FC and Pokémon datasets are sourced from publicly available data (BBC Sport, Wikipedia, Kaggle).

---

## Changelog

### Apr 27, 2026
- Rewrote all commit messages to standard developer format; updated git author attribution
- Added README with project overview and changelog
- Audited codebase for clarity and removed internal tooling references

### Mar 26, 2026
- Cleaned up Chelsea section copy; fixed zone legend dot styling (rounded-full circles)
- Removed all "Static snapshot" language; replaced with clean Matchweek 31 · Mar 25, 2026 references

### Mar 25, 2026
- Added responsive hamburger menu for mobile nav (desktop unchanged)
- Fixed mobile layout in Pokémon Eevee tab: responsive radar, stacked grid, readable stat bars
- Updated CV download link to latest version
- Fixed SQL nav highlight: widened IntersectionObserver zone for shorter sections

### Mar 21–24, 2026
- Initial build: hero, metrics, about, dashboards, SQL showcase, technical patterns, contact
- Added Chelsea FC Analytics section: EPL table, Deep-Dive tab, UCL bracket
- Added Pokémon analysis section with real Kaggle data (801 Pokémon, 4 tabs, Eevee radar)
- Added full-screen lightbox for dashboard images
- Reordered Chelsea before Pokémon in nav; added end-of-season predictions panel

---

## Contact

**Mike Winters** · [m.winters@me.com](mailto:m.winters@me.com) · [LinkedIn](https://www.linkedin.com/in/mikewinters9)
