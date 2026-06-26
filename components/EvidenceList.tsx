import type { Evidence } from '@/lib/types'
import { getSource } from '@/lib/mockData'
import { stanceColor, stanceLabel } from '@/lib/stance'

interface Props { items: Evidence[] }

export default function EvidenceList({ items }: Props) {
  return (
    <ul className="divide-y divide-black/10">
      {items.map(e => (
        <li key={e.id} data-testid={`evidence-${e.id}`} className="flex items-start gap-3 py-3">
          <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: stanceColor(e.stance) }} />
          <div>
            <p className="font-serif text-[15px] leading-snug">{e.headline}</p>
            <p className="mt-1 text-xs text-ink/55">
              {getSource(e.sourceId)?.name} &middot; {e.date} &middot; {stanceLabel(e.stance)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
