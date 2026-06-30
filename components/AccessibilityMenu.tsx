'use client'
import { useEffect, useState } from 'react'

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [cb, setCb] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('cb') === '1'
    setCb(saved)
    document.documentElement.dataset.cb = saved ? '1' : ''
  }, [])
  const toggleCb = () => {
    const next = !cb
    setCb(next)
    document.documentElement.dataset.cb = next ? '1' : ''
    localStorage.setItem('cb', next ? '1' : '0')
  }
  return (
    <div className="relative">
      <button type="button" data-testid="accessibility-trigger" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}
        className="rounded-full border border-black/15 px-3 py-1 text-xs text-ink/70 hover:border-ink/40">
        Accessibility
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-60 rounded-md border border-black/15 bg-paper p-3 shadow-lg">
            <button type="button" data-testid="cb-toggle" aria-pressed={cb} onClick={toggleCb}
              className="flex w-full items-center justify-between gap-3 text-left text-sm">
              <span>Colorblind-friendly palette</span>
              <span className={`inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${cb ? 'bg-ink' : 'bg-black/20'}`}>
                <span className={`h-4 w-4 rounded-full bg-paper transition-transform ${cb ? 'translate-x-4' : ''}`} />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
