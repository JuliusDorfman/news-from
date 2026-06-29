import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DivergingBars from './DivergingBars'
import { stanceVar } from '@/lib/stance'

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
    // bars use stanceColor for fill
    expect(neg.getAttribute('fill')).toBe(stanceVar(-60))
    expect(pos.getAttribute('fill')).toBe(stanceVar(40))
  })

  it('shows a tooltip title on each bar group', () => {
    const { container } = render(<DivergingBars items={items} />)
    const titles = Array.from(container.querySelectorAll('g > title'))
    expect(titles.some(t => /CNN:/.test(t.textContent || ''))).toBe(true)
  })
})
