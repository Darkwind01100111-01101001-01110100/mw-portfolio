# Mike Winters — Data Analytics Portfolio

**Live site:** [mikewinters.netlify.app](https://mikewinters.netlify.app)

A personal portfolio built to showcase real data work — SQL patterns, dashboard architecture, and exploratory analysis — using anonymized/masked data representative of production systems.

---

## What's Inside

### SQL Showcase
Production-grade queries demonstrating multi-level CTEs, 5-way JOINs, dynamic task mapping across 7+ source tables, and window functions. Patterns drawn directly from operational analytics work at Meta.

### Dashboard Gallery
Two dashboard builds covering productivity, quality, and capacity metrics for a 350-person AI program. 29 widgets total. Built from scratch with no pre-existing infrastructure.

### Chelsea FC Analytics
EPL standings model and end-of-season points projection built in R (dplyr + purrr). Includes a live table with zone classification, form tracking, and a PPG extrapolation model. Data updated manually each matchweek — projections will be compared against final standings at season end.

### Pokémon Data Analysis
Exploratory analysis of the [Kaggle Pokémon dataset](https://www.kaggle.com/datasets/rounakbanik/pokemon) (801 Pokémon, 41 features) using Python/pandas. Covers type distribution, stat analysis by type, legendary vs. non-legendary comparisons, and an Eevee evolution controlled experiment (all 8 share BST=525 — a natural control group for stat distribution analysis).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Data (Chelsea) | R · dplyr · purrr · rvest |
| Data (Pokémon) | Python · pandas · matplotlib |
| Build | Vite |
| Hosting | Netlify (auto-deploy from this repo) |

---

## Data Notes

All dashboard and SQL data is **anonymized** — no internal or proprietary information is included. Logic, structure, and scale are representative of actual production work. Chelsea FC and Pokémon data are sourced from public datasets (BBC Sport, Wikipedia, Kaggle).

---

## Contact

**Mike Winters** · [m.winters@me.com](mailto:m.winters@me.com) · [LinkedIn](https://www.linkedin.com/in/mikewinters9)
