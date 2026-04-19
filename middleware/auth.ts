/**
 * Page-level auth middleware.
 * Checks the session cookie via /api/auth/me and redirects to /login if absent.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { authed, refresh } = useAuth()

  // On first navigation, hydrate the state from the server
  if (authed.value === null) {
    await refresh()
  }

  if (!authed.value && to.path !== '/login') {
    return navigateTo({ path: '/login', query: { next: to.fullPath } })
  }
})
