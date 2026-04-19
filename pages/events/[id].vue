<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const id = computed(() => route.params.id as string)

useHead({ title: `Event ${id.value}` })
</script>

<template>
  <div>
    <header class="mb-6">
      <NuxtLink to="/events" class="text-sm text-brand-rust hover:underline">
        ← Back to events
      </NuxtLink>
      <h1 class="font-display text-3xl text-brand-ink mt-2">Event detail</h1>
      <p class="text-sm text-brand-muted mt-1 font-mono">ID: {{ id }}</p>
    </header>

    <div class="card text-center py-12">
      <p class="text-brand-muted">Event detail view — coming soon.</p>
    </div>
  </div>
</template>
