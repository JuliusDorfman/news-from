# News-From — Scoring Methodology (proposed v1)

**Status:** PROPOSED for Phase 1 (the analysis engine). Not yet built. The pillars,
weights, and tag boundaries here are a v1 hypothesis to be validated against
human raters before any score ships publicly.

## What a score means

Every article gets a favorability score on a single scale, measured toward a
**defined target subject** (e.g. "the current administration's handling" of the
topic):

```
-100 (critical) .. 0 (neutral) .. +100 (supportive)
```

It is stance **toward the subject**, NOT the outlet's position on the topic. (A
green Fox/Immigration article = favorable toward the administration's handling of
immigration, not "pro-immigration.") See the design spec's "Stance is toward a
target subject" note.

## Two layers

1. **Passage tags** — granular labels applied to specific spans of the article.
   These are what the reader extension highlights in its overlay.
2. **Scoring pillars** — the dimensions those tags roll up into. The weighted
   combination of pillar scores = the article's overall favorability score.

Every point of a score traces back to tagged spans, so the score is **explainable,
not a black box** — and the reader extension renders exactly those spans.

## The five scoring pillars

Each pillar is scored `-100..+100` (critical..supportive) toward the target.

| Pillar | Captures | Passage tags |
|---|---|---|
| **1. Direct Evaluation** (high weight) | Explicit praise or criticism of the subject | `Endorsement`, `Criticism` |
| **2. Tone & Word Choice** | Connotation of the language used about the subject | `Favorable wording`, `Loaded language` |
| **3. Source & Voice Balance** | Whose voices are amplified; whether opposing views appear | `Supportive source`, `Adversarial source`, `One-sided` |
| **4. Framing & Prominence** (high weight) | What headline/lede/structure foregrounds; space allocated | `Favorable framing`, `Unfavorable framing`, `Headline slant` |
| **5. Credit & Blame** | Causal attribution of outcomes to the subject | `Credit`, `Blame` |

Spans with no stance get a `Factual / context` tag — shown in the overlay, not scored.

## Overall score

`overall = weighted_sum(pillar_scores)`. Proposed initial weighting: **Direct
Evaluation** and **Framing & Prominence** weighted highest (they move readers
most); Tone, Source Balance, and Credit/Blame moderate. Weights are a v1
hypothesis to be tuned during validation. Per-pillar contributions are stored so
the UI and extension can show the breakdown, not just the headline number.

## Validation (the credibility play)

Pillar scores and tag boundaries are validated with **multiple independent human
raters** (AllSides-style blind review) before scores are published. This is the
answer to "says who?" — every score links to its tagged spans and per-pillar
contribution.

## Reader (Chrome) extension — the explainability surface

Because articles are **pre-scanned** in Phase 1 and stored, the extension is
**retrieval-only**: detect the open article's URL -> look up the stored analysis
-> render an overlay that highlights the tagged spans with their passage labels and
shows the overall score plus per-pillar breakdown. No live model cost — just a DB
read. It doubles as a **distribution wedge** (meet readers on the article itself)
and the **public explainability surface** (the highlights are the receipts behind
the score).

## Creators (new-media entities)

Creators (streamers/podcasters) use the same five pillars and the same target-stance
scale, but their content is long-form audio/video. Ingestion delta: transcription ->
speaker diarization -> topic segmentation, scoring each segment (not the whole
stream). Diarization is the crux: stance must be attributed to the creator's own
words, never a guest's or a clip they are reacting to. Two pillars shift emphasis:
Source & Voice Balance -> did they steelman or strawman the other side; Framing &
Prominence -> what they spent time on / which clips they chose. Evidence is a
timestamped quote that deep-links to the moment in the video (a stronger overlay
hook than article highlights).

## Data-model implication

The real schema extends the mockup's `StanceCell`/`Evidence` shapes with: per-span
passage tags (`{ span, tag, pillar, polarity }`) and a per-pillar score breakdown
on each article analysis. The mockup's shapes are intentionally close so the
presentation layer survives the swap to real data.
