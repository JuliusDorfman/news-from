'use client'
import { useState } from 'react'
import StanceTimeline from './StanceTimeline'
import { administrations, seriesFor } from '@/lib/mockData'
import { stanceVar } from '@/lib/stance'
import type { AdminId, TermId } from '@/lib/types'

interface Item { id: string; name: string; entityId: string; topicId: string }
interface Props { items: Item[]; defaultAdmin?: AdminId; defaultTerm?: TermId }

const TERMS: { id: TermId; label: string }[] = [
  { id: 't1', label: '1st term' },
  { id: 't2', label: '2nd term' },
  { id: 'full', label: 'Full term' },
]

export default function FilteredTimeline({ items, defaultAdmin = 'current', defaultTerm = 'full' }: Props) {
  const [admin, setAdmin] = useState<AdminId>(defaultAdmin)
  const [term, setTerm] = useState<TermId>(defaultTerm)
  const lines = items.map(it => {
    const series = seriesFor(it.entityId, it.topicId, admin, term)
    const mean = series.length ? series.reduce((s, p) => s + p.stance, 0) / series.length : 0
    return { id: it.id, name: it.name, color: stanceVar(mean), series }
  })
  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition-colors ${active ? 'border-ink bg-ink text-paper' : 'border-black/15 text-ink/70 hover:border-ink/40'}`
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {administrations.map(a => (
          <button key={a.id} type="button" data-testid={`admin-${a.id}`} aria-pressed={admin === a.id} onClick={() => setAdmin(a.id)} className={pill(admin === a.id)}>{a.label}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TERMS.map(t => (
          <button key={t.id} type="button" data-testid={`term-${t.id}`} aria-pressed={term === t.id} onClick={() => setTerm(t.id)} className={pill(term === t.id)}>{t.label}</button>
        ))}
      </div>
      <StanceTimeline lines={lines} />
    </div>
  )
}
