import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopicView from './TopicView'

describe('TopicView', () => {
  it('renders topic title, bars, timeline, and evidence', () => {
    render(<TopicView topicId="reflecting-pool" />)
    expect(screen.getByRole('heading', { name: /reflecting pool controversy/i })).toBeInTheDocument()
    expect(screen.getByTestId('bar-cnn')).toBeInTheDocument()
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
    expect(screen.getAllByTestId(/^evidence-/).length).toBeGreaterThan(0)
  })
})
