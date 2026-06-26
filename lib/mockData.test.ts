import { describe, it, expect } from 'vitest'
import {
  sources, authors, topics, stanceCells, evidence,
  getSource, getTopic, getCell, cellsForTopic, cellsForEntity, evidenceForTopic, getAuthor,
  subtopicReadings,
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
