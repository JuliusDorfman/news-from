'use client'
import { stanceVar, stanceLabel } from '@/lib/stance'
import { useTooltip } from './Tooltip'

interface Item { id: string; name: string; stance: number }
interface Props { items: Item[] }

const CENTER = 160
const SCALE = 1.3 // px per stance point (max 100 -> 130px)
const ROW_H = 34
const BAR_H = 18

export default function DivergingBars({ items }: Props) {
  const bind = useTooltip()
  const height = items.length * ROW_H + 24
  return (
    <svg viewBox={`0 0 320 ${height}`} className="w-full h-auto" role="img" aria-label="Stance by outlet">
      <line x1={CENTER} y1={4} x2={CENTER} y2={items.length * ROW_H + 4} stroke="#cbd0d6" strokeDasharray="3 3" />
      {items.map((it, i) => {
        const y = i * ROW_H + 10
        const w = Math.abs(it.stance) * SCALE
        const x = it.stance < 0 ? CENTER - w : CENTER
        const tipContent = (
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stanceVar(it.stance) }} />
            <span><span className="font-medium">{it.name}</span> &mdash; {stanceLabel(it.stance)} ({it.stance})</span>
          </span>
        )
        return (
          <g key={it.id}>
            <text x={6} y={y + BAR_H / 2 + 4} className="fill-ink/70" style={{ fontSize: 11 }}>{it.name}</text>
            <rect
              data-testid={`bar-${it.id}`}
              x={x}
              y={y}
              width={w}
              height={BAR_H}
              rx={3}
              fill={stanceVar(it.stance)}
              aria-label={`${it.name}: ${stanceLabel(it.stance)} (${it.stance})`}
              {...bind(tipContent)}
            />
          </g>
        )
      })}
      <text x={40} y={items.length * ROW_H + 18} className="fill-ink/40" style={{ fontSize: 9 }}>&#8592; critical</text>
      <text x={250} y={items.length * ROW_H + 18} className="fill-ink/40" style={{ fontSize: 9 }}>supportive &#8594;</text>
    </svg>
  )
}
