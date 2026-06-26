import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Nav from './Nav'

describe('Nav', () => {
  it('renders brand and entry links', () => {
    render(<Nav />)
    expect(screen.getByText('News-From')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /outlets/i })).toHaveAttribute('href', '/source/cnn')
    expect(screen.getByRole('link', { name: /authors/i })).toHaveAttribute('href', '/author/a-hartman')
    expect(screen.getByRole('link', { name: /creators/i })).toHaveAttribute('href', '/creator/c-hasan')
  })
})
