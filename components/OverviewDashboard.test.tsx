import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OverviewDashboard from './OverviewDashboard'

describe('OverviewDashboard', () => {
  it('renders the heatmap hero and lenses for the active (default) filter', () => {
    render(<OverviewDashboard />)
    expect(screen.getByRole('heading', { name: /where the press stands/i })).toBeInTheDocument()
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toBeInTheDocument()
  })
})
