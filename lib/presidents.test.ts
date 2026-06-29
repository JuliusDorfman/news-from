import { describe, it, expect } from 'vitest'
import { presidents, getPresident, termOptions } from './presidents'

describe('presidents dataset', () => {
  it('lists every presidency (>= 45), Washington first, current admin last', () => {
    expect(presidents.length).toBeGreaterThanOrEqual(45)
    expect(presidents[0].id).toBe('washington')
    expect(presidents[presidents.length - 1].id).toBe('trump')
  })
  it('FDR has 4 terms; a one-term president has 1; Cleveland/Trump have 2 non-consecutive', () => {
    expect(getPresident('fdr')!.terms.length).toBe(4)
    expect(getPresident('carter')!.terms.length).toBe(1)
    expect(getPresident('cleveland')!.terms.length).toBe(2)
    expect(getPresident('trump')!.terms.length).toBe(2)
  })
  it('termOptions adds Full only when >1 term, and includes years', () => {
    const fdr = termOptions('fdr')
    expect(fdr.length).toBe(5) // 4 terms + Full
    expect(fdr[fdr.length - 1].key).toBe('full')
    expect(fdr[0].years).toMatch(/^\d{4}–\d{4}$/)
    const carter = termOptions('carter')
    expect(carter.length).toBe(1) // no Full for a single term
    expect(carter.some(o => o.key === 'full')).toBe(false)
  })
})
