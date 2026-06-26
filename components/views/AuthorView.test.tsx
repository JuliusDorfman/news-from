import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthorView from './AuthorView'
import { topics } from '@/lib/mockData'

describe('AuthorView', () => {
  it('renders the author name, outlet, and a row per topic', () => {
    render(<AuthorView authorId="a-hartman" />)
    expect(screen.getByRole('heading', { name: /joan hartman/i })).toBeInTheDocument()
    expect(screen.getByText(/new york times/i)).toBeInTheDocument()
    const rows = screen.getAllByTestId(/^topic-row-/)
    expect(rows.length).toBe(topics.length)
    const firstLink = rows[0].querySelector('a')
    expect(firstLink?.getAttribute('href')).toMatch(/^\/topic\//)
  })
})
