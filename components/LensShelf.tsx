'use client'
import { useState } from 'react'
import DivergingBars from './DivergingBars'
import PositioningMap from './PositioningMap'
import StanceTimeline from './StanceTimeline'

type Lens = 'bars' | 'map' | 'timeline'

interface Props {
  bars: React.ComponentProps<typeof DivergingBars>
  map: React.ComponentProps<typeof PositioningMap>
  timeline: React.ComponentProps<typeof StanceTimeline>
}

const TABS: { key: Lens; label: string }[] = [
  { key: 'bars', label: 'By source' },
  { key: 'map', label: 'Positioning' },
  { key: 'timeline', label: 'Over time' },
]

export default function LensShelf({ bars, map, timeline }: Props) {
  const [active, setActive] = useState<Lens>('bars')
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            data-testid={`lens-tab-${t.key}`}
            aria-pressed={active === t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active === t.key ? 'border-ink bg-ink text-paper' : 'border-black/15 text-ink/70 hover:border-ink/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div data-testid="lens-stage" data-active={active} className="rounded-lg border border-black/10 bg-white/40 p-4">
        {active === 'bars' && <DivergingBars {...bars} />}
        {active === 'map' && <PositioningMap {...map} />}
        {active === 'timeline' && <StanceTimeline {...timeline} />}
      </div>
    </div>
  )
}
