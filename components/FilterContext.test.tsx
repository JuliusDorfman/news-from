import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterProvider, useFilter } from './FilterContext'
import SiteFilter from './SiteFilter'

function Probe() { const { presidentId, termKey } = useFilter(); return <div data-testid="probe">{presidentId}/{termKey}</div> }

describe('persistent site-wide filter', () => {
  it('a selection in SiteFilter updates all consumers via context', async () => {
    render(<FilterProvider><SiteFilter /><Probe /></FilterProvider>)
    expect(screen.getByTestId('probe')).toHaveTextContent('trump/full')
    await userEvent.click(screen.getByTestId('president-trigger'))
    await userEvent.type(screen.getByTestId('president-search'), 'obama')
    await userEvent.click(screen.getByTestId('president-option-obama'))
    expect(screen.getByTestId('probe')).toHaveTextContent('obama/full')
  })
})
