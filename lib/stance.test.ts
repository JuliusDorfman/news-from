import { describe, it, expect } from 'vitest'
import { clampStance, stanceLabel, stanceColor } from './stance'

describe('clampStance', () => {
  it('clamps below -100 and above 100', () => {
    expect(clampStance(-150)).toBe(-100)
    expect(clampStance(150)).toBe(100)
    expect(clampStance(42)).toBe(42)
    expect(clampStance(42.7)).toBe(43)
  })
})

describe('stanceLabel', () => {
  it('buckets by threshold', () => {
    expect(stanceLabel(-80)).toBe('Critical')
    expect(stanceLabel(-40)).toBe('Leans critical')
    expect(stanceLabel(0)).toBe('Neutral')
    expect(stanceLabel(40)).toBe('Leans supportive')
    expect(stanceLabel(80)).toBe('Supportive')
    // Boundary coverage
    expect(stanceLabel(-60)).toBe('Critical')
    expect(stanceLabel(-59)).toBe('Leans critical')
    expect(stanceLabel(-20)).toBe('Leans critical')
    expect(stanceLabel(-19)).toBe('Neutral')
    expect(stanceLabel(19)).toBe('Neutral')
    expect(stanceLabel(20)).toBe('Leans supportive')
    expect(stanceLabel(59)).toBe('Leans supportive')
    expect(stanceLabel(60)).toBe('Supportive')
  })
})

describe('stanceColor', () => {
  it('maps buckets to exact hex', () => {
    expect(stanceColor(-80)).toBe('#d64045')
    expect(stanceColor(-40)).toBe('#e07a52')
    expect(stanceColor(0)).toBe('#e9c46a')
    expect(stanceColor(40)).toBe('#74b97a')
    expect(stanceColor(80)).toBe('#2f9e54')
    // Boundary coverage
    expect(stanceColor(-60)).toBe('#d64045')
    expect(stanceColor(-59)).toBe('#e07a52')
    expect(stanceColor(-20)).toBe('#e07a52')
    expect(stanceColor(-19)).toBe('#e9c46a')
    expect(stanceColor(19)).toBe('#e9c46a')
    expect(stanceColor(20)).toBe('#74b97a')
    expect(stanceColor(59)).toBe('#74b97a')
    expect(stanceColor(60)).toBe('#2f9e54')
  })
})
