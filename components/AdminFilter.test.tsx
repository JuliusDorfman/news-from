import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminFilter from './AdminFilter'

describe('AdminFilter', () => {
  it('shows the president, year-stamped term buttons, and searches to select', async () => {
    const onP = vi.fn(); const onT = vi.fn()
    render(<AdminFilter presidentId="trump" termKey="full" onSelectPresident={onP} onSelectTerm={onT} />)
    expect(screen.getByTestId('president-trigger')).toHaveTextContent(/trump/i)
    expect(screen.getByTestId('term-full')).toHaveTextContent(/–/)
    await userEvent.click(screen.getByTestId('term-1'))
    expect(onT).toHaveBeenCalledWith('1')
    await userEvent.click(screen.getByTestId('president-trigger'))
    await userEvent.type(screen.getByTestId('president-search'), 'obama')
    await userEvent.click(screen.getByTestId('president-option-obama'))
    expect(onP).toHaveBeenCalledWith('obama')
  })
})
