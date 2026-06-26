import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CreatorView from './CreatorView'
import { topics } from '@/lib/mockData'

describe('CreatorView', () => {
  it('renders the creator name, platform, and a row per topic', () => {
    render(<CreatorView creatorId="c-hasan" />)
    expect(screen.getByRole('heading', { name: /hasan piker/i })).toBeInTheDocument()
    expect(screen.getByText(/twitch/i)).toBeInTheDocument()
    expect(screen.getAllByTestId(/^topic-row-/).length).toBe(topics.length)
  })
})
