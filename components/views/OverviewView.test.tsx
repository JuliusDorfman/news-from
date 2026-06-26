import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OverviewView from './OverviewView'

describe('OverviewView', () => {
  it('renders the heatmap hero and the lens shelf', () => {
    render(<OverviewView />)
    expect(screen.getByTestId('cell-cnn-reflecting-pool')).toBeInTheDocument()
    expect(screen.getByTestId('lens-stage')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /where the press stands/i })).toBeInTheDocument()
  })
})
