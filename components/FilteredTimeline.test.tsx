import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilteredTimeline from './FilteredTimeline'

const items = [{ id: 'cnn', name: 'CNN', entityId: 'cnn', topicId: 'immigration' }]

describe('FilteredTimeline', () => {
  it('renders the president filter + a line, and re-renders on president change', async () => {
    render(<FilteredTimeline items={items} />)
    expect(screen.getByTestId('president-trigger')).toHaveTextContent(/trump/i)
    expect(screen.getByTestId('term-full')).toBeInTheDocument()
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('president-trigger'))
    await userEvent.type(screen.getByTestId('president-search'), 'reagan')
    await userEvent.click(screen.getByTestId('president-option-reagan'))
    expect(screen.getByTestId('line-cnn')).toBeInTheDocument()
  })
})
