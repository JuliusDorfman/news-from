import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TooltipProvider, useTooltip } from './Tooltip'

function Trigger() {
  const bind = useTooltip()
  return <button {...bind(<span>Hello tip</span>)}>target</button>
}

describe('TooltipProvider', () => {
  it('shows a styled tooltip on pointer move and hides on leave', () => {
    render(<TooltipProvider><Trigger /></TooltipProvider>)
    const target = screen.getByText('target')
    expect(screen.queryByRole('tooltip')).toBeNull()
    fireEvent.pointerMove(target, { clientX: 10, clientY: 10, pointerType: 'mouse' })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hello tip')
    fireEvent.pointerLeave(target, { pointerType: 'mouse' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('shows on touch and auto-hides after the timeout', () => {
    vi.useFakeTimers()
    try {
      render(<TooltipProvider><Trigger /></TooltipProvider>)
      const target = screen.getByText('target')
      fireEvent.pointerDown(target, { clientX: 5, clientY: 5, pointerType: 'touch' })
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      act(() => { vi.advanceTimersByTime(2300) })
      expect(screen.queryByRole('tooltip')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })
})
