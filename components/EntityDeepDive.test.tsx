import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EntityDeepDive from './EntityDeepDive'
import { getTopic } from '@/lib/mockData'

describe('EntityDeepDive', () => {
  it('renders subtopics and reveals an inline timeline when one is clicked', async () => {
    render(<EntityDeepDive kind="Outlet" name="CNN" entityId="cnn" />)
    const sub = getTopic('immigration')!.subtopics[0]
    const btn = screen.getByTestId(`subtopic-${sub.id}`)
    expect(btn).toBeInTheDocument()
    // no inline timeline for this subtopic until clicked
    expect(screen.queryByTestId(`line-${sub.id}`)).toBeNull()
    await userEvent.click(btn)
    expect(screen.getByTestId(`line-${sub.id}`)).toBeInTheDocument()
  })
})
