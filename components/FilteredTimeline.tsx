'use client'
import { useState } from 'react'
import StanceTimeline from './StanceTimeline'
import AdminFilter from './AdminFilter'
import { seriesForPresident } from '@/lib/mockData'
import { defaultTermKey } from '@/lib/presidents'
import { stanceVar } from '@/lib/stance'

interface Item { id: string; name: string; entityId: string; topicId: string }
interface Props { items: Item[] }

const DEFAULT_PRESIDENT = 'trump'

export default function FilteredTimeline({ items }: Props) {
  const [pid, setPid] = useState(DEFAULT_PRESIDENT)
  const [term, setTerm] = useState(() => defaultTermKey(DEFAULT_PRESIDENT))
  const selectPresident = (id: string) => { setPid(id); setTerm(defaultTermKey(id)) }
  const lines = items.map(it => {
    const series = seriesForPresident(it.entityId, it.topicId, pid, term)
    const mean = series.length ? series.reduce((s, p) => s + p.stance, 0) / series.length : 0
    return { id: it.id, name: it.name, color: stanceVar(Math.round(mean)), series }
  })
  return (
    <div className="space-y-4">
      <AdminFilter presidentId={pid} termKey={term} onSelectPresident={selectPresident} onSelectTerm={setTerm} />
      <StanceTimeline lines={lines} />
    </div>
  )
}
