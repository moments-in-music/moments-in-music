<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Events' })
</script>

<template>
  <div>
    <header class="mb-6">
      <h1 class="font-display text-3xl text-brand-ink">Events library</h1>
      <p class="text-sm text-brand-muted mt-1">
        Browse and search the whole event database.
      </p>
    </header>

    <div class="card text-center py-12">
      <p class="text-brand-muted">Search + filtering UI — coming soon.</p>
      <p class="text-xs text-brand-muted mt-2">
        Planned: filter by category, event_type, year range; full-text search on headline + summary.
      </p>
    </div>
  </div>
</template>
