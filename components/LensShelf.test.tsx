import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LensShelf from './LensShelf'

const props = {
  bars: { items: [{ id: 'cnn', name: 'CNN', stance: -50 }] },
  map: { items: [{ id: 'cnn', name: 'CNN', stance: -50, volume: 60 }] },
  timeline: { lines: [{ id: 'cnn', name: 'CNN', color: '#d64045', series: [{ date: '2026-01-01', stance: -50 }] }] },
}

describe('LensShelf', () => {
  it('shows three lens tabs and switches the enlarged lens on click', async () => {
    render(<LensShelf {...props} />)
    expect(screen.getByTestId('lens-tab-bars')).toBeInTheDocument()
    expect(screen.getByTestId('lens-tab-map')).toBeInTheDocument()
    expect(screen.getByTestId('lens-tab-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toHaveAttribute('data-active', 'bars')
    await userEvent.click(screen.getByTestId('lens-tab-timeline'))
    expect(screen.getByTestId('lens-stage')).toHaveAttribute('data-active', 'timeline')
  })
})
