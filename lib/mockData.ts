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
