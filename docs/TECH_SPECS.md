# News-From — Technical Specs

Living technical reference. Phase 0 (the inert investor mockup) is the only built
phase; later sections record intended direction and will firm up as we get there.

## Phase 0 — Mockup stack (current)

- **Framework:** Next.js (App Router), TypeScript, React function components.
- **Styling:** Tailwind CSS. Theme tokens (off-white paper bg, serif headline
  font, stance color scale) defined once in the Tailwind config and referenced by
  name.
- **Charts:** react-chartjs-2 / chart.js for bars + line; bespoke SVG/CSS for the
  heatmap and positioning map (full control, no library fighting).
- **Data:** entirely hardcoded in `lib/mockData.ts`. No network, no DB, no LLM.
- **Runtime:** Node 20 LTS, npm.
- **Deploy:** Vercel.

### Aesthetic tokens
- Background: soft off-white paper (`~#f7f5f0`), never pure white.
- Headlines: serif (Georgia-class). Body/UI: restrained sans-serif.
- Stance scale: `#d64045` critical -> `#e9c46a` neutral -> `#2f9e54` supportive
  (intermediates `#e07a52` / `#74b97a`), tuned earthy for the warm-light theme.

### Structure
```
app/        layout.tsx, page.tsx (Overview),
            topic/[topicId], source/[sourceId], author/[authorId], globals.css
components/  StanceHeatmap, DivergingBars, PositioningMap, StanceTimeline,
            EvidenceList, LensShelf, Nav
lib/         mockData.ts, stance.ts (stance->color/label helpers), types.ts
```

### Removed from the legacy app
CRA + `react-app-rewired`, `config-overrides.js`, the Express server
(`server.js`, `server/`), MongoDB/mongoose, and the Node-polyfill deps
(`fs`, `os`, `path`, `crypto-browserify`, `stream-browserify`, etc.). Branding
assets (logo/banner) are carried over.

## Phase 1+ — Intended direction (not built)

- **Ingestion:** fetch full article text + bylines (not just RSS snippets); per-source
  fetch with independent error handling; normalize to a common article shape.
- **Analysis engine:** LLM (Claude) structured stance classification. Input: article
  text + a defined target entity. Output: `{ topic, subtopic, target, stance
  (-100..100), evidenceSpan, confidence }`. Validate via a forced structured-output
  schema. Model selection / cost / caching to be grounded against the Claude API
  reference when this phase starts.
- **Persistence:** database for articles + analyses over time (enables history and
  aggregation). Engine TBD at Phase 2.
- **Aggregation:** rollups by source x topic x time and author x topic x time.

The mockup's data model (`lib/mockData.ts` shape: Source, Author, Topic/Subtopic,
StanceCell with a time series, Evidence) is intentionally close to what the real
pipeline must produce, so the presentation layer survives the swap to real data.
