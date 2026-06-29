'use client'
import Link from 'next/link'
import type { Topic, StanceCell, EntityType } from '@/lib/types'
import { stanceVar, stanceLabel } from '@/lib/stance'
import { useTooltip } from './Tooltip'

interface Props { entities: { id: string; name: string }[]; topics: Topic[]; cells: StanceCell[]; entityType: EntityType }

export default function StanceHeatmap({ entities, topics, cells, entityType }: Props) {
  const bind = useTooltip()
  const get = (eid: string, tid: string) => cells.find(c => c.entityId === eid && c.topicId === tid && c.entityType === entityType)
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-32" />
            {topics.map(t => (
              <th key={t.id} className="px-2 pb-2 text-xs font-sans font-normal text-ink/60 align-bottom">{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map(e => (
            <tr key={e.id}>
              <th className="pr-3 text-right text-sm font-sans font-medium text-ink/80 whitespace-nowrap">{e.name}</th>
              {topics.map(t => {
                const c = get(e.id, t.id)
                const ariaLabel = c
                  ? `${e.name} on ${t.name}: ${stanceLabel(c.stance)} of the administration's handling`
                  : `${e.name} on ${t.name}: no data`
                const tipContent = (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stanceVar(c ? c.stance : 0) }} />
                    <span><span className="font-medium">{e.name} on {t.name}</span><span className="block">{c ? stanceLabel(c.stance) : 'No data'}</span></span>
                  </span>
                )
                return (
                  <td key={t.id} className="p-0">
                    <Link href={`/topic/${t.id}`} className="block">
                      <span
                        data-testid={`cell-${e.id}-${t.id}`}
                        aria-label={ariaLabel}
                        className="block h-12 rounded transition-transform hover:scale-[1.04]"
                        style={{ backgroundColor: stanceVar(c ? c.stance : 0) }}
                        {...bind(tipContent)}
                      />
                    </Link>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
