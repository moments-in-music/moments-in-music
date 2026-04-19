import type { MusicEvent } from '~/types'
import { useDb } from '~/server/utils/mongo'
import { MOCK_EVENTS } from '~/server/utils/mockEvents'

/**
 * GET /api/events/:date
 * Returns candidate events for the given month-day (e.g. "04-19").
 */
export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date')
  if (!date || !/^\d{2}-\d{2}$/.test(date)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid date format — expect MM-DD' })
  }

  const db = await useDb()

  if (!db) {
    // Mock mode: filter the seed data by date
    return MOCK_EVENTS.filter(e => e.date === date)
      .sort((a, b) => b.interestingness_score - a.interestingness_score)
  }

  const col = db.collection<MusicEvent>('events')
  const results = await col
    .find({ date })
    .sort({ interestingness_score: -1, year: -1 })
    .toArray()
  return results
})
