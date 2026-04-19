import { AUTH_COOKIE, verifyToken } from '~/server/utils/authToken'

/**
 * Server middleware: enforces the session cookie on every /api/* route
 * EXCEPT the /api/auth/* routes (login, logout, me).
 */
export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  if (!url.startsWith('/api/')) return
  if (url.startsWith('/api/auth/')) return

  const config = useRuntimeConfig()
  const token = getCookie(event, AUTH_COOKIE)
  if (!verifyToken(token, config.authSecret)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorised' })
  }
})
