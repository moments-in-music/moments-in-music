<script setup lang="ts">
import { addDays, format } from 'date-fns'

const props = defineProps<{
  modelValue: Date
}>()

const emit = defineEmits<{
  'update:modelValue': [date: Date]
}>()

const goPrev = () => emit('update:modelValue', addDays(props.modelValue, -1))
const goNext = () => emit('update:modelValue', addDays(props.modelValue, 1))
const goToday = () => emit('update:modelValue', new Date())

const label = computed(() => format(props.modelValue, 'EEEE, d MMMM yyyy'))
const dayKey = computed(() => format(props.modelValue, 'MM-dd'))

const isToday = computed(() => {
  const t = new Date()
  return (
    t.getDate() === props.modelValue.getDate()
    && t.getMonth() === props.modelValue.getMonth()
    && t.getFullYear() === props.modelValue.getFullYear()
  )
})

// Keyboard nav
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    // Ignore if user is typing in an input/textarea
    const target = e.target as HTMLElement
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
    if (target?.isContentEditable) return

    if (e.key === 'ArrowLeft') goPrev()
    else if (e.key === 'ArrowRight') goNext()
    else if (e.key === 't' || e.key === 'T') goToday()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <div class="flex items-center justify-between gap-4 pb-6 border-b border-brand-muted/20">
    <button
      type="button"
      class="btn-ghost h-10 w-10 p-0"
      aria-label="Previous day"
      @click="goPrev"
    >
      <span aria-hidden="true" class="text-xl">‹</span>
    </button>

    <div class="flex-1 text-center">
      <h1 class="font-display text-3xl text-brand-ink">{{ label }}</h1>
      <p class="text-xs uppercase tracking-wider text-brand-muted mt-1">
        Day key · {{ dayKey }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <button
        v-if="!isToday"
        type="button"
        class="btn-ghost text-sm"
        @click="goToday"
      >
        Today
      </button>
      <button
        type="button"
        class="btn-ghost h-10 w-10 p-0"
        aria-label="Next day"
        @click="goNext"
      >
        <span aria-hidden="true" class="text-xl">›</span>
      </button>
    </div>
  </div>
</template>
