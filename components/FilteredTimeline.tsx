'use client'
import StanceTimeline from './StanceTimeline'
import { useFilter } from './FilterContext'
import { seriesForPresident } from '@/lib/mockData'
import { stanceVar } from '@/lib/stance'

interface Item { id: string; name: string; entityId: string; topicId: string }
interface Props { items: Item[] }

export default function FilteredTimeline({ items }: Props) {
  const { presidentId: pid, termKey: term } = useFilter()
  const lines = items.map(it => {
    const series = seriesForPresident(it.entityId, it.topicId, pid, term)
    const mean = series.length ? series.reduce((s, p) => s + p.stance, 0) / series.length : 0
    return { id: it.id, name: it.name, color: stanceVar(Math.round(mean)), series }
  })
  return <StanceTimeline lines={lines} />
}
