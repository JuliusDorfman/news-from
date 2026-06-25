import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { stanceColor } from '@/lib/stance'
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

  it('applies correct fill color based on stance', () => {
    render(<PositioningMap items={items} />)
    const cnn = screen.getByTestId('bubble-cnn')
    const fox = screen.getByTestId('bubble-fox')
    expect(cnn.getAttribute('fill')).toBe(stanceColor(-60))
    expect(fox.getAttribute('fill')).toBe(stanceColor(55))
  })
})
