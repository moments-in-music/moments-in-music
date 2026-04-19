import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { PlannedVideo } from '~/types'

/**
 * Local queue store used when MongoDB isn't configured.
 * Persists to `.data/queue.json` in the project root so the queue
 * survives dev server restarts during the first week of use.
 *
 * Replace by switching to MongoDB once NUXT_MONGO_URI is set.
 */

const DATA_DIR = join(process.cwd(), '.data')
const QUEUE_FILE = join(DATA_DIR, 'queue.json')

function loadQueue(): PlannedVideo[] {
  try {
    if (!existsSync(QUEUE_FILE)) return []
    const raw = readFileSync(QUEUE_FILE, 'utf8')
    return JSON.parse(raw) as PlannedVideo[]
  }
  catch (err) {
    console.warn('[memStore] failed to load queue.json:', err)
    return []
  }
}

function saveQueue(q: PlannedVideo[]) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    writeFileSync(QUEUE_FILE, JSON.stringify(q, null, 2), 'utf8')
  }
  catch (err) {
    console.error('[memStore] failed to save queue.json:', err)
  }
}

const _queue = loadQueue()

/**
 * Reactive Proxy-like wrapper — mutations via .push / splice / etc.
 * auto-persist to disk. Array semantics preserved.
 */
export const memQueue: PlannedVideo[] = new Proxy(_queue, {
  set(target, prop, value) {
    (target as any)[prop] = value
    saveQueue(target)
    return true
  },
  deleteProperty(target, prop) {
    delete (target as any)[prop]
    saveQueue(target)
    return true
  },
}) as PlannedVideo[]
