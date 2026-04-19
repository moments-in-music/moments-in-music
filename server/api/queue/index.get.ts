import type { PlannedVideo } from '~/types'
import { useDb } from '~/server/utils/mongo'
import { memQueue } from '~/server/utils/memStore'

/**
 * GET /api/queue
 * Returns all planned videos sorted by post_date asc.
 */
export default defineEventHandler(async () => {
  const db = await useDb()

  if (!db) {
    return [...memQueue].sort((a, b) => a.post_date.localeCompare(b.post_date))
  }

  const col = db.collection<PlannedVideo>('planned_videos')
  return col.find({}).sort({ post_date: 1 }).toArray()
})
