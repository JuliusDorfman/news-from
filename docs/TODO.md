# News-From — TODO

Running task list. Phase 0 = the inert investor mockup.

## Phase 0 — Mockup

### Cleanup & scaffold
- [ ] Scaffold fresh Next.js + TypeScript + Tailwind app in the repo (on `modernization` branch)
- [ ] Remove legacy CRA app, `server.js`, `server/`, `config-overrides.js`, MongoDB/mongoose, polyfill deps
- [ ] Carry over branding assets (logo, banner)
- [ ] Configure Tailwind theme tokens (off-white bg, serif headline font, stance color scale)

### Data
- [ ] Author `lib/mockData.ts` — ~4 sources, ~2 authors, ~5 topics+subtopics, stance cells with time series, evidence headlines (internally consistent)
- [ ] `lib/types.ts` and `lib/stance.ts` (stance -> color/label helpers)

### Components
- [ ] StanceHeatmap (clickable cells)
- [ ] DivergingBars
- [ ] PositioningMap
- [ ] StanceTimeline
- [ ] EvidenceList
- [ ] LensShelf
- [ ] Nav

### Screens
- [ ] Overview `/` — heatmap hero + lens shelf (fully polished)
- [ ] Single-topic `/topic/[topicId]` — bars + timeline + evidence (fully polished)
- [ ] Source deep-dive `/source/[sourceId]` — subtopics -> timeline (lighter)
- [ ] Author deep-dive `/author/[authorId]` — subtopics -> timeline (lighter)

### Ship
- [ ] Polish pass on the two hero screens
- [ ] Deploy to Vercel; confirm live URL
- [ ] Quick cross-browser / mobile sanity check for the demo

## Future enhancements (mockup)
- [ ] **Comparative / overlay view** — display two filter selections at once, overlaid for direct comparison: e.g. two different administrations side by side, or the **same** administration across two **different terms**. Applies to the heatmap and/or the timeline (overlay the two series). Builds on the persistent site-wide filter.

## Later phases
See `docs/ROADMAP.md` (Phase 1 analysis core, Phase 2 history/persistence,
Phase 3 authors, Phase 4 scores & scale).
