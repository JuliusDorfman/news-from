'use client'
import { useState } from 'react'
import Link from 'next/link'
import StanceTimeline from './StanceTimeline'
import { getTopic, cellsForEntity, subtopicReadings } from '@/lib/mockData'
import { stanceVar, stanceLabel } from '@/lib/stance'

interface Props { kind: string; name: string; affiliation?: string; entityId: string }

export default function EntityDeepDive({ kind, name, affiliation, entityId }: Props) {
  const cells = cellsForEntity(entityId)
  const lines = cells.map(c => ({ id: c.topicId, name: getTopic(c.topicId)!.name, color: stanceVar(c.stance), series: c.series }))
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm uppercase tracking-wide text-ink/50">{kind}</p>
        <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
        <p className="mt-1 text-ink/60">{affiliation ? `${affiliation} - ` : ''}How favorably {name} covers the current administration&apos;s handling across topics and subtopics.</p>
      </header>

      <section className="rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 text-lg font-bold">Stance over time, by topic</h2>
        <StanceTimeline lines={lines} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Topics &amp; subtopics</h2>
        {cells.map(c => {
          const topic = getTopic(c.topicId)!
          const subs = subtopicReadings(entityId, c.topicId)
          return (
            <div key={c.topicId} data-testid={`topic-row-${c.topicId}`} className="rounded-lg border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <Link href={`/topic/${c.topicId}`} className="font-serif text-[15px] font-bold hover:underline">{topic.name}</Link>
                <span className="flex items-center gap-2 text-sm text-ink/60">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: stanceVar(c.stance) }} />
                  {stanceLabel(c.stance)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {subs.map(s => {
                  const key = `${c.topicId}:${s.id}`
                  const active = selected === key
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-testid={`subtopic-${s.id}`}
                      aria-pressed={active}
                      onClick={() => setSelected(active ? null : key)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors ${active ? 'border-ink' : 'border-black/15 hover:border-ink/40'}`}
                    >
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stanceVar(s.stance) }} />
                      {s.name}
                    </button>
                  )
                })}
              </div>
              {subs.map(s => {
                const key = `${c.topicId}:${s.id}`
                if (selected !== key) return null
                return (
                  <div key={s.id} className="mt-4 rounded border border-black/10 p-3">
                    <p className="mb-2 text-xs text-ink/60">{name} on {s.name}: {stanceLabel(s.stance)} of the administration&apos;s handling</p>
                    <StanceTimeline lines={[{ id: s.id, name: s.name, color: stanceVar(s.stance), series: s.series }]} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>
    </div>
  )
}
