import { MongoClient, type Db } from 'mongodb'

let _client: MongoClient | null = null
let _db: Db | null = null

/**
 * Lazily connect to MongoDB Atlas and return the configured db.
 * Returns null if NUXT_MONGO_URI is not set — callers should fall back to
 * mock/in-memory data in that case (useful for initial dev before credentials).
 */
export async function useDb(): Promise<Db | null> {
  if (_db) return _db

  const config = useRuntimeConfig()
  const uri = config.mongoUri
  const dbName = config.mongoDb || 'moments_in_music'

  if (!uri) {
    if (!_warned) {
      console.warn('[mongo] NUXT_MONGO_URI not set — using mock data')
      _warned = true
    }
    return null
  }

  try {
    _client = new MongoClient(uri)
    await _client.connect()
    _db = _client.db(dbName)
    return _db
  }
  catch (err) {
    console.error('[mongo] connection failed:', err)
    return null
  }
}

let _warned = false
