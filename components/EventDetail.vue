<script setup lang="ts">
import type { MusicEvent } from '~/types'

const props = defineProps<{
  event: MusicEvent
}>()

const emit = defineEmits<{
  close: []
  plan: [payload: { event: MusicEvent; angle: string; working_title: string }]
}>()

const notes = ref(props.event.notes ?? '')
const selectedAngle = ref(props.event.angles_available[0] ?? 'the_event')
const workingTitle = ref('')

watch(
  () => props.event._id,
  () => {
    notes.value = props.event.notes ?? ''
    selectedAngle.value = props.event.angles_available[0] ?? 'the_event'
    workingTitle.value = ''
  },
)

const onPlan = () => {
  emit('plan', {
    event: props.event,
    angle: selectedAngle.value,
    working_title: workingTitle.value,
  })
}
</script>

<template>
  <aside class="bg-white rounded-lg border border-brand-muted/20 shadow-sm p-6 h-fit sticky top-6">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="flex-1">
        <div class="text-xs uppercase tracking-wider text-brand-muted mb-1">
          {{ event.year }} · {{ event.category }} · {{ event.event_type }}
        </div>
        <h2 class="font-display text-2xl text-brand-ink leading-tight">
          {{ event.headline }}
        </h2>
        <p v-if="event.artist" class="text-sm text-brand-ink/70 mt-1">
          {{ event.artist }}
        </p>
      </div>
      <button
        type="button"
        class="text-brand-muted hover:text-brand-ink -mr-2"
        aria-label="Close"
        @click="emit('close')"
      >
        ✕
      </button>
    </div>

    <p v-if="event.summary" class="text-sm text-brand-ink/80 mb-4 leading-relaxed">
      {{ event.summary }}
    </p>

    <section v-if="event.sources?.length" class="mb-4">
      <h3 class="text-xs uppercase tracking-wider text-brand-muted mb-2">Sources</h3>
      <ul class="space-y-1 text-sm">
        <li v-for="src in event.sources" :key="src">
          <a
            :href="src"
            target="_blank"
            rel="noopener"
            class="text-brand-rust hover:underline break-all"
          >
            {{ src }}
          </a>
        </li>
      </ul>
    </section>

    <section class="mb-4">
      <h3 class="text-xs uppercase tracking-wider text-brand-muted mb-2">Notes</h3>
      <textarea
        v-model="notes"
        rows="6"
        placeholder="Angle ideas, controversy, hook, things worth checking..."
        class="w-full rounded border border-brand-muted/30 p-3 text-sm
               focus:outline-none focus:ring-2 focus:ring-brand-rust font-mono"
      />
      <p class="text-xs text-brand-muted mt-1">
        Auto-save on plan. Markdown supported (TBD).
      </p>
    </section>

    <section class="mb-4">
      <h3 class="text-xs uppercase tracking-wider text-brand-muted mb-2">Angle</h3>
      <select
        v-model="selectedAngle"
        class="w-full rounded border border-brand-muted/30 p-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-brand-rust"
      >
        <option
          v-for="a in event.angles_available"
          :key="a"
          :value="a"
          :disabled="event.angles_used.includes(a)"
        >
          {{ a }} {{ event.angles_used.includes(a) ? '(used)' : '' }}
        </option>
      </select>
    </section>

    <section class="mb-4">
      <h3 class="text-xs uppercase tracking-wider text-brand-muted mb-2">Working title</h3>
      <input
        v-model="workingTitle"
        type="text"
        placeholder="e.g. The day Randy Rhoads played his last gig"
        class="w-full rounded border border-brand-muted/30 p-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-brand-rust"
      >
    </section>

    <button
      type="button"
      class="btn-primary w-full"
      :disabled="!workingTitle"
      @click="onPlan"
    >
      Plan this video
    </button>
  </aside>
</template>
