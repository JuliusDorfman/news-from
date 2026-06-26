import DivergingBars from '@/components/DivergingBars'
import StanceTimeline from '@/components/StanceTimeline'
import EvidenceList from '@/components/EvidenceList'
import { getTopic, cellsForTopic, evidenceForTopic, getSource } from '@/lib/mockData'
import { stanceColor } from '@/lib/stance'

export default function TopicView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId)
  if (!topic) return <p>Unknown topic.</p>
  const cells = cellsForTopic(topicId).filter(c => c.entityType === 'source')
  const bars = cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance }))
  const lines = cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, color: stanceColor(c.stance), series: c.series }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Topic</p>
        <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="mt-1 text-ink/60">How each outlet leans, and how it has shifted.</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Where outlets stand</h2>
          <DivergingBars items={bars} />
        </section>
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Over time</h2>
          <StanceTimeline lines={lines} />
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-bold">Evidence</h2>
        <EvidenceList items={evidenceForTopic(topicId)} />
      </section>
    </div>
  )
}
