import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'mim_session'
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function makeToken(secret: string): string {
  const issuedAt = Date.now()
  const payload = String(issuedAt)
  const sig = sign(payload, secret)
  return `${payload}.${sig}`
}

export function verifyToken(token: string | undefined, secret: string): boolean {
  if (!token || !secret) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, sig] = parts
  const expected = sign(payload, secret)

  // timing-safe compare
  const a = Buffer.from(sig, 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length) return false
  if (!timingSafeEqual(a, b)) return false

  // Expiry check: token is valid for one week
  const issuedAt = Number(payload)
  if (!Number.isFinite(issuedAt)) return false
  const ageSeconds = (Date.now() - issuedAt) / 1000
  return ageSeconds < ONE_WEEK_SECONDS
}

export const AUTH_COOKIE = COOKIE_NAME
export const AUTH_MAX_AGE = ONE_WEEK_SECONDS
