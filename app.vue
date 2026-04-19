<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Moments in Music` : 'Moments in Music'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
