import type { Stance } from './types'

export function clampStance(n: number): Stance {
  return Math.max(-100, Math.min(100, Math.round(n)))
}

export function stanceLabel(s: Stance): string {
  if (s <= -60) return 'Critical'
  if (s <= -20) return 'Leans critical'
  if (s < 20) return 'Neutral'
  if (s < 60) return 'Leans supportive'
  return 'Supportive'
}

export function stanceColor(s: Stance): string {
  if (s <= -60) return '#d64045'
  if (s <= -20) return '#e07a52'
  if (s < 20) return '#e9c46a'
  if (s < 60) return '#74b97a'
  return '#2f9e54'
}
