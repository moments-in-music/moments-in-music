<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()

const nav = [
  { to: '/', label: 'Day' },
  { to: '/queue', label: 'Queue' },
  { to: '/events', label: 'Events' },
  { to: '/settings', label: 'Settings' },
]

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-brand-muted/20 bg-white/80 backdrop-blur">
      <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <span class="h-8 w-8 rounded bg-brand-rust text-white grid place-items-center font-display font-bold">
            M
          </span>
          <span class="font-display text-lg text-brand-ink group-hover:text-brand-rust transition-colors">
            Moments in Music
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-brand-ink text-white'
              : 'text-brand-ink/70 hover:text-brand-ink hover:bg-brand-ink/5'"
          >
            {{ item.label }}
          </NuxtLink>

          <button
            type="button"
            class="ml-2 px-3 py-1.5 rounded-md text-sm text-brand-muted hover:text-brand-rust hover:bg-brand-ink/5 transition-colors"
            @click="logout"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <div class="mx-auto max-w-6xl px-6 py-8">
        <slot />
      </div>
    </main>

    <footer class="border-t border-brand-muted/20 py-4 text-center text-xs text-brand-muted">
      Moments in Music · internal tool
    </footer>
  </div>
</template>
