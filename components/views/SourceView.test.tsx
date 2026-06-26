import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SourceView from './SourceView'
import { topics } from '@/lib/mockData'

describe('SourceView', () => {
  it('renders the source name and a row per topic', () => {
    render(<SourceView sourceId="cnn" />)
    expect(screen.getByRole('heading', { name: /CNN/i })).toBeInTheDocument()
    expect(screen.getAllByTestId(/^topic-row-/).length).toBe(topics.length)
  })
})
