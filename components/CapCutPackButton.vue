<script setup lang="ts">
import type { PlannedVideo } from '~/types'

const props = defineProps<{
  plan: PlannedVideo
}>()

const loading = ref(false)
const packPath = ref<string | null>(null)
const error = ref<string | null>(null)

const generate = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await $fetch<{ path: string }>('/api/pack/generate', {
      method: 'POST',
      body: { plan_id: props.plan._id },
    })
    packPath.value = res.path
  }
  catch (e: any) {
    error.value = e?.message ?? 'Failed to generate pack'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button
      type="button"
      class="btn-primary"
      :disabled="loading"
      @click="generate"
    >
      {{ loading ? 'Generating…' : 'Prepare CapCut pack' }}
    </button>

    <p v-if="packPath" class="text-xs text-emerald-700 mt-2 font-mono break-all">
      ✓ Pack ready: {{ packPath }}
    </p>
    <p v-if="error" class="text-xs text-red-600 mt-2">
      {{ error }}
    </p>
  </div>
</template>
