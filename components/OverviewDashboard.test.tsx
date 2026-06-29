import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OverviewDashboard from './OverviewDashboard'

describe('OverviewDashboard', () => {
  it('has a president typeahead (default Trump) that drives the heatmap', async () => {
    render(<OverviewDashboard />)
    expect(screen.getByTestId('president-trigger')).toHaveTextContent(/trump/i)
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('president-trigger'))
    await userEvent.type(screen.getByTestId('president-search'), 'obama')
    await userEvent.click(screen.getByTestId('president-option-obama'))
    expect(screen.getByTestId('president-trigger')).toHaveTextContent(/obama/i)
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
  })

  it('resets the term when switching to a single-term president', async () => {
    render(<OverviewDashboard />)
    await userEvent.click(screen.getByTestId('president-trigger'))
    await userEvent.type(screen.getByTestId('president-search'), 'carter')
    await userEvent.click(screen.getByTestId('president-option-carter'))
    // Carter served one term -> no "Full term" option, term resets to the 1st term
    expect(screen.queryByTestId('term-full')).toBeNull()
    expect(screen.getByTestId('term-1')).toHaveAttribute('aria-pressed', 'true')
  })
})
