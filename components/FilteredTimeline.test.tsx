import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FilteredTimeline from './FilteredTimeline'

const items = [{ id: 'cnn', name: 'CNN', entityId: 'cnn', topicId: 'immigration' }]

describe('FilteredTimeline', () => {
  it('renders a timeline line driven by the active (default) filter', () => {
    render(<FilteredTimeline items={items} />)
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
  })
})
