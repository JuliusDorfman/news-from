import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccessibilityMenu from './AccessibilityMenu'

describe('AccessibilityMenu', () => {
  it('opens and toggles the colorblind-friendly palette', async () => {
    render(<AccessibilityMenu />)
    await userEvent.click(screen.getByTestId('accessibility-trigger'))
    const toggle = screen.getByTestId('cb-toggle')
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.cb).toBe('1')
  })
})
