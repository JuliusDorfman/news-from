import { describe, it, expect } from 'vitest'
import {
  sources, authors, creators, topics, stanceCells, evidence,
  getSource, getTopic, getCell, cellsForTopic, cellsForEntity, evidenceForTopic, getAuthor, getCreator,
  subtopicReadings, administrations, seriesFor, stanceFor,
  seriesForPresident, stanceForPresident,
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

  it('has a stance cell for every author x topic', () => {
    for (const a of authors) {
      for (const t of topics) {
        expect(getCell(a.id, t.id), `${a.id}/${t.id}`).toBeDefined()
      }
    }
  })

  it('keeps every stance within -100..100', () => {
    for (const c of stanceCells) {
      expect(c.stance).toBeGreaterThanOrEqual(-100)
      expect(c.stance).toBeLessThanOrEqual(100)
      for (const pt of c.series) {
        expect(pt.stance).toBeGreaterThanOrEqual(-100)
        expect(pt.stance).toBeLessThanOrEqual(100)
      }
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

  it('getAuthor returns the author by id', () => {
    expect(getAuthor(authors[0].id)?.id).toBe(authors[0].id)
  })

  it('has creators with a cell for every creator x topic', () => {
    expect(creators.length).toBeGreaterThanOrEqual(7)
    for (const cr of creators) {
      for (const t of topics) {
        expect(getCell(cr.id, t.id), `${cr.id}/${t.id}`).toBeDefined()
      }
    }
  })
  it('getCreator returns the creator by id', () => {
    expect(getCreator(creators[0].id)?.id).toBe(creators[0].id)
  })

  it('subtopicReadings returns one reading per subtopic, stances in range', () => {
    const readings = subtopicReadings('cnn', 'immigration')
    const topic = getTopic('immigration')!
    expect(readings.length).toBe(topic.subtopics.length)
    for (const r of readings) {
      expect(r.stance).toBeGreaterThanOrEqual(-100)
      expect(r.stance).toBeLessThanOrEqual(100)
      expect(r.series.length).toBeGreaterThan(0)
      for (const pt of r.series) {
        expect(pt.stance).toBeGreaterThanOrEqual(-100)
        expect(pt.stance).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('administration/term timeline', () => {
  it('has previous and current administrations each with 1st/2nd/full terms', () => {
    expect(administrations.map(a => a.id)).toEqual(['previous', 'current'])
    for (const a of administrations) {
      expect(a.terms.map(t => t.id)).toEqual(['t1', 't2', 'full'])
    }
  })

  it('seriesFor returns points inside the selected term window, stances in range', () => {
    const pts = seriesFor('cnn', 'immigration', 'current', 't1')
    expect(pts.length).toBeGreaterThan(0)
    for (const p of pts) {
      expect(p.date >= '2025-01').toBe(true)
      expect(p.date <= '2028-12-31').toBe(true)
      expect(p.stance).toBeGreaterThanOrEqual(-100)
      expect(p.stance).toBeLessThanOrEqual(100)
    }
  })

  it('full term spans more points than a single term', () => {
    const t1 = seriesFor('cnn', 'immigration', 'current', 't1')
    const full = seriesFor('cnn', 'immigration', 'current', 'full')
    expect(full.length).toBeGreaterThan(t1.length)
  })

  it('lean flips between administrations for a partisan entity', () => {
    const mean = (ps: { stance: number }[]) => ps.reduce((s, p) => s + p.stance, 0) / ps.length
    const cur = mean(seriesFor('cnn', 'immigration', 'current', 'full'))   // cnn is critical of current admin (negative)
    const prev = mean(seriesFor('cnn', 'immigration', 'previous', 'full')) // ...so supportive of previous (positive)
    expect(cur).toBeLessThan(0)
    expect(prev).toBeGreaterThan(0)
  })

  it('stanceFor aggregates per admin/term and flips for previous admin; null for unknown', () => {
    expect(stanceFor('cnn', 'immigration', 'current', 'full')!).toBeLessThan(0)
    expect(stanceFor('cnn', 'immigration', 'previous', 'full')!).toBeGreaterThan(0)
    expect(stanceFor('nope', 'immigration', 'current', 'full')).toBeNull()
  })
})

describe('president-based stance', () => {
  it('windows series to the term years and clamps', () => {
    const pts = seriesForPresident('cnn', 'immigration', 'obama', '1')
    expect(pts.length).toBeGreaterThan(0)
    for (const p of pts) {
      expect(p.stance).toBeGreaterThanOrEqual(-100)
      expect(p.stance).toBeLessThanOrEqual(100)
      expect(p.date >= '2009-01-01').toBe(true)
      expect(p.date <= '2013-12-31').toBe(true)
    }
  })
  it('party drives the lean: a partisan outlet flips between R and D administrations', () => {
    const mean = (ps: { stance: number }[]) => ps.reduce((s, p) => s + p.stance, 0) / (ps.length || 1)
    const underR = mean(seriesForPresident('cnn', 'immigration', 'reagan', 'full'))   // CNN critical of R admins
    const underD = mean(seriesForPresident('cnn', 'immigration', 'obama', 'full'))     // ...supportive of D admins
    expect(underR).toBeLessThan(0)
    expect(underD).toBeGreaterThan(0)
    expect(stanceForPresident('nope', 'immigration', 'obama', 'full')).toBeNull()
    expect(stanceForPresident('cnn', 'immigration', 'nobody', 'full')).toBeNull()
  })
})
