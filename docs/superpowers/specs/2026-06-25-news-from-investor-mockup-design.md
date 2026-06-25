# News-From — Investor Mockup Design

**Date:** 2026-06-25
**Status:** Approved (design); pending spec review
**Supersedes:** `2026-06-25-news-from-modernization-design.md` (superseded after the
product concept pivoted from keyword-frequency to stance analysis)

## Background & pivot

News-From began as a keyword-frequency tool (count how often a term appears in
each source's RSS headlines). The product vision has changed: it is now a
**stance-analysis** product — for a given source (or Op-Ed author) and topic, is
the coverage *favorable or unfavorable toward a subject* (e.g., is CNN's coverage
of the reflecting-pool controversy critical or supportive of the administration).
The long-term vision includes per-source and per-author drill-downs, subtopics,
historical stance tracking, an overall score, and comparison visualizations.

The real product depends on a hard, unsolved core (reliable target-stance
detection via an LLM pipeline, full-text ingestion, persistence, aggregation).
Rather than build that first, this project delivers a **deployable, inert mockup**
of the full vision for an investor pitch. The mockup proves the *experience* and
the *visual language*; the hard engineering is what the pitch raises money to build.

## Goal

A polished, clickable, **completely inert** web app — all data hardcoded, no RSS,
no LLM, no database, no real logic — deployed to a live Vercel URL, demonstrating
the full product vision in roughly 60 seconds.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Purpose | Investor-pitch mockup; inert, hardcoded data |
| Cleanup | Scaffold fresh; delete CRA / Express / MongoDB / polyfills; keep branding assets |
| Stack | Next.js (App Router) + TypeScript + Tailwind CSS |
| Deploy | Vercel (live URL) |
| Aesthetic | "Editorial light" — off-white (not pure white) paper background, serif headlines, restrained sans body, generous whitespace |
| Stance scale | Red (critical) &harr; green (supportive), tuned earthy for the warm-light palette |
| Overview layout | Full-width heatmap hero + horizontal "lens shelf" of the other three views (Layout 2) |
| Visualizations | Heatmap (default) + diverging bars + positioning map + stance-over-time; all available |
| Screens | Overview, Single-topic cross-source, Source deep-dive, Author deep-dive |
| Polish split | Overview + Single-topic fully polished; Source + Author present but lighter |
| Disclaimer | None in-app for now (founder will note "illustrative data" verbally in the pitch) |
| Docs | In-repo Markdown: ROADMAP.md, TECH_SPECS.md, TODO.md |

## Aesthetic

- **Background:** soft off-white / paper tone (e.g. `#f7f5f0`-ish), never pure white.
- **Headlines:** serif (Georgia-class). **Body/UI:** restrained sans-serif.
- **Stance palette (diverging):** red `#d64045` (critical) -> amber `#e9c46a`
  (neutral) -> green `#2f9e54` (supportive), with intermediate `#e07a52` /
  `#74b97a`. Tuned slightly earthy to sit in the warm-light theme. Defined once as
  Tailwind theme tokens and referenced by name.
- Generous whitespace; quiet borders; the data does the talking.

## Visualizations (shared components)

All four are reusable presentational components driven by `mockData`:

- **StanceHeatmap** — sources (rows) x topics (cols); each cell colored by stance.
  Cells are clickable -> Single-topic view. The Overview hero.
- **DivergingBars** — one topic, every source/author; bars grow left (critical) or
  right (supportive) from a neutral center.
- **PositioningMap** — each source a bubble: x = stance, y = coverage volume,
  size = volume. "Media landscape" view.
- **StanceTimeline** — favorability over time, one line per source/author; the
  historical view.

Charting library: react-chartjs-2 / chart.js where it helps (bars, line); the
heatmap and positioning map are simplest as bespoke SVG/CSS for full control.

## Screens & navigation

1. **Overview (`/`)** — Layout 2. Full-width **StanceHeatmap** hero with a header
   ("Where the press stands"), and a horizontal **lens shelf** below holding live,
   clickable **DivergingBars**, **PositioningMap**, and **StanceTimeline** panels.
   - Click a heatmap cell -> Single-topic view for that (source, topic).
   - Click a lens panel -> promote that lens to a larger view.
   - The "wow / lots to explore" screen. Fully polished.

2. **Single-topic cross-source (`/topic/[topicId]`)** — one topic across all
   sources: DivergingBars (who is critical/supportive), StanceTimeline, and a list
   of **evidence headlines**, each tagged with its stance and source. Also the
   heatmap-cell drill-down target. Fully polished.

3. **Source deep-dive (`/source/[sourceId]`)** — click a source -> its **subtopics**
   with per-subtopic favorability -> click a subtopic -> StanceTimeline for that
   source on that subtopic. Present and clickable; lighter polish.

4. **Author deep-dive (`/author/[authorId]`)** — same drill-down pattern for an
   Op-Ed author: name -> subtopics -> stance over time. Present and clickable;
   lighter polish.

Global chrome: a simple top nav (logo + "Sources" / "Authors" entry points).

## Data model (single source of truth)

`lib/mockData.ts` holds all fake data so every screen stays internally consistent.
Shape (illustrative):

```ts
type Stance = number;            // -100 (critical) .. +100 (supportive)

interface Source   { id; name; }                 // ~4: CNN, Fox, NYT, Reuters
interface Author   { id; name; outlet; }         // ~2 Op-Ed authors
interface Topic    { id; name; subtopics: Subtopic[]; }   // ~5 topics
interface Subtopic { id; name; }

interface StanceCell {           // one (entity x topic) reading
  entityId; entityType: 'source' | 'author';
  topicId; stance: Stance; volume: number;
  series: { date: string; stance: Stance }[];    // short time series
}

interface Evidence {             // fake headlines backing a cell
  id; sourceId; topicId; headline; stance: Stance; date;
}
```

All values are authored by hand to be plausible and tell a coherent story (clear
leans, a few neutral/Reuters rows, believable trends).

## Project structure

```
app/
  layout.tsx                  global chrome, fonts, theme
  page.tsx                    Overview
  topic/[topicId]/page.tsx    Single-topic cross-source
  source/[sourceId]/page.tsx  Source deep-dive
  author/[authorId]/page.tsx  Author deep-dive
  globals.css                 Tailwind directives + base
components/
  StanceHeatmap.tsx
  DivergingBars.tsx
  PositioningMap.tsx
  StanceTimeline.tsx
  EvidenceList.tsx
  LensShelf.tsx               wraps the three non-hero lenses on Overview
  Nav.tsx
lib/
  mockData.ts                 all hardcoded data
  stance.ts                   tiny helpers: stance -> color, label, formatting
  types.ts
```

## Out of scope (this mockup)

Real RSS ingestion, full-text fetching, the LLM stance engine, persistence/DB,
auth, aggregation pipelines, and any claim of accuracy. These are the roadmap the
mockup pitches — see `docs/ROADMAP.md`.

## Risks / notes

- The mockup must never read as production data; the founder handles this verbally
  in the pitch (no in-app disclaimer for now). Revisit if the demo circulates
  unattended.
- Keep `mockData.ts` coherent — contradictory fake numbers across screens would
  undercut the demo. One file, authored together.
