'use client'
import { useState } from 'react'
import StanceHeatmap from './StanceHeatmap'
import LensShelf from './LensShelf'
import AdminFilter from './AdminFilter'
import { sources, topics, getCell, stanceForPresident, seriesForPresident } from '@/lib/mockData'
import { defaultTermKey } from '@/lib/presidents'
import { stanceVar } from '@/lib/stance'

const FEATURED = 'reflecting-pool'
const DEFAULT_PRESIDENT = 'trump'

export default function OverviewDashboard() {
  const [pid, setPid] = useState(DEFAULT_PRESIDENT)
  const [term, setTerm] = useState(() => defaultTermKey(DEFAULT_PRESIDENT))
  const selectPresident = (id: string) => { setPid(id); setTerm(defaultTermKey(id)) }

  const bars = { items: sources.map(s => ({ id: s.id, name: s.name, stance: stanceForPresident(s.id, FEATURED, pid, term) ?? 0 })) }
  // NOTE: volume (article count) is not period-scoped in the mock data model; same across president/term.
  const map = { items: sources.map(s => ({ id: s.id, name: s.name, stance: stanceForPresident(s.id, FEATURED, pid, term) ?? 0, volume: getCell(s.id, FEATURED)?.volume ?? 0 })) }
  const timeline = { lines: sources.map(s => {
    const series = seriesForPresident(s.id, FEATURED, pid, term)
    const mean = series.length ? series.reduce((a, p) => a + p.stance, 0) / series.length : 0
    return { id: s.id, name: s.name, color: stanceVar(Math.round(mean)), series }
  }) }
  const featuredName = topics.find(t => t.id === FEATURED)!.name

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Where the press stands</h1>
        <p className="mt-1 text-ink/60">Each cell shows how favorably an outlet covers the selected administration&apos;s handling of a topic. Green is supportive, red is critical &mdash; it is not the outlet&apos;s stance on the topic itself.</p>
        <div className="mt-4">
          <AdminFilter presidentId={pid} termKey={term} onSelectPresident={selectPresident} onSelectTerm={setTerm} />
        </div>
        <div className="mt-6">
          <StanceHeatmap entities={sources} topics={topics} presidentId={pid} termKey={term} />
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
