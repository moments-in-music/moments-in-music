<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Sign in' })

const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)
const { login } = useAuth()
const route = useRoute()

const submit = async () => {
  if (!password.value) return
  loading.value = true
  error.value = null
  try {
    await login(password.value)
    const next = (route.query.next as string) || '/'
    await navigateTo(next)
  }
  catch (e: any) {
    error.value = e?.statusMessage ?? 'Sign in failed'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-brand-cream px-4">
    <div class="w-full max-w-sm">
      <div class="flex items-center gap-3 mb-8 justify-center">
        <span class="h-10 w-10 rounded bg-brand-rust text-white grid place-items-center font-display font-bold text-lg">
          M
        </span>
        <span class="font-display text-xl text-brand-ink">Moments in Music</span>
      </div>

      <form
        class="bg-white rounded-lg border border-brand-muted/20 shadow-sm p-6 space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <label for="password" class="block text-xs uppercase tracking-wider text-brand-muted mb-1.5">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            autofocus
            required
            class="w-full rounded border border-brand-muted/30 p-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-brand-rust"
          >
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading || !password"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>

        <p v-if="error" class="text-sm text-red-600 text-center">
          {{ error }}
        </p>
      </form>

      <p class="text-xs text-brand-muted text-center mt-6">
        Internal tool · shared password
      </p>
    </div>
  </div>
</template>
