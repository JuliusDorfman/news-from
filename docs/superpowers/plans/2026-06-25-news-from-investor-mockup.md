# News-From Investor Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable, completely inert (hardcoded-data) Next.js mockup of the News-From stance-analysis product for an investor pitch.

**Architecture:** Fresh Next.js (App Router) + TypeScript + Tailwind app replacing the legacy CRA/Express/MongoDB code. All data lives in `lib/mockData.ts`; pure helpers in `lib/stance.ts`. Four visualizations are bespoke SVG components (no chart library). Route pages are thin wrappers around testable presentational "View" components. Four screens: Overview (heatmap hero + lens shelf), Single-topic, Source deep-dive, Author deep-dive.

**Tech Stack:** Next.js 15 (App Router), TypeScript 5, Tailwind CSS, Vitest + React Testing Library + jsdom. Node 20 LTS, npm. Deploy: Vercel.

## Global Constraints

- **Stack:** Next.js App Router, TypeScript, Tailwind CSS. No chart library — visualizations are bespoke SVG.
- **Inert:** No network calls, no RSS, no LLM, no database. Every value comes from `lib/mockData.ts`.
- **Aesthetic ("Editorial light"):** off-white paper background `#f7f5f0` (never pure white), serif headlines (Georgia-class), restrained sans body, generous whitespace.
- **Stance scale (diverging), exact hex:** `-100..-60` = `#d64045` (Critical), `-60..-20` = `#e07a52` (Leans critical), `-20..20` = `#e9c46a` (Neutral), `20..60` = `#74b97a` (Leans supportive), `60..100` = `#2f9e54` (Supportive). Stance is an integer in `-100..100`.
- **Shell:** commands shown are PowerShell (user environment). ASCII-only in all files and commands.
- **Routes:** `/`, `/topic/[topicId]`, `/source/[sourceId]`, `/author/[authorId]`.
- **Polish split:** Overview + Single-topic fully polished; Source + Author present but lighter.
- **TDD:** logic (`lib/`) is test-first; components get structural render tests. Commit after each task.

---

### Task 1: Clean out legacy app and scaffold Next.js + Tailwind + Vitest

**Files:**
- Delete: `src/`, `public/`, `server/`, `server.js`, `config-overrides.js`, `package.json`, `yarn.lock`, `tsconfig.json`, `Procfile`
- Preserve: `.git/`, `.gitignore`, `README.md`, `docs/`
- Create (via scaffold): `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `public/logo.png` (copied from old assets)
- Test: `lib/smoke.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a running Next app; `npm run dev`, `npm run build`, `npm test` all work; Tailwind theme tokens `paper`, `stance-*`, and a serif font available.

- [ ] **Step 1: Back up the brand asset, then remove legacy files**

The repo dir is not empty, so save the logo first, then delete the old app. Run in PowerShell from the repo root:

```powershell
New-Item -ItemType Directory -Force ..\news-from-assets-backup | Out-Null
Copy-Item src\Assets\news-from-logo.png ..\news-from-assets-backup\logo.png
Copy-Item "src\Assets\news-from-title-banner.PNG" ..\news-from-assets-backup\banner.png
Remove-Item -Recurse -Force src, public, server, server.js, config-overrides.js, package.json, yarn.lock, tsconfig.json, Procfile
```

- [ ] **Step 2: Scaffold Next.js into a temp dir and move it into the repo**

`create-next-app` refuses a non-empty dir, so scaffold beside the repo and copy in (preserving `.git`/`docs`). Run from the repo root:

```powershell
npx --yes create-next-app@latest ..\news-from-scaffold --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint --use-npm
Copy-Item -Recurse -Force ..\news-from-scaffold\* .
Copy-Item -Force ..\news-from-scaffold\.eslintrc.json . -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ..\news-from-scaffold
New-Item -ItemType Directory -Force public | Out-Null
Copy-Item ..\news-from-assets-backup\logo.png public\logo.png
npm install
```

- [ ] **Step 3: Add Vitest and Testing Library**

```powershell
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Add scripts to `package.json` (merge into the existing `"scripts"` block):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Configure the Editorial-light Tailwind theme**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f5f0',
        ink: '#2b2622',
        stance: {
          critical: '#d64045',
          'lean-critical': '#e07a52',
          neutral: '#e9c46a',
          'lean-supportive': '#74b97a',
          supportive: '#2f9e54',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

Replace `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-paper text-ink font-sans;
}
h1, h2, h3 {
  @apply font-serif;
}
```

- [ ] **Step 6: Write the smoke test**

Create `lib/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('toolchain smoke test', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: Run the smoke test and the build**

```powershell
npm test
npm run build
```
Expected: test PASS (1 test); build completes with no type errors.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "chore: remove legacy app, scaffold Next.js + Tailwind + Vitest"
```

---

### Task 2: Domain types and stance helpers

**Files:**
- Create: `lib/types.ts`
- Create: `lib/stance.ts`
- Test: `lib/stance.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `lib/types.ts`: `Stance` (number), `EntityType` (`'source' | 'author'`), `Source {id,name}`, `Author {id,name,outlet}`, `Subtopic {id,name}`, `Topic {id,name,subtopics:Subtopic[]}`, `SeriesPoint {date,stance}`, `StanceCell {entityId,entityType,topicId,stance,volume,series:SeriesPoint[]}`, `Evidence {id,sourceId,topicId,headline,stance,date}`.
  - `lib/stance.ts`: `clampStance(n:number):Stance`, `stanceLabel(s:Stance):string`, `stanceColor(s:Stance):string` (returns exact hex from Global Constraints).

- [ ] **Step 1: Write `lib/types.ts`** (no test; pure type declarations)

```ts
export type Stance = number // integer -100..100
export type EntityType = 'source' | 'author'

export interface Source { id: string; name: string }
export interface Author { id: string; name: string; outlet: string }
export interface Subtopic { id: string; name: string }
export interface Topic { id: string; name: string; subtopics: Subtopic[] }
export interface SeriesPoint { date: string; stance: Stance }

export interface StanceCell {
  entityId: string
  entityType: EntityType
  topicId: string
  stance: Stance
  volume: number
  series: SeriesPoint[]
}

export interface Evidence {
  id: string
  sourceId: string
  topicId: string
  headline: string
  stance: Stance
  date: string
}
```

- [ ] **Step 2: Write the failing test**

Create `lib/stance.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { clampStance, stanceLabel, stanceColor } from './stance'

describe('clampStance', () => {
  it('clamps below -100 and above 100', () => {
    expect(clampStance(-150)).toBe(-100)
    expect(clampStance(150)).toBe(100)
    expect(clampStance(42)).toBe(42)
  })
})

describe('stanceLabel', () => {
  it('buckets by threshold', () => {
    expect(stanceLabel(-80)).toBe('Critical')
    expect(stanceLabel(-40)).toBe('Leans critical')
    expect(stanceLabel(0)).toBe('Neutral')
    expect(stanceLabel(40)).toBe('Leans supportive')
    expect(stanceLabel(80)).toBe('Supportive')
  })
})

describe('stanceColor', () => {
  it('maps buckets to exact hex', () => {
    expect(stanceColor(-80)).toBe('#d64045')
    expect(stanceColor(-40)).toBe('#e07a52')
    expect(stanceColor(0)).toBe('#e9c46a')
    expect(stanceColor(40)).toBe('#74b97a')
    expect(stanceColor(80)).toBe('#2f9e54')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- stance`
Expected: FAIL with "clampStance is not a function" / cannot find module.

- [ ] **Step 4: Write `lib/stance.ts`**

```ts
import type { Stance } from './types'

export function clampStance(n: number): Stance {
  return Math.max(-100, Math.min(100, Math.round(n)))
}

export function stanceLabel(s: Stance): string {
  if (s <= -60) return 'Critical'
  if (s <= -20) return 'Leans critical'
  if (s < 20) return 'Neutral'
  if (s < 60) return 'Leans supportive'
  return 'Supportive'
}

export function stanceColor(s: Stance): string {
  if (s <= -60) return '#d64045'
  if (s <= -20) return '#e07a52'
  if (s < 20) return '#e9c46a'
  if (s < 60) return '#74b97a'
  return '#2f9e54'
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- stance`
Expected: PASS (3 describe blocks).

- [ ] **Step 6: Commit**

```powershell
git add lib/types.ts lib/stance.ts lib/stance.test.ts
git commit -m "feat: add domain types and stance helpers"
```

---

### Task 3: Mock data and selectors

**Files:**
- Create: `lib/mockData.ts`
- Test: `lib/mockData.test.ts`

**Interfaces:**
- Consumes: types from `lib/types.ts`.
- Produces: exported arrays `sources: Source[]`, `authors: Author[]`, `topics: Topic[]`, `stanceCells: StanceCell[]`, `evidence: Evidence[]`; selectors `getSource(id)`, `getAuthor(id)`, `getTopic(id)`, `getCell(entityId, topicId)`, `cellsForTopic(topicId): StanceCell[]`, `cellsForEntity(entityId): StanceCell[]`, `evidenceForTopic(topicId): Evidence[]`.

- [ ] **Step 1: Write the failing test**

Create `lib/mockData.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  sources, authors, topics, stanceCells, evidence,
  getSource, getTopic, getCell, cellsForTopic, cellsForEntity, evidenceForTopic,
} from './mockData'

describe('mock data integrity', () => {
  it('has the expected entities', () => {
    expect(sources.length).toBe(4)
    expect(authors.length).toBeGreaterThanOrEqual(2)
    expect(topics.length).toBeGreaterThanOrEqual(5)
  })

  it('has a stance cell for every source x topic', () => {
    for (const s of sources) {
      for (const t of topics) {
        expect(getCell(s.id, t.id), `${s.id}/${t.id}`).toBeDefined()
      }
    }
  })

  it('keeps every stance within -100..100', () => {
    for (const c of stanceCells) {
      expect(c.stance).toBeGreaterThanOrEqual(-100)
      expect(c.stance).toBeLessThanOrEqual(100)
    }
  })

  it('every evidence item references a real source and topic', () => {
    for (const e of evidence) {
      expect(getSource(e.sourceId), e.id).toBeDefined()
      expect(getTopic(e.topicId), e.id).toBeDefined()
    }
  })
})

describe('selectors', () => {
  it('cellsForTopic returns one cell per source for that topic', () => {
    const t = topics[0]
    const cells = cellsForTopic(t.id).filter(c => c.entityType === 'source')
    expect(cells.length).toBe(sources.length)
  })

  it('cellsForEntity returns that entity cells only', () => {
    const cells = cellsForEntity(sources[0].id)
    expect(cells.every(c => c.entityId === sources[0].id)).toBe(true)
  })

  it('evidenceForTopic filters by topic', () => {
    const t = topics[0]
    expect(evidenceForTopic(t.id).every(e => e.topicId === t.id)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- mockData`
Expected: FAIL (cannot find module './mockData').

- [ ] **Step 3: Write `lib/mockData.ts`**

Author coherent fake data. Use this exact content:

```ts
import type { Source, Author, Topic, StanceCell, Evidence, SeriesPoint } from './types'

export const sources: Source[] = [
  { id: 'cnn', name: 'CNN' },
  { id: 'fox', name: 'Fox News' },
  { id: 'nyt', name: 'New York Times' },
  { id: 'reuters', name: 'Reuters' },
]

export const authors: Author[] = [
  { id: 'a-hartman', name: 'Joan Hartman', outlet: 'New York Times' },
  { id: 'a-cole', name: 'Marcus Cole', outlet: 'Fox News' },
]

export const topics: Topic[] = [
  { id: 'reflecting-pool', name: 'Reflecting Pool Controversy', subtopics: [
    { id: 'rp-cost', name: 'Project cost' }, { id: 'rp-design', name: 'Design choices' }, { id: 'rp-permits', name: 'Permits & process' } ] },
  { id: 'immigration', name: 'Immigration', subtopics: [
    { id: 'im-border', name: 'Border policy' }, { id: 'im-asylum', name: 'Asylum rules' } ] },
  { id: 'economy', name: 'Economy', subtopics: [
    { id: 'ec-inflation', name: 'Inflation' }, { id: 'ec-jobs', name: 'Jobs report' } ] },
  { id: 'foreign-policy', name: 'Foreign Policy', subtopics: [
    { id: 'fp-allies', name: 'Alliances' }, { id: 'fp-trade', name: 'Trade' } ] },
  { id: 'environment', name: 'Environment', subtopics: [
    { id: 'en-energy', name: 'Energy' }, { id: 'en-climate', name: 'Climate rules' } ] },
]

const months = ['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01', '2026-05-01', '2026-06-01']

function series(start: number, drift: number): SeriesPoint[] {
  return months.map((date, i) => ({ date, stance: Math.max(-100, Math.min(100, Math.round(start + drift * i))) }))
}

// stance grid: rows = sources, cols = topics (order matches arrays above)
const sourceGrid: Record<string, number[]> = {
  cnn:     [-62, -45, -10, -38, -30],
  fox:     [ 55,  62,  40,  18,  35],
  nyt:     [-58, -50, -34, -12, -28],
  reuters: [  6,  -8,   4,   2,  -2],
}
const sourceDrift: Record<string, number[]> = {
  cnn:     [-8, -2,  1, -3, -1],
  fox:     [ 6,  3,  2,  1,  2],
  nyt:     [-5, -3, -2, -1, -2],
  reuters: [ 1, -1,  1,  0,  0],
}

export const stanceCells: StanceCell[] = []
for (const s of sources) {
  topics.forEach((t, ti) => {
    const start = sourceGrid[s.id][ti]
    stanceCells.push({
      entityId: s.id, entityType: 'source', topicId: t.id,
      stance: start, volume: 40 + ((ti * 7 + start) % 30 + 30),
      series: series(start - sourceDrift[s.id][ti] * 5, sourceDrift[s.id][ti]),
    })
  })
}

// authors: lean per topic
const authorGrid: Record<string, number[]> = {
  'a-hartman': [-66, -55, -30, -18, -40],
  'a-cole':    [ 60,  58,  45,  22,  30],
}
const authorDrift: Record<string, number[]> = {
  'a-hartman': [-6, -2, -1, -1, -2],
  'a-cole':    [ 4,  3,  2,  1,  1],
}
for (const a of authors) {
  topics.forEach((t, ti) => {
    const start = authorGrid[a.id][ti]
    stanceCells.push({
      entityId: a.id, entityType: 'author', topicId: t.id,
      stance: start, volume: 20 + ((ti * 5 + 13) % 20),
      series: series(start - authorDrift[a.id][ti] * 5, authorDrift[a.id][ti]),
    })
  })
}

export const evidence: Evidence[] = [
  { id: 'e1', sourceId: 'cnn', topicId: 'reflecting-pool', headline: 'Reflecting pool overhaul runs millions over budget, records show', stance: -64, date: '2026-06-03' },
  { id: 'e2', sourceId: 'fox', topicId: 'reflecting-pool', headline: 'Administration delivers long-promised renovation of national landmark', stance: 58, date: '2026-06-04' },
  { id: 'e3', sourceId: 'nyt', topicId: 'reflecting-pool', headline: 'Critics question rushed permits behind reflecting pool project', stance: -52, date: '2026-06-05' },
  { id: 'e4', sourceId: 'reuters', topicId: 'reflecting-pool', headline: 'National Park Service confirms reflecting pool work completed', stance: 5, date: '2026-06-06' },
  { id: 'e5', sourceId: 'cnn', topicId: 'reflecting-pool', headline: 'Watchdog opens review of reflecting pool contracting', stance: -58, date: '2026-06-08' },
  { id: 'e6', sourceId: 'fox', topicId: 'reflecting-pool', headline: 'Visitors praise refreshed monument grounds', stance: 49, date: '2026-06-09' },
]

export function getSource(id: string): Source | undefined { return sources.find(s => s.id === id) }
export function getAuthor(id: string): Author | undefined { return authors.find(a => a.id === id) }
export function getTopic(id: string): Topic | undefined { return topics.find(t => t.id === id) }
export function getCell(entityId: string, topicId: string): StanceCell | undefined {
  return stanceCells.find(c => c.entityId === entityId && c.topicId === topicId)
}
export function cellsForTopic(topicId: string): StanceCell[] { return stanceCells.filter(c => c.topicId === topicId) }
export function cellsForEntity(entityId: string): StanceCell[] { return stanceCells.filter(c => c.entityId === entityId) }
export function evidenceForTopic(topicId: string): Evidence[] { return evidence.filter(e => e.topicId === topicId) }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- mockData`
Expected: PASS (all integrity + selector tests).

- [ ] **Step 5: Commit**

```powershell
git add lib/mockData.ts lib/mockData.test.ts
git commit -m "feat: add hardcoded mock data and selectors"
```

---

### Task 4: App shell — Nav and layout

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/layout.tsx` (use Nav, set metadata/title)
- Test: `components/Nav.test.tsx`

**Interfaces:**
- Consumes: nothing (Nav is static).
- Produces: `<Nav />` default export rendering brand link to `/` and links to a source (`/source/cnn`) and author (`/author/a-hartman`) entry point.

- [ ] **Step 1: Write the failing test**

Create `components/Nav.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Nav from './Nav'

describe('Nav', () => {
  it('renders brand and entry links', () => {
    render(<Nav />)
    expect(screen.getByText('News-From')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sources/i })).toHaveAttribute('href', '/source/cnn')
    expect(screen.getByRole('link', { name: /authors/i })).toHaveAttribute('href', '/author/a-hartman')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Nav`
Expected: FAIL (cannot find module './Nav').

- [ ] **Step 3: Write `components/Nav.tsx`**

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <header className="border-b border-black/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-serif font-bold tracking-tight">News-From</Link>
        <div className="flex gap-6 text-sm text-ink/70">
          <Link href="/source/cnn" className="hover:text-ink">Sources</Link>
          <Link href="/author/a-hartman" className="hover:text-ink">Authors</Link>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Nav`
Expected: PASS.

- [ ] **Step 5: Wire Nav into `app/layout.tsx`**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'News-From — Where the press stands',
  description: 'How news sources and Op-Ed authors lean across topics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```powershell
git add components/Nav.tsx components/Nav.test.tsx app/layout.tsx
git commit -m "feat: add app shell with nav and editorial layout"
```

---

### Task 5: StanceHeatmap component

**Files:**
- Create: `components/StanceHeatmap.tsx`
- Test: `components/StanceHeatmap.test.tsx`

**Interfaces:**
- Consumes: `Source`, `Topic`, `StanceCell` from `lib/types`; `stanceColor` from `lib/stance`.
- Produces: `StanceHeatmap({ sources, topics, cells })` default export. Renders one clickable cell per source x topic; each cell is a `next/link` to `/topic/[topicId]`, has inline `backgroundColor` from `stanceColor(cell.stance)`, and `data-testid="cell-<sourceId>-<topicId>"`.

- [ ] **Step 1: Write the failing test**

Create `components/StanceHeatmap.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StanceHeatmap from './StanceHeatmap'
import { sources, topics, stanceCells } from '@/lib/mockData'

describe('StanceHeatmap', () => {
  it('renders a cell per source x topic, each linking to the topic', () => {
    render(<StanceHeatmap sources={sources} topics={topics} cells={stanceCells} />)
    const cell = screen.getByTestId('cell-cnn-reflecting-pool')
    expect(cell).toBeInTheDocument()
    expect(cell.closest('a')).toHaveAttribute('href', '/topic/reflecting-pool')
    // total source cells = sources x topics
    const all = screen.getAllByTestId(/^cell-/)
    expect(all.length).toBe(sources.length * topics.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- StanceHeatmap`
Expected: FAIL (cannot find module).

- [ ] **Step 3: Write `components/StanceHeatmap.tsx`**

```tsx
import Link from 'next/link'
import type { Source, Topic, StanceCell } from '@/lib/types'
import { stanceColor } from '@/lib/stance'

interface Props { sources: Source[]; topics: Topic[]; cells: StanceCell[] }

export default function StanceHeatmap({ sources, topics, cells }: Props) {
  const get = (sid: string, tid: string) => cells.find(c => c.entityId === sid && c.topicId === tid && c.entityType === 'source')
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-32" />
            {topics.map(t => (
              <th key={t.id} className="px-2 pb-2 text-xs font-sans font-normal text-ink/60 align-bottom">{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map(s => (
            <tr key={s.id}>
              <th className="pr-3 text-right text-sm font-sans font-medium text-ink/80 whitespace-nowrap">{s.name}</th>
              {topics.map(t => {
                const c = get(s.id, t.id)
                return (
                  <td key={t.id} className="p-0">
                    <Link href={`/topic/${t.id}`} className="block">
                      <span
                        data-testid={`cell-${s.id}-${t.id}`}
                        title={`${s.name} on ${t.name}`}
                        className="block h-12 rounded transition-transform hover:scale-[1.04]"
                        style={{ backgroundColor: stanceColor(c ? c.stance : 0) }}
                      />
                    </Link>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- StanceHeatmap`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/StanceHeatmap.tsx components/StanceHeatmap.test.tsx
git commit -m "feat: add StanceHeatmap component"
```

---

### Task 6: DivergingBars component

**Files:**
- Create: `components/DivergingBars.tsx`
- Test: `components/DivergingBars.test.tsx`

**Interfaces:**
- Consumes: `stanceColor` from `lib/stance`.
- Produces: `DivergingBars({ items })` default export, where `items: { id: string; name: string; stance: number }[]`. Renders an SVG with one `<rect data-testid="bar-<id>">` per item; bar starts at center x=160, extends left for negative stance and right for positive, filled with `stanceColor(stance)`.

- [ ] **Step 1: Write the failing test**

Create `components/DivergingBars.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DivergingBars from './DivergingBars'

const items = [
  { id: 'cnn', name: 'CNN', stance: -60 },
  { id: 'fox', name: 'Fox News', stance: 40 },
]

describe('DivergingBars', () => {
  it('renders a bar per item with center-anchored direction', () => {
    render(<DivergingBars items={items} />)
    const neg = screen.getByTestId('bar-cnn')
    const pos = screen.getByTestId('bar-fox')
    // negative bar ends at center (x + width = 160)
    expect(Number(neg.getAttribute('x')) + Number(neg.getAttribute('width'))).toBe(160)
    // positive bar starts at center
    expect(Number(pos.getAttribute('x'))).toBe(160)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- DivergingBars`
Expected: FAIL.

- [ ] **Step 3: Write `components/DivergingBars.tsx`**

```tsx
import { stanceColor } from '@/lib/stance'

interface Item { id: string; name: string; stance: number }
interface Props { items: Item[] }

const CENTER = 160
const SCALE = 1.3 // px per stance point (max 100 -> 130px)
const ROW_H = 34
const BAR_H = 18

export default function DivergingBars({ items }: Props) {
  const height = items.length * ROW_H + 24
  return (
    <svg viewBox={`0 0 320 ${height}`} className="w-full h-auto" role="img" aria-label="Stance by source">
      <line x1={CENTER} y1={4} x2={CENTER} y2={items.length * ROW_H + 4} stroke="#cbd0d6" strokeDasharray="3 3" />
      {items.map((it, i) => {
        const y = i * ROW_H + 10
        const w = Math.abs(it.stance) * SCALE
        const x = it.stance < 0 ? CENTER - w : CENTER
        return (
          <g key={it.id}>
            <text x={6} y={y + BAR_H / 2 + 4} className="fill-ink/70" style={{ fontSize: 11 }}>{it.name}</text>
            <rect data-testid={`bar-${it.id}`} x={x} y={y} width={w} height={BAR_H} rx={3} fill={stanceColor(it.stance)} />
          </g>
        )
      })}
      <text x={40} y={items.length * ROW_H + 18} className="fill-ink/40" style={{ fontSize: 9 }}>&#8592; critical</text>
      <text x={250} y={items.length * ROW_H + 18} className="fill-ink/40" style={{ fontSize: 9 }}>supportive &#8594;</text>
    </svg>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- DivergingBars`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/DivergingBars.tsx components/DivergingBars.test.tsx
git commit -m "feat: add DivergingBars SVG component"
```

---

### Task 7: PositioningMap component

**Files:**
- Create: `components/PositioningMap.tsx`
- Test: `components/PositioningMap.test.tsx`

**Interfaces:**
- Consumes: `stanceColor` from `lib/stance`.
- Produces: `PositioningMap({ items })` default export, `items: { id; name; stance; volume }[]`. Renders an SVG `<circle data-testid="bubble-<id>">` per item; cx from stance (center 165), cy from volume (higher volume = higher up), r from volume.

- [ ] **Step 1: Write the failing test**

Create `components/PositioningMap.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PositioningMap from './PositioningMap'

const items = [
  { id: 'cnn', name: 'CNN', stance: -60, volume: 80 },
  { id: 'fox', name: 'Fox', stance: 55, volume: 70 },
]

describe('PositioningMap', () => {
  it('renders a bubble per item, positioned by stance', () => {
    render(<PositioningMap items={items} />)
    const cnn = screen.getByTestId('bubble-cnn')
    const fox = screen.getByTestId('bubble-fox')
    // negative stance sits left of center, positive right
    expect(Number(cnn.getAttribute('cx'))).toBeLessThan(165)
    expect(Number(fox.getAttribute('cx'))).toBeGreaterThan(165)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- PositioningMap`
Expected: FAIL.

- [ ] **Step 3: Write `components/PositioningMap.tsx`**

```tsx
import { stanceColor } from '@/lib/stance'

interface Item { id: string; name: string; stance: number; volume: number }
interface Props { items: Item[] }

const CENTER_X = 165
const X_SCALE = 1.25

export default function PositioningMap({ items }: Props) {
  return (
    <svg viewBox="0 0 320 190" className="w-full h-auto" role="img" aria-label="Media positioning map">
      <line x1={30} y1={160} x2={300} y2={160} stroke="#cbd0d6" />
      <line x1={CENTER_X} y1={20} x2={CENTER_X} y2={160} stroke="#cbd0d6" strokeDasharray="3 3" />
      <text x={40} y={176} className="fill-ink/40" style={{ fontSize: 9 }}>critical</text>
      <text x={300} y={176} textAnchor="end" className="fill-ink/40" style={{ fontSize: 9 }}>supportive</text>
      <text x={8} y={30} className="fill-ink/40" style={{ fontSize: 9 }}>more coverage</text>
      {items.map(it => {
        const cx = CENTER_X + it.stance * X_SCALE
        const cy = 150 - it.volume          // higher volume -> higher up
        const r = 8 + it.volume / 8
        return (
          <g key={it.id}>
            <circle data-testid={`bubble-${it.id}`} cx={cx} cy={cy} r={r} fill={stanceColor(it.stance)} opacity={0.85} />
            <text x={cx} y={cy + 3} textAnchor="middle" className="fill-white" style={{ fontSize: 9, fontWeight: 600 }}>{it.name}</text>
          </g>
        )
      })}
    </svg>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- PositioningMap`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/PositioningMap.tsx components/PositioningMap.test.tsx
git commit -m "feat: add PositioningMap SVG component"
```

---

### Task 8: StanceTimeline component

**Files:**
- Create: `components/StanceTimeline.tsx`
- Test: `components/StanceTimeline.test.tsx`

**Interfaces:**
- Consumes: `SeriesPoint` from `lib/types`.
- Produces: `StanceTimeline({ lines })` default export, `lines: { id: string; name: string; color: string; series: SeriesPoint[] }[]`. Renders one `<polyline data-testid="line-<id>">` per line; neutral baseline at y for stance 0.

- [ ] **Step 1: Write the failing test**

Create `components/StanceTimeline.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StanceTimeline from './StanceTimeline'

const lines = [
  { id: 'cnn', name: 'CNN', color: '#d64045', series: [
    { date: '2026-01-01', stance: -40 }, { date: '2026-02-01', stance: -60 } ] },
]

describe('StanceTimeline', () => {
  it('renders a polyline per line with one point per series entry', () => {
    render(<StanceTimeline lines={lines} />)
    const line = screen.getByTestId('line-cnn')
    expect(line.getAttribute('points')!.trim().split(/\s+/).length).toBe(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- StanceTimeline`
Expected: FAIL.

- [ ] **Step 3: Write `components/StanceTimeline.tsx`**

```tsx
import type { SeriesPoint } from '@/lib/types'

interface Line { id: string; name: string; color: string; series: SeriesPoint[] }
interface Props { lines: Line[] }

const W = 320, H = 190, PAD_L = 34, PAD_R = 14, TOP = 20, BOTTOM = 160
const MID = (TOP + BOTTOM) / 2

function xFor(i: number, n: number) {
  if (n <= 1) return PAD_L
  return PAD_L + (i * (W - PAD_L - PAD_R)) / (n - 1)
}
function yFor(stance: number) {
  return MID - (stance / 100) * (MID - TOP)
}

export default function StanceTimeline({ lines }: Props) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Stance over time">
      <line x1={PAD_L} y1={MID} x2={W - PAD_R} y2={MID} stroke="#cbd0d6" strokeDasharray="3 3" />
      <line x1={PAD_L} y1={TOP} x2={PAD_L} y2={BOTTOM} stroke="#cbd0d6" />
      <text x={6} y={TOP + 12} className="fill-ink/40" style={{ fontSize: 9 }}>supportive</text>
      <text x={6} y={BOTTOM} className="fill-ink/40" style={{ fontSize: 9 }}>critical</text>
      {lines.map(l => {
        const pts = l.series.map((p, i) => `${xFor(i, l.series.length).toFixed(1)},${yFor(p.stance).toFixed(1)}`).join(' ')
        return <polyline key={l.id} data-testid={`line-${l.id}`} points={pts} fill="none" stroke={l.color} strokeWidth={2.5} />
      })}
    </svg>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- StanceTimeline`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/StanceTimeline.tsx components/StanceTimeline.test.tsx
git commit -m "feat: add StanceTimeline SVG component"
```

---

### Task 9: EvidenceList component

**Files:**
- Create: `components/EvidenceList.tsx`
- Test: `components/EvidenceList.test.tsx`

**Interfaces:**
- Consumes: `Evidence` from `lib/types`; `getSource` from `lib/mockData`; `stanceColor`, `stanceLabel` from `lib/stance`.
- Produces: `EvidenceList({ items })` default export, `items: Evidence[]`. Renders one row per item showing the headline, source name, and a stance chip.

- [ ] **Step 1: Write the failing test**

Create `components/EvidenceList.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EvidenceList from './EvidenceList'
import { evidenceForTopic } from '@/lib/mockData'

describe('EvidenceList', () => {
  it('renders a row per evidence item with a stance label', () => {
    const items = evidenceForTopic('reflecting-pool')
    render(<EvidenceList items={items} />)
    expect(screen.getAllByTestId(/^evidence-/).length).toBe(items.length)
    expect(screen.getByText(items[0].headline)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- EvidenceList`
Expected: FAIL.

- [ ] **Step 3: Write `components/EvidenceList.tsx`**

```tsx
import type { Evidence } from '@/lib/types'
import { getSource } from '@/lib/mockData'
import { stanceColor, stanceLabel } from '@/lib/stance'

interface Props { items: Evidence[] }

export default function EvidenceList({ items }: Props) {
  return (
    <ul className="divide-y divide-black/10">
      {items.map(e => (
        <li key={e.id} data-testid={`evidence-${e.id}`} className="flex items-start gap-3 py-3">
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: stanceColor(e.stance) }} />
          <div>
            <p className="font-serif text-[15px] leading-snug">{e.headline}</p>
            <p className="mt-1 text-xs text-ink/55">
              {getSource(e.sourceId)?.name} &middot; {e.date} &middot; {stanceLabel(e.stance)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- EvidenceList`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/EvidenceList.tsx components/EvidenceList.test.tsx
git commit -m "feat: add EvidenceList component"
```

---

### Task 10: LensShelf (interactive lens switcher)

**Files:**
- Create: `components/LensShelf.tsx`
- Test: `components/LensShelf.test.tsx`

**Interfaces:**
- Consumes: `DivergingBars`, `PositioningMap`, `StanceTimeline`.
- Produces: `LensShelf({ bars, map, timeline })` default export (client component), where `bars: { items }`, `map: { items }`, `timeline: { lines }` match the props of the respective components. Renders three selectable lens tiles; the selected lens is shown enlarged. Each tile has `data-testid="lens-tab-bars|map|timeline"`; default selected is `bars`.

- [ ] **Step 1: Write the failing test**

Create `components/LensShelf.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LensShelf from './LensShelf'

const props = {
  bars: { items: [{ id: 'cnn', name: 'CNN', stance: -50 }] },
  map: { items: [{ id: 'cnn', name: 'CNN', stance: -50, volume: 60 }] },
  timeline: { lines: [{ id: 'cnn', name: 'CNN', color: '#d64045', series: [{ date: '2026-01-01', stance: -50 }] }] },
}

describe('LensShelf', () => {
  it('shows three lens tabs and switches the enlarged lens on click', async () => {
    render(<LensShelf {...props} />)
    expect(screen.getByTestId('lens-tab-bars')).toBeInTheDocument()
    expect(screen.getByTestId('lens-tab-map')).toBeInTheDocument()
    expect(screen.getByTestId('lens-tab-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toHaveAttribute('data-active', 'bars')
    await userEvent.click(screen.getByTestId('lens-tab-timeline'))
    expect(screen.getByTestId('lens-stage')).toHaveAttribute('data-active', 'timeline')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- LensShelf`
Expected: FAIL.

- [ ] **Step 3: Write `components/LensShelf.tsx`**

```tsx
'use client'
import { useState } from 'react'
import DivergingBars from './DivergingBars'
import PositioningMap from './PositioningMap'
import StanceTimeline from './StanceTimeline'

type Lens = 'bars' | 'map' | 'timeline'

interface Props {
  bars: React.ComponentProps<typeof DivergingBars>
  map: React.ComponentProps<typeof PositioningMap>
  timeline: React.ComponentProps<typeof StanceTimeline>
}

const TABS: { key: Lens; label: string }[] = [
  { key: 'bars', label: 'By source' },
  { key: 'map', label: 'Positioning' },
  { key: 'timeline', label: 'Over time' },
]

export default function LensShelf({ bars, map, timeline }: Props) {
  const [active, setActive] = useState<Lens>('bars')
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            data-testid={`lens-tab-${t.key}`}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active === t.key ? 'border-ink bg-ink text-paper' : 'border-black/15 text-ink/70 hover:border-ink/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div data-testid="lens-stage" data-active={active} className="rounded-lg border border-black/10 bg-white/40 p-4">
        {active === 'bars' && <DivergingBars {...bars} />}
        {active === 'map' && <PositioningMap {...map} />}
        {active === 'timeline' && <StanceTimeline {...timeline} />}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- LensShelf`
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add components/LensShelf.tsx components/LensShelf.test.tsx
git commit -m "feat: add interactive LensShelf"
```

---

### Task 11: Overview page (hero heatmap + lens shelf)

**Files:**
- Create: `components/views/OverviewView.tsx`
- Modify: `app/page.tsx`
- Test: `components/views/OverviewView.test.tsx`

**Interfaces:**
- Consumes: `StanceHeatmap`, `LensShelf`, mock data + selectors, `stanceColor`.
- Produces: `OverviewView()` default export composing the screen. `app/page.tsx` renders `<OverviewView />`. The lens shelf is fed from a featured topic (`reflecting-pool`): bars/map from `cellsForTopic` (sources only), timeline lines from each source's series for that topic.

- [ ] **Step 1: Write the failing test**

Create `components/views/OverviewView.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OverviewView from './OverviewView'

describe('OverviewView', () => {
  it('renders the heatmap hero and the lens shelf', () => {
    render(<OverviewView />)
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /where the press stands/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- OverviewView`
Expected: FAIL.

- [ ] **Step 3: Write `components/views/OverviewView.tsx`**

```tsx
import StanceHeatmap from '@/components/StanceHeatmap'
import LensShelf from '@/components/LensShelf'
import { sources, topics, stanceCells, cellsForTopic, getSource } from '@/lib/mockData'
import { stanceColor } from '@/lib/stance'

const FEATURED = 'reflecting-pool'

export default function OverviewView() {
  const featuredCells = cellsForTopic(FEATURED).filter(c => c.entityType === 'source')
  const bars = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance })) }
  const map = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance, volume: c.volume })) }
  const timeline = { lines: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, color: stanceColor(c.stance), series: c.series })) }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Where the press stands</h1>
        <p className="mt-1 text-ink/60">Critical to supportive, by source and topic. Click any cell to explore a story.</p>
        <div className="mt-6">
          <StanceHeatmap sources={sources} topics={topics} cells={stanceCells} />
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold">More ways to read it &mdash; {topics.find(t => t.id === FEATURED)!.name}</h2>
        <p className="mt-1 mb-4 text-sm text-ink/60">Same data, three lenses.</p>
        <LensShelf bars={bars} map={map} timeline={timeline} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import OverviewView from '@/components/views/OverviewView'

export default function Page() {
  return <OverviewView />
}
```

- [ ] **Step 5: Run test + build**

Run: `npm test -- OverviewView` then `npm run build`
Expected: test PASS; build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add components/views/OverviewView.tsx components/views/OverviewView.test.tsx app/page.tsx
git commit -m "feat: add Overview page with heatmap hero and lens shelf"
```

---

### Task 12: Single-topic cross-source page

**Files:**
- Create: `components/views/TopicView.tsx`
- Create: `app/topic/[topicId]/page.tsx`
- Test: `components/views/TopicView.test.tsx`

**Interfaces:**
- Consumes: `DivergingBars`, `StanceTimeline`, `EvidenceList`, selectors, `stanceColor`.
- Produces: `TopicView({ topicId })` default export. Route page unwraps `params` and renders `<TopicView topicId={...} />`.

- [ ] **Step 1: Write the failing test**

Create `components/views/TopicView.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopicView from './TopicView'

describe('TopicView', () => {
  it('renders topic title, bars, timeline, and evidence', () => {
    render(<TopicView topicId="reflecting-pool" />)
    expect(screen.getByRole('heading', { name: /reflecting pool controversy/i })).toBeInTheDocument()
    expect(screen.getByTestId('bar-cnn')).toBeInTheDocument()
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
    expect(screen.getAllByTestId(/^evidence-/).length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- TopicView`
Expected: FAIL.

- [ ] **Step 3: Write `components/views/TopicView.tsx`**

```tsx
import DivergingBars from '@/components/DivergingBars'
import StanceTimeline from '@/components/StanceTimeline'
import EvidenceList from '@/components/EvidenceList'
import { getTopic, cellsForTopic, evidenceForTopic, getSource } from '@/lib/mockData'
import { stanceColor } from '@/lib/stance'

export default function TopicView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId)
  if (!topic) return <p>Unknown topic.</p>
  const cells = cellsForTopic(topicId).filter(c => c.entityType === 'source')
  const bars = cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance }))
  const lines = cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, color: stanceColor(c.stance), series: c.series }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Topic</p>
        <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="mt-1 text-ink/60">How each source leans, and how it has shifted.</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Where sources stand</h2>
          <DivergingBars items={bars} />
        </section>
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Over time</h2>
          <StanceTimeline lines={lines} />
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-bold">Evidence</h2>
        <EvidenceList items={evidenceForTopic(topicId)} />
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Write `app/topic/[topicId]/page.tsx`**

```tsx
import TopicView from '@/components/views/TopicView'

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  return <TopicView topicId={topicId} />
}
```

- [ ] **Step 5: Run test + build**

Run: `npm test -- TopicView` then `npm run build`
Expected: test PASS; build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add components/views/TopicView.tsx components/views/TopicView.test.tsx "app/topic/[topicId]/page.tsx"
git commit -m "feat: add single-topic cross-source page"
```

---

### Task 13: Source deep-dive page

**Files:**
- Create: `components/views/SourceView.tsx`
- Create: `app/source/[sourceId]/page.tsx`
- Test: `components/views/SourceView.test.tsx`

**Interfaces:**
- Consumes: `StanceTimeline`, selectors, `stanceColor`, `stanceLabel`.
- Produces: `SourceView({ sourceId })` default export. Lists the source's topics with per-topic stance label, and shows a StanceTimeline of the source across its topics. Route page unwraps `params`.

- [ ] **Step 1: Write the failing test**

Create `components/views/SourceView.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SourceView from './SourceView'
import { topics } from '@/lib/mockData'

describe('SourceView', () => {
  it('renders the source name and a row per topic', () => {
    render(<SourceView sourceId="cnn" />)
    expect(screen.getByRole('heading', { name: /CNN/i })).toBeInTheDocument()
    expect(screen.getAllByTestId(/^topic-row-/).length).toBe(topics.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- SourceView`
Expected: FAIL.

- [ ] **Step 3: Write `components/views/SourceView.tsx`**

```tsx
import Link from 'next/link'
import StanceTimeline from '@/components/StanceTimeline'
import { getSource, getTopic, cellsForEntity } from '@/lib/mockData'
import { stanceColor, stanceLabel } from '@/lib/stance'

export default function SourceView({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId)
  if (!source) return <p>Unknown source.</p>
  const cells = cellsForEntity(sourceId)
  const lines = cells.map(c => ({ id: c.topicId, name: getTopic(c.topicId)!.name, color: stanceColor(c.stance), series: c.series }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Source</p>
        <h1 className="text-3xl font-bold tracking-tight">{source.name}</h1>
        <p className="mt-1 text-ink/60">How {source.name} has leaned across topics.</p>
      </header>
      <section className="rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-lg font-bold">Stance over time, by topic</h2>
        <StanceTimeline lines={lines} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-bold">Topics covered</h2>
        <ul className="divide-y divide-black/10">
          {cells.map(c => {
            const topic = getTopic(c.topicId)!
            return (
              <li key={c.topicId} data-testid={`topic-row-${c.topicId}`} className="flex items-center justify-between py-3">
                <Link href={`/topic/${c.topicId}`} className="font-serif text-[15px] hover:underline">{topic.name}</Link>
                <span className="flex items-center gap-2 text-sm text-ink/60">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: stanceColor(c.stance) }} />
                  {stanceLabel(c.stance)}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Write `app/source/[sourceId]/page.tsx`**

```tsx
import SourceView from '@/components/views/SourceView'

export default async function Page({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params
  return <SourceView sourceId={sourceId} />
}
```

- [ ] **Step 5: Run test + build**

Run: `npm test -- SourceView` then `npm run build`
Expected: test PASS; build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add components/views/SourceView.tsx components/views/SourceView.test.tsx "app/source/[sourceId]/page.tsx"
git commit -m "feat: add source deep-dive page"
```

---

### Task 14: Author deep-dive page

**Files:**
- Create: `components/views/AuthorView.tsx`
- Create: `app/author/[authorId]/page.tsx`
- Test: `components/views/AuthorView.test.tsx`

**Interfaces:**
- Consumes: `StanceTimeline`, selectors, `stanceColor`, `stanceLabel`.
- Produces: `AuthorView({ authorId })` default export, mirroring SourceView for an author. Route page unwraps `params`.

- [ ] **Step 1: Write the failing test**

Create `components/views/AuthorView.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthorView from './AuthorView'
import { topics } from '@/lib/mockData'

describe('AuthorView', () => {
  it('renders the author name, outlet, and a row per topic', () => {
    render(<AuthorView authorId="a-hartman" />)
    expect(screen.getByRole('heading', { name: /joan hartman/i })).toBeInTheDocument()
    expect(screen.getAllByTestId(/^topic-row-/).length).toBe(topics.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- AuthorView`
Expected: FAIL.

- [ ] **Step 3: Write `components/views/AuthorView.tsx`**

```tsx
import Link from 'next/link'
import StanceTimeline from '@/components/StanceTimeline'
import { getAuthor, getTopic, cellsForEntity } from '@/lib/mockData'
import { stanceColor, stanceLabel } from '@/lib/stance'

export default function AuthorView({ authorId }: { authorId: string }) {
  const author = getAuthor(authorId)
  if (!author) return <p>Unknown author.</p>
  const cells = cellsForEntity(authorId)
  const lines = cells.map(c => ({ id: c.topicId, name: getTopic(c.topicId)!.name, color: stanceColor(c.stance), series: c.series }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Op-Ed author</p>
        <h1 className="text-3xl font-bold tracking-tight">{author.name}</h1>
        <p className="mt-1 text-ink/60">{author.outlet} &middot; how {author.name} has treated each topic over time.</p>
      </header>
      <section className="rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-lg font-bold">Stance over time, by topic</h2>
        <StanceTimeline lines={lines} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-bold">Topics covered</h2>
        <ul className="divide-y divide-black/10">
          {cells.map(c => {
            const topic = getTopic(c.topicId)!
            return (
              <li key={c.topicId} data-testid={`topic-row-${c.topicId}`} className="flex items-center justify-between py-3">
                <Link href={`/topic/${c.topicId}`} className="font-serif text-[15px] hover:underline">{topic.name}</Link>
                <span className="flex items-center gap-2 text-sm text-ink/60">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: stanceColor(c.stance) }} />
                  {stanceLabel(c.stance)}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Write `app/author/[authorId]/page.tsx`**

```tsx
import AuthorView from '@/components/views/AuthorView'

export default async function Page({ params }: { params: Promise<{ authorId: string }> }) {
  const { authorId } = await params
  return <AuthorView authorId={authorId} />
}
```

- [ ] **Step 5: Run test + build**

Run: `npm test -- AuthorView` then `npm run build`
Expected: test PASS; build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add components/views/AuthorView.tsx components/views/AuthorView.test.tsx "app/author/[authorId]/page.tsx"
git commit -m "feat: add author deep-dive page"
```

---

### Task 15: Polish pass, full test run, and deploy

**Files:**
- Modify: `components/views/OverviewView.tsx`, `components/views/TopicView.tsx` (polish only)
- Modify: `README.md`

**Interfaces:**
- Consumes: everything.
- Produces: a deployed Vercel URL.

- [ ] **Step 1: Run the full test suite and build**

```powershell
npm test
npm run build
```
Expected: all tests PASS; build succeeds with no type errors.

- [ ] **Step 2: Manual visual check of the two hero screens**

```powershell
npm run dev
```
Open `http://localhost:3000` and `http://localhost:3000/topic/reflecting-pool`. Confirm: off-white paper background (not pure white), serif headings, heatmap cells colored and clickable, lens tabs switch, evidence list reads cleanly. Adjust spacing/typography in the two View files only if something looks off. Stop the dev server when done.

- [ ] **Step 3: Update README**

Replace the body of `README.md` with a short description: what News-From is (stance-analysis product), that this is an inert investor mockup with hardcoded data, the stack (Next.js + Tailwind), and `npm install` / `npm run dev` / `npm test` instructions. Keep it under 40 lines.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "chore: polish hero screens and update README"
```

- [ ] **Step 5: Deploy to Vercel (USER-RUN)**

This step is run by the user from PowerShell (not by an agent). From the repo root:

```powershell
npm install -g vercel
vercel login
vercel --prod
```

Accept the framework default (Next.js). No environment variables are needed. Vercel returns a live URL.

- [ ] **Step 6: Record the live URL**

Add the deployed URL to `docs/TODO.md` under "Ship", then commit:

```powershell
git add docs/TODO.md
git commit -m "docs: record live mockup URL"
```

---

## Self-Review Notes

- **Spec coverage:** stack/cleanup (Task 1), Tailwind editorial-light theme + tokens (Task 1), types + stance helpers (Task 2), mock data model with all entities incl. authors/subtopics/series/evidence (Task 3), Nav/shell (Task 4), all four visualizations (Tasks 5-8), evidence list (Task 9), lens shelf interaction (Task 10), Overview hero Layout 2 (Task 11), Single-topic incl. heatmap-cell drill-down target (Task 12), Source + Author deep-dives (Tasks 13-14), polish + Vercel deploy (Task 15). No in-app disclaimer (per decision). Subtopics exist in the data model and topic objects; the mockup surfaces topics in deep-dives (subtopic-level drill is a Phase-1 depth item, not required for the pitch).
- **Type consistency:** `StanceCell` fields (`entityId`, `entityType`, `topicId`, `stance`, `volume`, `series`) are used consistently across selectors and all consumers. Component prop shapes (`items` for bars/map, `lines` for timeline, `bars/map/timeline` for LensShelf) match between definitions and call sites in Tasks 11-14.
- **Placeholders:** none — every step has concrete code or exact commands.
