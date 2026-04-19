import type { MusicEvent } from '~/types'
import { useDb } from '~/server/utils/mongo'

/**
 * POST /api/events
 * Create a new event in the DB.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<MusicEvent>>(event)

  if (!body?.headline || !body?.date || !body?.year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: headline, date, year',
    })
  }

  const db = await useDb()
  if (!db) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable — set NUXT_MONGO_URI',
    })
  }

  const col = db.collection('events')
  const doc: Partial<MusicEvent> = {
    ...body,
    angles_available: body.angles_available ?? ['the_event'],
    angles_used: body.angles_used ?? [],
    sources: body.sources ?? [],
    interestingness_score: body.interestingness_score ?? 5.0,
  }
  const result = await col.insertOne(doc as any)
  return { _id: result.insertedId, ...doc }
})
