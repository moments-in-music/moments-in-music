<script setup lang="ts">
import type { MusicEvent } from '~/types'

const props = defineProps<{
  event: MusicEvent
  selected?: boolean
}>()

defineEmits<{
  select: [event: MusicEvent]
}>()

const categoryColors: Record<string, string> = {
  'hip-hop': 'bg-purple-100 text-purple-900',
  'rock': 'bg-red-100 text-red-900',
  'pop': 'bg-pink-100 text-pink-900',
  'rnb': 'bg-blue-100 text-blue-900',
  'electronic': 'bg-cyan-100 text-cyan-900',
  'jazz': 'bg-amber-100 text-amber-900',
  'metal': 'bg-zinc-200 text-zinc-900',
  'country': 'bg-orange-100 text-orange-900',
  'folk': 'bg-green-100 text-green-900',
  'other': 'bg-brand-muted/20 text-brand-ink',
}

const categoryClass = computed(
  () => categoryColors[props.event.category] ?? categoryColors.other,
)

const anglesUnused = computed(
  () => props.event.angles_available.length - props.event.angles_used.length,
)

const isCovered = computed(() => props.event.angles_used.length > 0)
</script>

<template>
  <button
    type="button"
    class="card w-full text-left"
    :class="selected ? 'ring-2 ring-brand-rust shadow-md' : ''"
    @click="$emit('select', event)"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            class="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
            :class="categoryClass"
          >
            {{ event.category }}
          </span>
          <span class="text-xs text-brand-muted">
            {{ event.year }} · {{ event.event_type }}
          </span>
          <span
            v-if="isCovered"
            class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium"
          >
            ✓ covered
          </span>
        </div>

        <h3 class="font-display text-lg text-brand-ink leading-tight">
          {{ event.headline }}
        </h3>

        <p v-if="event.summary" class="text-sm text-brand-ink/70 mt-1.5 line-clamp-2">
          {{ event.summary }}
        </p>
      </div>

      <div class="text-right flex-shrink-0">
        <div class="font-display text-2xl text-brand-rust leading-none">
          {{ event.interestingness_score.toFixed(1) }}
        </div>
        <div class="text-[10px] uppercase tracking-wider text-brand-muted mt-0.5">
          score
        </div>
        <div class="text-xs text-brand-muted mt-2">
          {{ anglesUnused }} angle{{ anglesUnused === 1 ? '' : 's' }} left
        </div>
      </div>
    </div>
  </button>
</template>
