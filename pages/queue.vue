<script setup lang="ts">
import { format } from 'date-fns'

definePageMeta({
  middleware: ['auth'],
})

useHead({ title: 'Queue' })

const { data: queue, pending } = useQueue()
const router = useRouter()

const onCellSelect = (d: Date) => {
  // For now — go to day view at this date
  // TODO: make day view accept a `?date=` query param
  router.push('/')
  // eslint-disable-next-line no-console
  console.log('Jump to day', format(d, 'yyyy-MM-dd'))
}
</script>

<template>
  <div>
    <header class="mb-6">
      <h1 class="font-display text-3xl text-brand-ink">Queue</h1>
      <p class="text-sm text-brand-muted mt-1">
        Upcoming planned videos. Click a day to jump to it.
      </p>
    </header>

    <CalendarHeatmap :planned="queue ?? []" @select="onCellSelect" />

    <section class="mt-10">
      <h2 class="font-display text-xl text-brand-ink mb-4">
        Upcoming
        <span class="text-sm font-sans text-brand-muted ml-2">
          {{ queue?.length ?? 0 }}
        </span>
      </h2>

      <div v-if="pending" class="text-brand-muted text-sm">Loading…</div>

      <div v-else-if="!queue?.length" class="card text-center py-10">
        <p class="text-brand-muted">No planned videos yet.</p>
        <p class="text-xs text-brand-muted mt-2">
          Go to the <NuxtLink to="/" class="text-brand-rust hover:underline">Day view</NuxtLink>
          to plan one.
        </p>
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="plan in queue"
          :key="plan._id"
          class="card flex items-center justify-between"
        >
          <div>
            <div class="text-xs text-brand-muted">
              {{ plan.post_date }} · {{ plan.angle }} · {{ plan.status }}
            </div>
            <div class="font-display text-lg text-brand-ink">
              {{ plan.working_title || '(no title yet)' }}
            </div>
          </div>
          <CapCutPackButton :plan="plan" />
        </li>
      </ul>
    </section>
  </div>
</template>
