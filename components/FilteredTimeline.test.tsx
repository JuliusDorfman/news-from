import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilteredTimeline from './FilteredTimeline'

const items = [{ id: 'cnn', name: 'CNN', entityId: 'cnn', topicId: 'immigration' }]

describe('FilteredTimeline', () => {
  it('renders admin + term controls and a line, defaults to current/full, switches admin', async () => {
    render(<FilteredTimeline items={items} />)
    expect(screen.getByTestId('admin-current')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('term-full')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('admin-previous')).toBeInTheDocument()
    expect(screen.getByTestId('term-t1')).toBeInTheDocument()
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('admin-previous'))
    expect(screen.getByTestId('admin-previous')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
  })
})
