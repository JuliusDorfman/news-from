import type { Source, Author, Creator, Topic, StanceCell, Evidence, SeriesPoint, Stance, AdminId, TermId, Administration } from './types'
import { clampStance } from './stance'
import { getPresident, termOptions } from './presidents'

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

export const creators: Creator[] = [
  { id: 'c-hasan', name: 'Hasan Piker', platform: 'Twitch / YouTube' },
  { id: 'c-destiny', name: 'Destiny', platform: 'YouTube / Kick' },
  { id: 'c-rogan', name: 'Joe Rogan', platform: 'Podcast / Spotify' },
  { id: 'c-asmon', name: 'Asmongold', platform: 'Twitch / YouTube' },
  { id: 'c-tyt', name: 'The Young Turks', platform: 'YouTube' },
  { id: 'c-mr', name: 'The Majority Report', platform: 'YouTube / Podcast' },
  { id: 'c-dw', name: 'The Daily Wire', platform: 'YouTube / Podcast' },
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

const creatorGrid: Record<string, number[]> = {
  'c-hasan':   [-80, -78, -60, -55, -65],
  'c-destiny': [-30, -20, -10,   5, -25],
  'c-rogan':   [ 10,  20,  25,  15,   5],
  'c-asmon':   [ 40,  55,  45,  25,  30],
  'c-tyt':     [-70, -68, -58, -50, -60],
  'c-mr':      [-75, -72, -62, -52, -64],
  'c-dw':      [ 78,  82,  70,  55,  60],
}
const creatorDrift: Record<string, number[]> = {
  'c-hasan':   [-4, -3, -2, -2, -3],
  'c-destiny': [ 2,  3,  1,  2, -1],
  'c-rogan':   [ 3,  4,  2,  1,  1],
  'c-asmon':   [ 4,  5,  3,  2,  2],
  'c-tyt':     [-3, -2, -2, -1, -2],
  'c-mr':      [-3, -3, -2, -2, -2],
  'c-dw':      [ 4,  3,  3,  2,  2],
}
for (const cr of creators) {
  topics.forEach((t, ti) => {
    const start = creatorGrid[cr.id][ti]
    stanceCells.push({
      entityId: cr.id, entityType: 'creator', topicId: t.id,
      stance: start, volume: 30 + ((ti * 6 + 11) % 25),
      series: series(start - creatorDrift[cr.id][ti] * 5, creatorDrift[cr.id][ti]),
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

const SUBTOPIC_DELTAS = [-7, 6, 12, -3]

export function subtopicReadings(entityId: string, topicId: string): { id: string; name: string; stance: Stance; series: SeriesPoint[] }[] {
  const cell = getCell(entityId, topicId)
  const topic = getTopic(topicId)
  if (!cell || !topic) return []
  return topic.subtopics.map((s, i) => {
    const delta = SUBTOPIC_DELTAS[i % SUBTOPIC_DELTAS.length]
    return {
      id: s.id,
      name: s.name,
      stance: clampStance(cell.stance + delta),
      series: cell.series.map(p => ({ date: p.date, stance: clampStance(p.stance + delta) })),
    }
  })
}

export const administrations: Administration[] = [
  { id: 'previous', label: 'Previous administration', terms: [
    { id: 't1', label: '1st term', start: '2017-01', end: '2020-12' },
    { id: 't2', label: '2nd term', start: '2021-01', end: '2024-12' },
    { id: 'full', label: 'Full term', start: '2017-01', end: '2024-12' },
  ]},
  { id: 'current', label: 'Current administration', terms: [
    { id: 't1', label: '1st term', start: '2025-01', end: '2028-12' },
    { id: 't2', label: '2nd term', start: '2029-01', end: '2032-12' },
    { id: 'full', label: 'Full term', start: '2025-01', end: '2032-12' },
  ]},
]

// deterministic small hash for organic wiggle (no Math.random)
function seedHash(s: string): number {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

// every 6 months from start..end inclusive, as 'YYYY-MM-01'
function stepDates(start: string, end: string): string[] {
  const [sy, sm] = start.split('-').map(Number)
  const [ey, em] = end.split('-').map(Number)
  const out: string[] = []
  let y = sy, m = sm
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}-01`)
    m += 6
    if (m > 12) { m -= 12; y += 1 }
  }
  return out
}

export function seriesFor(entityId: string, topicId: string, adminId: AdminId, termId: TermId): SeriesPoint[] {
  const cell = getCell(entityId, topicId)
  if (!cell) return []
  const admin = administrations.find(a => a.id === adminId)
  const term = admin?.terms.find(t => t.id === termId)
  if (!admin || !term) return []
  // current-admin lean = the authored cell stance; previous-admin lean flips (damped)
  const base = adminId === 'current' ? cell.stance : Math.round(cell.stance * -0.85)
  const dates = stepDates(term.start, term.end)
  return dates.map((d, i) => {
    const wiggle = (seedHash(`${entityId}:${topicId}:${d}`) % 21) - 10 // -10..10
    const drift = (i - (dates.length - 1) / 2) * (base < 0 ? -1.2 : 1.2) // mild polarizing trend
    return { date: d, stance: clampStance(Math.round(base + wiggle + drift)) }
  })
}

export function stanceFor(entityId: string, topicId: string, adminId: AdminId, termId: TermId): number | null {
  if (!getCell(entityId, topicId)) return null
  const pts = seriesFor(entityId, topicId, adminId, termId)
  if (!pts.length) return null
  return clampStance(Math.round(pts.reduce((s, p) => s + p.stance, 0) / pts.length))
}

export function getSource(id: string): Source | undefined { return sources.find(s => s.id === id) }
export function getAuthor(id: string): Author | undefined { return authors.find(a => a.id === id) }
export function getCreator(id: string): Creator | undefined { return creators.find(c => c.id === id) }
export function getTopic(id: string): Topic | undefined { return topics.find(t => t.id === id) }
export function getCell(entityId: string, topicId: string): StanceCell | undefined {
  return stanceCells.find(c => c.entityId === entityId && c.topicId === topicId)
}
export function cellsForTopic(topicId: string): StanceCell[] { return stanceCells.filter(c => c.topicId === topicId) }
export function cellsForEntity(entityId: string): StanceCell[] { return stanceCells.filter(c => c.entityId === entityId) }
export function evidenceForTopic(topicId: string): Evidence[] { return evidence.filter(e => e.topicId === topicId) }

// ---- President-based selectors ----

function presidentSeed(id: string): number { return (seedHash(id) % 21) - 10 } // -10..10

export function seriesForPresident(entityId: string, topicId: string, presidentId: string, termKey: string): SeriesPoint[] {
  const cell = getCell(entityId, topicId)
  const p = getPresident(presidentId)
  if (!cell || !p) return []
  const opt = termOptions(presidentId).find(o => o.key === termKey) ?? termOptions(presidentId)[0]
  if (!opt) return []
  // party drives the lean: R uses the outlet's authored stance; D flips it; other is damped
  const partyBase = p.party === 'R' ? cell.stance : p.party === 'D' ? Math.round(cell.stance * -0.85) : Math.round(cell.stance * 0.3)
  const base = clampStance(partyBase + presidentSeed(presidentId))
  const pts: SeriesPoint[] = []
  for (let y = opt.start; y <= opt.end; y++) {
    const wiggle = (seedHash(`${entityId}:${topicId}:${presidentId}:${y}`) % 21) - 10
    pts.push({ date: `${y}-01-01`, stance: clampStance(Math.round(base + wiggle)) })
  }
  return pts
}

export function stanceForPresident(entityId: string, topicId: string, presidentId: string, termKey: string): number | null {
  if (!getCell(entityId, topicId)) return null
  const pts = seriesForPresident(entityId, topicId, presidentId, termKey)
  if (!pts.length) return null
  return clampStance(Math.round(pts.reduce((s, p) => s + p.stance, 0) / pts.length))
}
