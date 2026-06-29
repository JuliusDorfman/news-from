import DivergingBars from '@/components/DivergingBars'
import FilteredTimeline from '@/components/FilteredTimeline'
import EvidenceList from '@/components/EvidenceList'
import { getTopic, cellsForTopic, evidenceForTopic, getSource } from '@/lib/mockData'

export default function TopicView({ topicId }: { topicId: string }) {
  const topic = getTopic(topicId)
  if (!topic) return <p>Unknown topic.</p>
  const cells = cellsForTopic(topicId).filter(c => c.entityType === 'source')
  const bars = cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance }))

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">Topic</p>
        <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
        <p className="mt-1 text-ink/60">How favorably each outlet covers the current administration&apos;s handling of this topic, and how it has shifted over time.</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Where outlets stand</h2>
          <DivergingBars items={bars} />
        </section>
        <section className="rounded-lg border border-black/10 p-4">
          <h2 className="mb-3 text-lg font-bold">Over time</h2>
          <FilteredTimeline items={cells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, entityId: c.entityId, topicId }))} />
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-bold">Evidence</h2>
        <EvidenceList items={evidenceForTopic(topicId)} />
      </section>
    </div>
  )
}
