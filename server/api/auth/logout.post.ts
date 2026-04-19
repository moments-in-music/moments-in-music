import { AUTH_COOKIE } from '~/server/utils/authToken'

export default defineEventHandler((event) => {
  deleteCookie(event, AUTH_COOKIE, { path: '/' })
  return { ok: true }
})
