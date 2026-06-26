import Link from 'next/link'
import type { Source, Topic, StanceCell } from '@/lib/types'
import { stanceColor, stanceLabel } from '@/lib/stance'

interface Props { sources: Source[]; topics: Topic[]; cells: StanceCell[] }

export default function StanceHeatmap({ sources, topics, cells }: Props) {
  const get = (sid: string, tid: string) => cells.find(c => c.entityId === sid && c.topicId === tid && c.entityType === 'source')
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
          {sources.map(s => (
            <tr key={s.id}>
              <th className="pr-3 text-right text-sm font-sans font-medium text-ink/80 whitespace-nowrap">{s.name}</th>
              {topics.map(t => {
                const c = get(s.id, t.id)
                return (
                  <td key={t.id} className="p-0">
                    <Link href={`/topic/${t.id}`} className="block">
                      <span
                        data-testid={`cell-${s.id}-${t.id}`}
                        title={c ? `${s.name} on ${t.name}: ${stanceLabel(c.stance)} of the administration's handling` : `${s.name} on ${t.name}: no data`}
                        className="block h-12 rounded transition-transform hover:scale-[1.04]"
                        style={{ backgroundColor: stanceColor(c ? c.stance : 0) }}
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
