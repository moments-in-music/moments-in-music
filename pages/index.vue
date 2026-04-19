<script setup lang="ts">
import { format } from 'date-fns'
import type { MusicEvent } from '~/types'

definePageMeta({
  middleware: ['auth'],
})

const currentDate = ref(new Date())
const dayKey = computed(() => format(currentDate.value, 'MM-dd'))

const { data: events, pending, refresh } = useEventsForDate(dayKey)

const selected = ref<MusicEvent | null>(null)

// Keep selection in sync when the day changes
watch(dayKey, () => { selected.value = null })

// Sort: score desc, then year desc
const sortedEvents = computed(() =>
  [...(events.value ?? [])].sort((a, b) => {
    if (b.interestingness_score !== a.interestingness_score)
      return b.interestingness_score - a.interestingness_score
    return b.year - a.year
  }),
)

const onPlan = async (payload: {
  event: MusicEvent
  angle: string
  working_title: string
}) => {
  await planVideo({
    event_id: payload.event._id,
    post_date: format(currentDate.value, 'yyyy-MM-dd'),
    angle: payload.angle,
    working_title: payload.working_title,
  })
  selected.value = null
  refresh()
}
</script>

<template>
  <div>
    <DayNavigator v-model="currentDate" />

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <!-- Event list -->
      <section>
        <header class="flex items-center justify-between mb-4">
          <h2 class="font-display text-xl text-brand-ink">
            Candidate events
            <span class="text-sm font-sans text-brand-muted ml-2">
              {{ sortedEvents.length }}
            </span>
          </h2>
        </header>

        <div v-if="pending" class="text-brand-muted text-sm">
          Loading events…
        </div>

        <div v-else-if="!sortedEvents.length" class="card text-center py-10">
          <p class="text-brand-muted">
            No events in the database for this day yet.
          </p>
          <p class="text-xs text-brand-muted mt-2">
            Run <code class="font-mono bg-brand-ink/5 px-1.5 py-0.5 rounded">npm run seed:wiki</code>
            to populate events, or add one manually.
          </p>
        </div>

        <ul v-else class="space-y-3">
          <li v-for="ev in sortedEvents" :key="ev._id">
            <EventCard
              :event="ev"
              :selected="selected?._id === ev._id"
              @select="selected = ev"
            />
          </li>
        </ul>
      </section>

      <!-- Detail panel -->
      <div>
        <EventDetail
          v-if="selected"
          :event="selected"
          @close="selected = null"
          @plan="onPlan"
        />
        <div v-else class="text-sm text-brand-muted p-6 rounded-lg border border-dashed border-brand-muted/30">
          <p class="font-medium text-brand-ink mb-1">Pick an event</p>
          <p>Click any event on the left to see details, write notes, and plan a video.</p>
          <p class="mt-4 text-xs">
            Tip: use <kbd class="font-mono px-1.5 py-0.5 bg-white border rounded">←</kbd>
            <kbd class="font-mono px-1.5 py-0.5 bg-white border rounded ml-1">→</kbd>
            to navigate days,
            <kbd class="font-mono px-1.5 py-0.5 bg-white border rounded ml-1">T</kbd>
            jumps to today.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
