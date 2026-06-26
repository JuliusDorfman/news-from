import StanceHeatmap from '@/components/StanceHeatmap'
import LensShelf from '@/components/LensShelf'
import { sources, topics, stanceCells, cellsForTopic, getSource } from '@/lib/mockData'
import { stanceColor } from '@/lib/stance'

const FEATURED = 'reflecting-pool'

export default function OverviewView() {
  const featuredCells = cellsForTopic(FEATURED).filter(c => c.entityType === 'source')
  const bars = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance })) }
  const map = { items: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, stance: c.stance, volume: c.volume })) }
  const timeline = { lines: featuredCells.map(c => ({ id: c.entityId, name: getSource(c.entityId)!.name, color: stanceColor(c.stance), series: c.series })) }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Where the press stands</h1>
        <p className="mt-1 text-ink/60">Critical to supportive, by source and topic. Click any cell to explore a story.</p>
        <div className="mt-6">
          <StanceHeatmap sources={sources} topics={topics} cells={stanceCells} />
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
