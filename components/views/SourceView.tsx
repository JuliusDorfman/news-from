import Link from 'next/link'
import StanceTimeline from '@/components/StanceTimeline'
import { getSource, getTopic, cellsForEntity } from '@/lib/mockData'
import { stanceColor, stanceLabel } from '@/lib/stance'

export default function SourceView({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId)
  if (!source) return <p>Unknown outlet.</p>
  const cells = cellsForEntity(sourceId)
  const lines = cells.map(c => ({ id: c.topicId, name: getTopic(c.topicId)!.name, color: stanceColor(c.stance), series: c.series }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Outlet</p>
        <h1 className="text-3xl font-bold tracking-tight">{source.name}</h1>
        <p className="mt-1 text-ink/60">How {source.name} has leaned across topics.</p>
      </header>
      <section className="rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-lg font-bold">Stance over time, by topic</h2>
        <StanceTimeline lines={lines} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-bold">Topics covered</h2>
        <ul className="divide-y divide-black/10">
          {cells.map(c => {
            const topic = getTopic(c.topicId)!
            return (
              <li key={c.topicId} data-testid={`topic-row-${c.topicId}`} className="flex items-center justify-between py-3">
                <Link href={`/topic/${c.topicId}`} className="font-serif text-[15px] hover:underline">{topic.name}</Link>
                <span className="flex items-center gap-2 text-sm text-ink/60">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: stanceColor(c.stance) }} />
                  {stanceLabel(c.stance)}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
