export type Stance = number // integer -100..100
export type EntityType = 'source' | 'author'

export interface Source { id: string; name: string }
export interface Author { id: string; name: string; outlet: string }
export interface Subtopic { id: string; name: string }
export interface Topic { id: string; name: string; subtopics: Subtopic[] }
export interface SeriesPoint { date: string; stance: Stance }

export interface StanceCell {
  entityId: string
  entityType: EntityType
  topicId: string
  stance: Stance
  volume: number
  series: SeriesPoint[]
}

export interface Evidence {
  id: string
  sourceId: string
  topicId: string
  headline: string
  stance: Stance
  date: string
}
