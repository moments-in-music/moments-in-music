import { AUTH_COOKIE, AUTH_MAX_AGE, makeToken } from '~/server/utils/authToken'

interface LoginBody {
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const config = useRuntimeConfig()

  if (!config.authPassword || !config.authSecret) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'Auth not configured — set NUXT_AUTH_PASSWORD and NUXT_AUTH_SECRET in .env',
    })
  }

  if (!body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing password' })
  }

  if (body.password !== config.authPassword) {
    // small delay to slow brute-force
    await new Promise(r => setTimeout(r, 500))
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  const token = makeToken(config.authSecret)
  setCookie(event, AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_MAX_AGE,
    path: '/',
  })

  return { ok: true }
})
