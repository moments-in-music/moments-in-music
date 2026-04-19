// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Moments in Music',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Internal curation tool for Moments in Music' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  runtimeConfig: {
    // Server-only env vars
    mongoUri: '',
    mongoDb: 'moments_in_music',
    clerkSecretKey: '',
    authPassword: '', // shared password for the app
    authSecret: '',   // used to sign the auth cookie

    // Client-exposed env vars (prefix with `public`)
    public: {
      clerkPublishableKey: '',
      appName: 'Moments in Music',
    },
  },

  typescript: {
    strict: true,
  },

  nitro: {
    // Vercel deploy preset (auto-detected in most cases, explicit for clarity)
    // preset: 'vercel',
  },
})
