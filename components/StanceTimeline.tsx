'use client'
import type { SeriesPoint } from '@/lib/types'
import { stanceLabel } from '@/lib/stance'
import { pointHeadline, monthLabel } from '@/lib/headlines'
import { useTooltip } from './Tooltip'

interface Line { id: string; name: string; color: string; series: SeriesPoint[] }
interface Props { lines: Line[] }

const W = 320, H = 190, PAD_L = 34, PAD_R = 14, TOP = 20, BOTTOM = 160
const MID = (TOP + BOTTOM) / 2

function xFor(i: number, n: number) {
  if (n <= 1) return PAD_L
  return PAD_L + (i * (W - PAD_L - PAD_R)) / (n - 1)
}
function yFor(stance: number) {
  return MID - (stance / 100) * (MID - TOP)
}

export default function StanceTimeline({ lines }: Props) {
  const bind = useTooltip()
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Stance over time">
      <line x1={PAD_L} y1={MID} x2={W - PAD_R} y2={MID} stroke="#cbd0d6" strokeDasharray="3 3" />
      <line x1={PAD_L} y1={TOP} x2={PAD_L} y2={BOTTOM} stroke="#cbd0d6" />
      <text x={6} y={TOP + 12} className="fill-ink/40" style={{ fontSize: 9 }}>supportive</text>
      <text x={6} y={BOTTOM} className="fill-ink/40" style={{ fontSize: 9 }}>critical</text>
      {lines.map(l => {
        const pts = l.series.map((p, i) => `${xFor(i, l.series.length).toFixed(1)},${yFor(p.stance).toFixed(1)}`).join(' ')
        return (
          <g key={l.id}>
            <polyline data-testid={`line-${l.id}`} points={pts} fill="none" stroke={l.color} strokeWidth={2.5} />
            {l.series.map((p, i) => {
              const cx = xFor(i, l.series.length)
              const cy = yFor(p.stance)
              const tipContent = (
                <span>
                  <span className="font-medium">{monthLabel(p.date)} &middot; {stanceLabel(p.stance)}</span>
                  <span className="mt-0.5 block italic text-ink/70">&ldquo;{pointHeadline(p.stance, p.date)}&rdquo;</span>
                </span>
              )
              return (
                <g key={i}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    fill="transparent"
                    aria-label={`${monthLabel(p.date)}: ${stanceLabel(p.stance)} - ${pointHeadline(p.stance, p.date)}`}
                    {...bind(tipContent)}
                  />
                  <circle
                    data-testid={`point-${l.id}-${i}`}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill={l.color}
                  />
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}
