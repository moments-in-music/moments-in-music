<script setup lang="ts">
import { addDays, format, isSameDay } from 'date-fns'
import type { PlannedVideo } from '~/types'

const props = defineProps<{
  days?: number
  planned?: PlannedVideo[]
}>()

const emit = defineEmits<{
  select: [date: Date]
}>()

const daysToShow = computed(() => props.days ?? 60)

const cells = computed(() => {
  const today = new Date()
  return Array.from({ length: daysToShow.value }, (_, i) => {
    const d = addDays(today, i)
    const iso = format(d, 'yyyy-MM-dd')
    const plan = props.planned?.find(p => p.post_date === iso)
    return {
      date: d,
      iso,
      label: format(d, 'd'),
      month: format(d, 'MMM'),
      isToday: isSameDay(d, today),
      planned: !!plan,
      status: plan?.status,
    }
  })
})
</script>

<template>
  <section>
    <header class="mb-3 flex items-center justify-between">
      <h2 class="font-display text-xl text-brand-ink">Next {{ daysToShow }} days</h2>
      <div class="flex items-center gap-4 text-xs text-brand-muted">
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-brand-rust" /> planned
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-sm bg-brand-amber/50" /> empty
        </span>
      </div>
    </header>

    <div class="grid grid-cols-10 gap-1.5">
      <button
        v-for="cell in cells"
        :key="cell.iso"
        type="button"
        class="aspect-square rounded flex flex-col items-center justify-center
               text-xs transition-all hover:scale-105 hover:shadow"
        :class="[
          cell.planned
            ? 'bg-brand-rust text-white'
            : 'bg-brand-amber/30 text-brand-ink hover:bg-brand-amber/50',
          cell.isToday ? 'ring-2 ring-brand-ink ring-offset-1' : '',
        ]"
        :title="cell.iso + (cell.status ? ' · ' + cell.status : '')"
        @click="emit('select', cell.date)"
      >
        <span class="font-medium leading-none">{{ cell.label }}</span>
        <span class="text-[9px] uppercase opacity-70 leading-none mt-0.5">
          {{ cell.month }}
        </span>
      </button>
    </div>
  </section>
</template>
