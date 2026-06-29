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
    expect(line.getAttribute('stroke')).toBe('#d64045')
  })

  it('renders a circle marker for each series point', () => {
    render(<StanceTimeline lines={lines} />)
    expect(screen.getAllByTestId(/^point-cnn-/).length).toBe(lines[0].series.length)
  })
})
