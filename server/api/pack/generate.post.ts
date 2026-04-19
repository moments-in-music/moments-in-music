import { mkdir, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { PlannedVideo, MusicEvent } from '~/types'
import { useDb } from '~/server/utils/mongo'
import { memQueue } from '~/server/utils/memStore'
import { MOCK_EVENTS } from '~/server/utils/mockEvents'

interface PackRequest {
  plan_id: string
}

/**
 * POST /api/pack/generate
 * Creates a CapCut-ready folder on disk with script.txt, metadata.json, and
 * a README for the planned video.
 *
 * Folder structure:
 *   ~/MomentsInMusic/episodes/<post_date>_<slug>/
 *     ├── README.md
 *     ├── metadata.json
 *     ├── script.txt
 *     ├── images_needed.md
 *     └── images/   (empty — you drop Firefly exports here)
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<PackRequest>(event)
  if (!body?.plan_id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing plan_id' })
  }

  const { plan, sourceEvent } = await resolvePlan(body.plan_id)
  if (!plan) {
    throw createError({ statusCode: 404, statusMessage: 'Plan not found' })
  }

  const root = join(homedir(), 'MomentsInMusic', 'episodes')
  const slug = slugify(plan.working_title || sourceEvent?.headline || plan.event_id)
  const folderName = `${plan.post_date}_${slug}`
  const folderPath = join(root, folderName)

  await mkdir(join(folderPath, 'images'), { recursive: true })

  // README
  const readme = buildReadme(plan, sourceEvent)
  await writeFile(join(folderPath, 'README.md'), readme, 'utf8')

  // metadata.json
  const metadata = buildMetadata(plan, sourceEvent)
  await writeFile(
    join(folderPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8',
  )

  // script.txt (empty stub for now; user fills in CapCut)
  const scriptStub = buildScriptStub(plan, sourceEvent)
  await writeFile(join(folderPath, 'script.txt'), scriptStub, 'utf8')

  // images_needed.md
  const images = buildImagesMd(plan, sourceEvent)
  await writeFile(join(folderPath, 'images_needed.md'), images, 'utf8')

  return { path: folderPath }
})

// ─── helpers ─────────────────────────────────────────────────────────────

async function resolvePlan(planId: string): Promise<{
  plan: PlannedVideo | null
  sourceEvent: MusicEvent | null
}> {
  const db = await useDb()
  let plan: PlannedVideo | null = null
  let sourceEvent: MusicEvent | null = null

  if (db) {
    plan = await db.collection<PlannedVideo>('planned_videos').findOne({ _id: planId as any })
    if (plan) {
      sourceEvent = await db.collection<MusicEvent>('events').findOne({ _id: plan.event_id as any })
    }
  }
  else {
    plan = memQueue.find(p => p._id === planId) ?? null
    if (plan) {
      sourceEvent = MOCK_EVENTS.find(e => e._id === plan!.event_id) ?? null
    }
  }

  return { plan, sourceEvent }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
}

function buildReadme(plan: PlannedVideo, event: MusicEvent | null): string {
  return [
    `# ${plan.working_title || 'Untitled'}`,
    '',
    `- **Post date:** ${plan.post_date}`,
    `- **Angle:** ${plan.angle}`,
    `- **Status:** ${plan.status}`,
    event ? `- **Event:** ${event.headline} (${event.year})` : '',
    event ? `- **Artist:** ${event.artist}` : '',
    '',
    '## Workflow',
    '',
    '1. Review `script.txt` and flesh out the narration',
    '2. Drop Firefly-generated images into `./images/`',
    '3. Open CapCut and import this folder',
    '4. Render vertical 9:16 1080x1920',
    '5. Upload with the title and description from `metadata.json`',
    '6. Paste the YouTube URL back into the app',
  ].filter(Boolean).join('\n')
}

function buildMetadata(plan: PlannedVideo, event: MusicEvent | null) {
  const hashtags = ['#Shorts', '#MusicHistory', '#MomentsInMusic']
  if (event?.category) hashtags.push(`#${event.category.replace(/-/g, '')}`)

  return {
    working_title: plan.working_title ?? null,
    post_date: plan.post_date,
    angle: plan.angle,
    youtube: {
      title: `${plan.working_title || event?.headline || 'Moments in Music'} #Shorts`,
      description: [
        plan.working_title || event?.headline || '',
        '',
        event?.summary || '',
        '',
        '— Moments in Music',
        'A moment in music, every day.',
      ].join('\n'),
      tags: [
        'music history',
        event?.artist,
        event?.category,
        event?.event_type,
      ].filter(Boolean),
    },
    tiktok: {
      caption: `${plan.working_title || event?.headline} ${hashtags.join(' ')}`,
    },
    instagram: {
      caption: `${plan.working_title || event?.headline}\n\n${hashtags.join(' ')}`,
    },
  }
}

function buildScriptStub(plan: PlannedVideo, event: MusicEvent | null): string {
  return [
    `[HOOK — 0-2s]`,
    `On this day in ${event?.year ?? 'YYYY'}...`,
    '',
    `[CONTEXT — 2-10s]`,
    event?.summary ?? '(summary here)',
    '',
    `[PAYOFF — 10-40s]`,
    '(the story, the twist, the hook pays off)',
    '',
    `[CTA — 40-55s]`,
    'That was your moment in music. Follow @dailymusicmoments for more.',
  ].join('\n')
}

function buildImagesMd(plan: PlannedVideo, event: MusicEvent | null): string {
  return [
    `# Images needed for: ${plan.working_title || 'this video'}`,
    '',
    `Generate 5-8 images in Firefly with the brand style prompt, using the following ideas:`,
    '',
    event ? `1. Portrait of ${event.artist}, era-appropriate (${event.year})` : '1. Subject portrait',
    event ? `2. Scene evoking the event: ${event.headline}` : '2. Scene',
    '3. Concept / metaphor shot (instrument, vinyl, studio, etc.)',
    '4. Period-appropriate background / era aesthetic',
    '5. Payoff shot — something visually striking for the climax',
    '',
    '## Firefly prompt template',
    '```',
    '[subject], 8-bit pixelated style, faded VHS aesthetic,',
    'warm amber tones, 1990s analog, cinematic lighting, moody atmosphere',
    '```',
    '',
    'Drop exports into `./images/` — CapCut will pick them up from there.',
  ].join('\n')
}
