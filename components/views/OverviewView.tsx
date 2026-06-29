import StanceHeatmap from '@/components/StanceHeatmap'
import LensShelf from '@/components/LensShelf'
import { sources, topics, stanceCells, cellsForTopic, getSource } from '@/lib/mockData'

const FEATURED = 'reflecting-pool'

export default function OverviewView() {
  const featuredCells = cellsForTopic(FEATURED).filter(c => c.entityType === 'source')
  const bars = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance })) }
  const map = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance, volume: c.volume })) }
  const timeline = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, entityId: c.entityId, topicId: FEATURED })) }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Current Administration Coverage</h1>
        <h2 className="text-3xl font-bold tracking-tight">Where the press stands</h2>
        <p className="mt-1 text-ink/60">Each cell shows how favorably an outlet covers the current administration&apos;s handling of a topic. Green is supportive, red is critical - it is not the outlet&apos;s stance on the topic itself.</p>
        <div className="mt-6">
          <StanceHeatmap entities={sources} topics={topics} cells={stanceCells} entityType="source" />
          <div className="mt-4 flex items-center gap-3 text-xs text-ink/60">
            <span>Critical of the administration</span>
            <span className="h-2 w-40 rounded" style={{ background: 'linear-gradient(to right, var(--color-stance-critical), var(--color-stance-neutral), var(--color-stance-supportive))' }} />
            <span>Supportive of the administration</span>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold">More ways to read it &mdash; {topics.find(t => t.id === FEATURED)!.name}</h2>
        <p className="mt-1 mb-4 text-sm text-ink/60">Same data, three lenses.</p>
        <LensShelf bars={bars} map={map} timeline={timeline} />
      </section>
    </div>
  )
}
