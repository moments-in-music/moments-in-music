# Moments in Music

Internal curation tool for the **Moments in Music** YouTube channel.
Helps plan daily music-history Shorts by browsing events per day, taking notes, queueing up a week ahead, and generating CapCut-ready packs.

## Stack

- **Nuxt 3** — Vue 3 + server routes in one
- **Tailwind CSS** — utility-first styling
- **MongoDB Atlas** — text-only data (events, notes, queue)
- **Google Drive** — media storage (images, audio, final MP4s) — not integrated yet
- **Clerk** — auth (2 users)

## Quick start

```bash
# Install dependencies
npm install

# Copy env template and fill in real values
cp .env.example .env
# edit .env with your MongoDB URI + Clerk keys

# Run dev server
npm run dev
# → http://localhost:3000
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run typecheck    # Type-check the whole project
npm run seed:wiki    # One-off: seed events from Wikipedia (TBD)
```

## Project layout

```
app/
  pages/       # File-based routes
    index.vue      → Day view (main screen)
    queue.vue      → Upcoming planned videos
    events/        → Search, detail
    settings.vue
  components/  # Reusable Vue components
  composables/ # useEvents, useQueue
  layouts/     # default.vue (top nav)
  middleware/  # auth.ts

server/
  api/         # HTTP endpoints (Nuxt auto-routes)
    events/
    queue/
    pack/
  utils/
    mongo.ts   # Mongo client singleton

scripts/
  seed-wikipedia.ts  # One-off scraper (TBD)

types/         # Shared TS types
```

## Data model (MongoDB)

Two collections:

**events** — the knowledge base
```
{
  _id, date ("MM-DD"), year, category, event_type,
  headline, artist, summary, sources, notes,
  interestingness_score, angles_available, angles_used
}
```

**planned_videos** — the queue
```
{
  _id, event_id, post_date, angle, status,
  notes, yt_url, tiktok_url, ig_url, created_by, updated_at
}
```

## Workflow

1. **Sunday planning** — review queue for next 7 days, pick events, write notes
2. **Daily** — open today's event, click "Prepare CapCut pack"
3. **Edit in CapCut** → upload to YouTube → paste URL back into app

## Roadmap

- [x] Scaffold (this commit)
- [ ] Wire MongoDB + real events API
- [ ] Wire Clerk auth
- [ ] Wikipedia scraper + seed
- [ ] Calendar heat-map
- [ ] CapCut pack generator
- [ ] Queue management
- [ ] Deploy to Vercel
