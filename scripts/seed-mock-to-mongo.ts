/**
 * One-off: pushes the 7-day mock events into MongoDB so the app
 * has real data to render when NUXT_MONGO_URI is set.
 *
 * Idempotent: uses upserts keyed by `_id`, so re-running will not
 * duplicate events and will NOT overwrite notes or angles_used.
 *
 * Run:  npm run seed:mock
 */

import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { MOCK_EVENTS } from '../server/utils/mockEvents'

async function main() {
  const uri = process.env.NUXT_MONGO_URI
  const dbName = process.env.NUXT_MONGO_DB || 'moments_in_music'

  if (!uri) {
    console.error('❌ NUXT_MONGO_URI is not set in .env')
    process.exit(1)
  }

  console.log(`→ connecting to ${dbName}…`)
  const client = new MongoClient(uri)
  await client.connect()

  try {
    const db = client.db(dbName)
    const events = db.collection('events')

    // Create helpful indexes (idempotent)
    await events.createIndex({ date: 1, interestingness_score: -1 })
    await events.createIndex({ artist: 1 })
    await events.createIndex({ year: 1 })

    let inserted = 0
    let skipped = 0

    for (const ev of MOCK_EVENTS) {
      // Only set on insert — never overwrite existing notes, angles_used, etc.
      const res = await events.updateOne(
        { _id: ev._id as any },
        { $setOnInsert: ev as any },
        { upsert: true },
      )
      if (res.upsertedCount > 0) inserted++
      else skipped++
    }

    console.log(`✓ seeded: ${inserted} new, ${skipped} already existed`)

    const total = await events.countDocuments()
    console.log(`✓ events collection now has ${total} document(s)`)

    const sample = await events.findOne({}, { projection: { headline: 1, date: 1, year: 1 } })
    if (sample) {
      console.log(`✓ sample: ${sample.date} / ${sample.year} — ${sample.headline}`)
    }
  }
  finally {
    await client.close()
    console.log('→ connection closed')
  }
}

main().catch((err) => {
  console.error('❌ seed failed:', err)
  process.exit(1)
})
