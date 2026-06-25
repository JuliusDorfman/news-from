# News-From — Modernization Design

**Date:** 2026-06-25
**Status:** Approved (design); pending spec review
**Type:** Full rewrite on a modern stack (code + tooling + redeploy)

## Background

News-From lets you compare how different news outlets cover the same topics:
pull each source's RSS headlines, type comma-separated keywords, and see the
per-source frequency of those keywords highlighted in the headlines and charted.

The existing implementation works but has aged badly:

- **Stack rot:** Node 16 (EOL), Yarn 1, Create React App + `react-app-rewired`
  (CRA is unmaintained), TS 4.9. Deployed on Heroku, whose free tier was killed
  in 2022 — almost certainly offline.
- **Dead weight:** `config-overrides.js` is 100% commented out, so
  `react-app-rewired` adds nothing; a pile of Node-polyfill deps
  (`fs`, `os`, `path`, `crypto-browserify`, `stream-browserify`, …) are leftovers.
  MongoDB/mongoose connects on boot (with a hardcoded connection string
  containing the username) but stores nothing.
- **Architecture smells:**
  - Mixed class components (NewsModule, DataCanvas) and hooks (Headlines).
  - Highlighting + counting done by mutating `innerHTML` and re-querying the DOM
    with `querySelectorAll`; `new RegExp(rawUserInput)` breaks on regex special
    characters (regex injection) and is XSS-prone.
  - `passfocusedterms` reads `this.state` immediately after `setState` — a
    stale-state bug that happens to work by luck.
  - The 4 sources (CNN/Fox/NYT/Reuters) are hardcoded in four places; Fox has a
    one-off "use `guid` as the link" hack.
  - Broken CORS middleware in `server.js` (references undefined `res`, never
    calls `next`).
  - `gsap` module-swap animation that reads `clientHeight` to move DOM around.

## Goal

A full rewrite on a modern stack that preserves the product (4 source modules +
keyword search + per-source mentions chart) while eliminating the rot and the
DOM-mutation bug class. Includes new build tooling and a working redeploy.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Ambition | Full rewrite, modern stack |
| Scope | Code + tooling + deploy |
| Framework | Next.js (App Router) + Vercel |
| UI fidelity | Clean rebuild of the same layout (recognizable, not pixel-identical) |
| Styling | **Tailwind CSS** (user wants to learn it; idiomatic utility-class usage) |
| Module-swap animation | Dropped; modules + chart shown together in a responsive layout |
| Sources | Config-driven; ships with the same 4 |
| Counting semantic | Per source: number of headlines containing any keyword |
| MongoDB | Removed entirely |

## Architecture

### Stack

- **Next.js (App Router) + TypeScript 5 + React 19**, function components throughout.
- **Node 20 LTS**, npm.
- RSS fetching/parsing runs **server-side inside Next** (`rss-parser` in a route
  handler). This removes the separate Express server, `server.js`,
  `config-overrides.js`, `react-app-rewired`, the Node-polyfill deps, and MongoDB.
- Charting: **chart.js + react-chartjs-2** (Pie).
- Styling: **Tailwind CSS**. Source colors and any shared tokens live in the
  Tailwind/theme config so they're defined once and referenced by name.
- Deploy: **Vercel** (free tier), deployed from the repo. No env secrets required.

### Project structure

```
app/
  layout.tsx
  page.tsx              server component -> fetches feeds, renders <Dashboard>
  api/feeds/route.ts    GET all sources, parsed + cached (revalidate ~10 min)
  globals.css           Tailwind directives + base styles
components/
  Dashboard.tsx         client: owns search state, wires everything together
  SearchBar.tsx         keyword input + Search/Refresh
  SourceModule.tsx      one source column (header, counts, headlines)
  Headline.tsx          single headline, expandable snippet, highlighted title
  MentionsChart.tsx     pie chart of per-source counts
  Spinner.tsx
lib/
  sources.ts            config array (id, name, feed URLs, color tokens, linkField)
  rss.ts                fetch + parse + normalize, per-source error handling
  highlight.ts          PURE match/highlight/count logic (isolated & testable)
  types.ts
```

### Components / units

Each unit has one clear purpose and a defined interface:

- **`lib/sources.ts`** — single source of truth for sources. Each entry:
  `{ id, name, feedUrls: string[], colorToken, linkField? }`. The Fox `guid`-as-link
  hack becomes the per-source `linkField` option. Adding a source = one array entry.
- **`lib/rss.ts`** — `fetchAllFeeds()` fetches every source's feed URLs in
  parallel, normalizes items to a common `Headline` shape, and wraps **each
  source independently** in try/catch so one dead feed yields a per-source error
  rather than failing the whole page. Returns `{ source, headlines, error? }[]`.
- **`lib/highlight.ts`** — pure functions, no DOM, no React:
  - `escapeRegExp(s)` — neutralizes regex special characters in user input.
  - `matchKeywords(text, keywords)` — case-insensitive; returns ordered text
    segments tagged as match / non-match (for rendering) and a boolean "did this
    text contain any keyword."
  - `countMentions(headlines, keywords)` — number of headlines containing any
    keyword. This is the charted value.
- **`components/Headline.tsx`** — renders one headline. Highlights render as
  React `<mark>` elements built from `matchKeywords` segments — **never**
  `innerHTML`. Expandable snippet; uses `source.linkField` to pick the link.
- **`components/SourceModule.tsx`** — one source column: header (name, article
  count, found-terms count), the headline list, and a per-source error state.
- **`components/MentionsChart.tsx`** — Pie chart driven by `countMentions` per
  source; colors come from the source config.
- **`components/Dashboard.tsx`** — client component. Owns keyword state and the
  current feed data; fetches `/api/feeds` on mount and on Refresh; computes
  counts via `lib/highlight.ts`; passes data down to modules and the chart.

### Data flow

1. `page.tsx` (server) calls `lib/rss.ts` to fetch all feeds in parallel, cached
   via Next `revalidate` (~10 min). Initial headlines are passed to `<Dashboard>`.
2. `<Dashboard>` (client) holds keyword state. **Search** updates keywords and
   recomputes highlights + counts purely from already-loaded data (no refetch).
   **Refresh** re-fetches `GET /api/feeds`.
3. `api/feeds/route.ts` returns all sources' normalized headlines with per-source
   status, cached the same way.

### Error handling

- Per-source try/catch in `rss.ts`; partial results are first-class.
- A source whose feed fails shows an inline error state in its module instead of
  an infinite spinner.
- The keyword matcher escapes regex specials, so no input can throw or inject.

### Testing

- **Vitest + React Testing Library.**
- Unit tests concentrate on the previously bug-prone core:
  - `highlight.ts`: special-character keywords, case-insensitivity, multi-keyword,
    count correctness, empty input.
  - `rss.ts`: normalization of differing feed shapes; one-source-fails-others-survive.
- One light `Dashboard` test: enter keywords -> highlights appear and counts update.

## Risks / open items

- **Feed URLs / dead feeds.** The original feed URLs live in env vars not visible
  in this design. Several are likely dead — notably Reuters, which discontinued
  public RSS; CNN/NYT feed paths also drift. Resolution: put the **public** feed
  URLs directly in `lib/sources.ts` (they were never real secrets) and verify
  each during implementation, substituting current equivalents for any that are
  dead. If a source has no viable RSS feed, note it and either replace the source
  or ship it in a visible "feed unavailable" state.

## Out of scope

- New product features (trends over time, sentiment, additional analytics).
- Authentication, persistence, or any database (MongoDB is removed, not replaced).
- A full visual redesign — layout is a clean rebuild, not a reimagining.
