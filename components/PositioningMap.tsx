import { stanceVar, stanceLabel } from '@/lib/stance'

interface Item { id: string; name: string; stance: number; volume: number }
interface Props { items: Item[] }

const CENTER_X = 165
const X_SCALE = 1.25

export default function PositioningMap({ items }: Props) {
  return (
    <svg viewBox="0 0 320 190" className="w-full h-auto" role="img" aria-label="Media positioning map">
      <line x1={30} y1={160} x2={300} y2={160} stroke="#cbd0d6" />
      <line x1={CENTER_X} y1={20} x2={CENTER_X} y2={160} stroke="#cbd0d6" strokeDasharray="3 3" />
      <text x={40} y={176} className="fill-ink/40" style={{ fontSize: 9 }}>critical</text>
      <text x={300} y={176} textAnchor="end" className="fill-ink/40" style={{ fontSize: 9 }}>supportive</text>
      <text x={8} y={30} className="fill-ink/40" style={{ fontSize: 9 }}>more coverage</text>
      {items.map(it => {
        const cx = CENTER_X + it.stance * X_SCALE
        const cy = 150 - it.volume          // higher volume -> higher up
        const r = 8 + it.volume / 8
        return (
          <g key={it.id}>
            <title>{`${it.name}: ${stanceLabel(it.stance)} - ${it.volume} articles`}</title>
            <circle data-testid={`bubble-${it.id}`} cx={cx} cy={cy} r={r} fill={stanceVar(it.stance)} opacity={0.85} />
            <text x={cx} y={cy + 3} textAnchor="middle" className="fill-white" style={{ fontSize: 9, fontWeight: 600 }}>{it.name}</text>
          </g>
        )
      })}
    </svg>
  )
}
