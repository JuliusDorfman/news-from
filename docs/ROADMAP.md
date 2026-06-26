# News-From — Product Roadmap

News-From measures **stance**: for a given news source (or Op-Ed author) and topic,
is the coverage critical or supportive toward a subject? The end state lets a
visitor explore how sources and authors lean across topics, drill into subtopics,
and see how that has shifted over time — with every score traceable to the
articles behind it.

The roadmap is sequenced to **show the vision before building the hard part** — we
pitch with an inert mockup first, then build the believable analysis core, then
add history and scale.

## Phase 0 — Investor mockup (current)

**Goal:** a deployable, completely inert demo of the full vision for fundraising.

- Fresh Next.js + TypeScript + Tailwind app; old CRA/Express/MongoDB removed.
- Four screens: Overview (heatmap hero + lens shelf), Single-topic cross-source,
  Source deep-dive, Author deep-dive.
- All data hardcoded in `lib/mockData.ts`. No RSS, no LLM, no database.
- Deployed to a live Vercel URL.
- Spec: `docs/superpowers/specs/2026-06-25-news-from-investor-mockup-design.md`.

## Phase 1 — Believable analysis core (the make-or-break)

- Stance target is a DEFINED SUBJECT (mockup: "the current administration"). Making the target configurable (administration, candidate, agency, policy) is a key differentiator vs AllSides-style fixed outlet-lean ratings - News-From measures how an outlet treats a chosen subject on a topic over time, not a permanent left/right label.


**Goal:** prove stance scores are trustworthy and explainable.

- Ingest real articles incl. **full text + author bylines** (not just RSS snippets).
- LLM (Claude) stance pipeline: given a defined target, return
  `{ topic, subtopic, target, stance, evidence span, confidence }`.
- Human spot-check harness: are the scores defensible? Every score links to the
  article text and the reasoning.
- Output replaces the hardcoded data behind the existing mockup screens.

## Phase 2 — History & persistence

- Store articles + analyses over time in a database.
- "How has CNN viewed topic X historically" becomes real (the StanceTimeline).
- Aggregation: roll up by source x topic x time and author x topic x time.

## Phase 3 — Authors as first-class entities

- Byline extraction and author identity resolution across outlets.
- Full author drill-down: author -> subtopics -> stance over time.

## Phase 4 — Overall scores & scale

- Composite favorability scores per source/author.
- More sources/topics; refresh cadence; performance.

## Phase 5 — Reader extension (article overlay)

A browser (Chrome) extension that activates when a user opens a known article URL,
pings our DB for the stored analysis, and renders an overlay: tagged spans
highlighted with passage labels (Endorsement, Criticism, Loaded language, etc.) plus
the overall favorability score and per-pillar breakdown. **Retrieval-only and cheap**
— the article was already scanned in Phase 1, so the extension just reads stored
results (no live model cost). It doubles as a distribution wedge (meet readers on
the article itself) and the public explainability surface — the highlights are the
receipts behind a score.

## Scoring methodology

An article's overall score is built from **five scoring pillars** — Direct
Evaluation, Tone & Word Choice, Source & Voice Balance, Framing & Prominence, and
Credit & Blame — each scored critical..supportive toward the target subject and
combined by weight, with granular passage tags that the reader extension
highlights. Full definition: `docs/SCORING.md`.

## Open product questions (revisit before Phase 1)

- What exactly is stance measured *toward* per analysis (entity vs. topic)?
- Headlines-only vs. full-text ingestion cost/quality tradeoff.
- How to present uncertainty/confidence honestly in the UI.
- Visualization choices validated in the mockup may need rework once data is real.
