import { AUTH_COOKIE, verifyToken } from '~/server/utils/authToken'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, AUTH_COOKIE)
  const authed = verifyToken(token, config.authSecret)
  return { authed }
})
