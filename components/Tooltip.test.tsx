import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
})
