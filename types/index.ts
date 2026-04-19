export type EventCategory =
  | 'hip-hop'
  | 'rock'
  | 'pop'
  | 'rnb'
  | 'electronic'
  | 'jazz'
  | 'metal'
  | 'country'
  | 'folk'
  | 'other'

export type EventType =
  | 'release'
  | 'death'
  | 'birth'
  | 'chart'
  | 'signing'
  | 'controversy'
  | 'performance'
  | 'debut'
  | 'breakup'
  | 'other'

export interface MusicEvent {
  _id: string
  /** Month-day, zero-padded. e.g. "04-19" */
  date: string
  year: number
  category: EventCategory
  event_type: EventType
  headline: string
  artist: string
  related_artists?: string[]
  album?: string | null
  summary: string
  sources: string[]
  interestingness_score: number
  controversy_level?: number
  notes?: string
  hook_types?: string[]
  angles_available: string[]
  angles_used: string[]
}

export type QueueStatus =
  | 'planned'
  | 'scripted'
  | 'recorded'
  | 'edited'
  | 'scheduled'
  | 'posted'

export interface PlannedVideo {
  _id: string
  event_id: string
  /** ISO date string, e.g. "2026-04-25" */
  post_date: string
  angle: string
  status: QueueStatus
  working_title?: string
  notes?: string
  yt_url?: string | null
  tiktok_url?: string | null
  ig_url?: string | null
  created_by: string
  updated_at: string
}
