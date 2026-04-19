/**
 * One-off scraper: pulls music events from Wikipedia "[Year] in music" pages
 * and bulk-inserts them into MongoDB.
 *
 * Stub for now — fleshed out in a follow-up session.
 *
 * Plan:
 *   1. Fetch each year page (1960..2025)
 *   2. Parse sections: Releases, Deaths, Notable events
 *   3. Extract (date, year, headline, artist, summary, url)
 *   4. Normalise date to "MM-DD"
 *   5. Deduplicate on (date, year, artist, event_type)
 *   6. Score "interestingness" via heuristics
 *   7. Bulk insert into `events` collection
 *
 * Run with:  npm run seed:wiki
 */

async function main() {
  console.log('[seed] Wikipedia scraper — not implemented yet')
  console.log('[seed] TODO: fetch https://en.wikipedia.org/wiki/1982_in_music etc.')
  console.log('[seed] TODO: parse → normalise → score → MongoDB insert')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
