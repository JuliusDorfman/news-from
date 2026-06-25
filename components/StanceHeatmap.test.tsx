import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StanceHeatmap from './StanceHeatmap'
import { sources, topics, stanceCells } from '@/lib/mockData'

describe('StanceHeatmap', () => {
  it('renders a cell per source x topic, each linking to the topic', () => {
    render(<StanceHeatmap sources={sources} topics={topics} cells={stanceCells} />)
    const cell = screen.getByTestId('cell-cnn-reflecting-pool')
    expect(cell).toBeInTheDocument()
    expect(cell.closest('a')).toHaveAttribute('href', '/topic/reflecting-pool')
    // total source cells = sources x topics
    const all = screen.getAllByTestId(/^cell-/)
    expect(all.length).toBe(sources.length * topics.length)
  })
})
