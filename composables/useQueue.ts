import type { PlannedVideo } from '~/types'

/** Fetch upcoming planned videos. */
export function useQueue() {
  return useAsyncData<PlannedVideo[]>(
    'queue',
    () => $fetch('/api/queue'),
    { default: () => [] },
  )
}

/** Plan a new video: event + post_date + angle. */
export async function planVideo(payload: {
  event_id: string
  post_date: string
  angle: string
  working_title?: string
}) {
  return $fetch<PlannedVideo>('/api/queue', {
    method: 'POST',
    body: payload,
  })
}
