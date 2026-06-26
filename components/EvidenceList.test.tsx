import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import EvidenceList from './EvidenceList'
import { evidenceForTopic } from '@/lib/mockData'
import { stanceLabel } from '@/lib/stance'

describe('EvidenceList', () => {
  it('renders a row per evidence item with a stance label', () => {
    const items = evidenceForTopic('reflecting-pool')
    render(<EvidenceList items={items} />)
    expect(screen.getAllByTestId(/^evidence-/).length).toBe(items.length)
    expect(screen.getByText(items[0].headline)).toBeInTheDocument()
    // Verify stance label is rendered
    expect(screen.getByText(new RegExp(stanceLabel(items[0].stance)))).toBeInTheDocument()
  })
})
