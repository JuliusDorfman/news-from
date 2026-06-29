'use client'
import { useState } from 'react'
import StanceHeatmap from './StanceHeatmap'
import LensShelf from './LensShelf'
import { sources, topics, administrations, getCell, stanceFor, seriesFor } from '@/lib/mockData'
import { stanceVar } from '@/lib/stance'
import type { AdminId, TermId } from '@/lib/types'

const FEATURED = 'reflecting-pool'
const TERMS: { id: TermId; label: string }[] = [
  { id: 't1', label: '1st term' }, { id: 't2', label: '2nd term' }, { id: 'full', label: 'Full term' },
]

export default function OverviewDashboard() {
  const [admin, setAdmin] = useState<AdminId>('current')
  const [term, setTerm] = useState<TermId>('full')

  const bars = { items: sources.map(s => ({ id: s.id, name: s.name, stance: stanceFor(s.id, FEATURED, admin, term) ?? 0 })) }
  const map = { items: sources.map(s => ({ id: s.id, name: s.name, stance: stanceFor(s.id, FEATURED, admin, term) ?? 0, volume: getCell(s.id, FEATURED)?.volume ?? 0 })) }
  const timeline = { lines: sources.map(s => {
    const series = seriesFor(s.id, FEATURED, admin, term)
    const mean = series.length ? series.reduce((a, p) => a + p.stance, 0) / series.length : 0
    return { id: s.id, name: s.name, color: stanceVar(mean), series }
  }) }

  const pill = (active: boolean) => `rounded-full border px-3 py-1 text-sm transition-colors ${active ? 'border-ink bg-ink text-paper' : 'border-black/15 text-ink/70 hover:border-ink/40'}`
  const featuredName = topics.find(t => t.id === FEATURED)!.name

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Where the press stands</h1>
        <p className="mt-1 text-ink/60">Each cell shows how favorably an outlet covers the selected administration&apos;s handling of a topic. Green is supportive, red is critical &mdash; it is not the outlet&apos;s stance on the topic itself.</p>

        <div className="mt-4 rounded-lg border border-black/10 bg-white/50 p-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-sm font-medium text-ink/70">Showing</span>
            <div className="flex flex-wrap gap-2">
              {administrations.map(a => (
                <button key={a.id} type="button" data-testid={`admin-${a.id}`} aria-pressed={admin === a.id} onClick={() => setAdmin(a.id)} className={pill(admin === a.id)}>{a.label}</button>
              ))}
            </div>
            <span className="text-ink/30">&middot;</span>
            <div className="flex flex-wrap gap-2">
              {TERMS.map(t => (
                <button key={t.id} type="button" data-testid={`term-${t.id}`} aria-pressed={term === t.id} onClick={() => setTerm(t.id)} className={pill(term === t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-ink/50">Filters the entire page &mdash; the heatmap and all lenses below.</p>
        </div>

        <div className="mt-6">
          <StanceHeatmap entities={sources} topics={topics} adminId={admin} termId={term} />
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-ink/60">
          <span>Critical of the administration</span>
          <span className="h-2 w-40 rounded" style={{ background: 'linear-gradient(to right, var(--color-stance-critical), var(--color-stance-neutral), var(--color-stance-supportive))' }} />
          <span>Supportive of the administration</span>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">More ways to read it &mdash; {featuredName}</h2>
        <p className="mt-1 mb-4 text-sm text-ink/60">Same data, three lenses &mdash; reflecting the filter above.</p>
        <LensShelf bars={bars} map={map} timeline={timeline} />
      </section>
    </div>
  )
}
