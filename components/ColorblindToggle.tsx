'use client'
import { useEffect, useState } from 'react'

export default function ColorblindToggle() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('cb') === '1'
    setOn(saved)
    document.documentElement.dataset.cb = saved ? '1' : ''
  }, [])
  const toggle = () => {
    const next = !on
    setOn(next)
    document.documentElement.dataset.cb = next ? '1' : ''
    localStorage.setItem('cb', next ? '1' : '0')
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title="Toggle colorblind-friendly palette"
      className="rounded-full border border-black/15 px-3 py-1 text-xs text-ink/70 hover:border-ink/40"
    >
      {on ? 'Colorblind: on' : 'Colorblind: off'}
    </button>
  )
}
