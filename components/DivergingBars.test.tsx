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
