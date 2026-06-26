# News-From

News-From is a stance-analysis product that surfaces how news sources and Op-Ed authors lean
across topics -- left, right, or center -- and how that positioning shifts over time.

**This repository is an inert investor-pitch mockup.** All data is hardcoded; there is no
RSS ingestion, LLM inference, or database. It exists to demonstrate the product concept and
visual design to stakeholders.

## Stack

- Next.js 16 App Router (TypeScript)
- Tailwind CSS v4
- Vitest + Testing Library

## Screens

| Route | Description |
|-------|-------------|
| `/` | Overview -- topic grid with stance heatmap |
| `/topic/[topicId]` | Single-topic deep-dive with lens shelf |
| `/source/[sourceId]` | Source profile with per-topic stance breakdown |
| `/author/[authorId]` | Author profile with per-topic stance breakdown |

## Commands

```
npm install      # install dependencies (Node >= 20 required)
npm run dev      # start dev server at http://localhost:3000
npm test         # run full Vitest suite
npm run build    # production build (type-check + compile)
```

## Project layout

```
app/             # Next.js App Router pages and layout
components/      # UI components (Nav, viz, LensShelf, views)
lib/             # types, stance helpers, mock data
__tests__/       # Vitest test files
public/          # static assets (logo only)
```
