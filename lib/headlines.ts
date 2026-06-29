const SUPPORTIVE = [
  'Administration touts progress on the issue',
  'Officials credited for steady handling',
  'Supporters rally behind the response',
]
const CRITICAL = [
  "Critics slam the administration's approach",
  'Watchdog questions the handling',
  'Coverage spotlights administration setbacks',
]
const NEUTRAL = [
  'Mixed reactions to the latest developments',
  'Analysts split on the administration record',
]

function hash(s: string): number {
  let h = 0
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

export function pointHeadline(stance: number, date: string): string {
  const pool = stance >= 20 ? SUPPORTIVE : stance <= -20 ? CRITICAL : NEUTRAL
  return pool[hash(date) % pool.length]
}

export function monthLabel(date: string): string {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const m = parseInt(date.split('-')[1], 10)
  const y = date.split('-')[0]
  return `${months[m - 1]} ${y}`
}
