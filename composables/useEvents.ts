import type { MusicEvent } from '~/types'

/**
 * Fetch candidate events for a given date (month-day, e.g. "04-19").
 * Falls back to mock data if API is unavailable.
 */
export function useEventsForDate(date: Ref<string> | string) {
  const dateRef = isRef(date) ? date : ref(date)

  return useAsyncData<MusicEvent[]>(
    () => `events-${dateRef.value}`,
    () => $fetch(`/api/events/${dateRef.value}`),
    {
      watch: [dateRef],
      default: () => [],
    },
  )
}

/**
 * Utility: turn a JS Date into "MM-DD" (year-agnostic day key).
 */
export function toDayKey(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}

/**
 * Utility: format a Date for display (e.g. "Saturday, 19 April").
 */
export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
