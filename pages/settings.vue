<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
useHead({ title: 'Settings' })

const config = useRuntimeConfig()
</script>

<template>
  <div>
    <header class="mb-6">
      <h1 class="font-display text-3xl text-brand-ink">Settings</h1>
    </header>

    <div class="space-y-6">
      <section class="card">
        <h2 class="font-display text-lg text-brand-ink mb-2">Environment</h2>
        <dl class="text-sm space-y-1">
          <div class="flex gap-2">
            <dt class="text-brand-muted w-32">App name:</dt>
            <dd>{{ config.public.appName }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="text-brand-muted w-32">Clerk:</dt>
            <dd>{{ config.public.clerkPublishableKey ? 'configured' : 'not configured' }}</dd>
          </div>
        </dl>
      </section>

      <section class="card">
        <h2 class="font-display text-lg text-brand-ink mb-2">Brand voice</h2>
        <p class="text-sm text-brand-muted">
          Narrator persona, music bed preferences, visual style tokens — UI TBD.
        </p>
      </section>
    </div>
  </div>
</template>
