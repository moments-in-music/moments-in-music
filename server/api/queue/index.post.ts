import type { PlannedVideo } from '~/types'
import { useDb } from '~/server/utils/mongo'
import { memQueue } from '~/server/utils/memStore'

interface PlanRequest {
  event_id: string
  post_date: string
  angle: string
  working_title?: string
  notes?: string
}

/**
 * POST /api/queue
 * Plan a new video: event + post_date + angle.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<PlanRequest>(event)

  if (!body?.event_id || !body?.post_date || !body?.angle) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: event_id, post_date, angle',
    })
  }

  const plan: PlannedVideo = {
    _id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event_id: body.event_id,
    post_date: body.post_date,
    angle: body.angle,
    status: 'planned',
    working_title: body.working_title,
    notes: body.notes,
    yt_url: null,
    tiktok_url: null,
    ig_url: null,
    created_by: 'ewan', // TODO: from Clerk session
    updated_at: new Date().toISOString(),
  }

  const db = await useDb()
  if (!db) {
    memQueue.push(plan)
    return plan
  }

  const col = db.collection<PlannedVideo>('planned_videos')
  await col.insertOne(plan as any)
  return plan
})
