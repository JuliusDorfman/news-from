import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverviewDashboard from './OverviewDashboard'

describe('OverviewDashboard', () => {
  it('shows a page-level admin/term filter (default current/full) that drives the heatmap', async () => {
    render(<OverviewDashboard />)
    expect(screen.getByTestId('admin-current')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('term-full')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('admin-previous')).toBeInTheDocument()
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('admin-previous'))
    expect(screen.getByTestId('admin-previous')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('admin-current')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
  })
})
