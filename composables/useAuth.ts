/**
 * Simple shared-password auth state.
 * Exposes an `authed` ref plus login/logout actions.
 */
export function useAuth() {
  const authed = useState<boolean | null>('auth-authed', () => null)

  const refresh = async () => {
    try {
      const res = await $fetch<{ authed: boolean }>('/api/auth/me')
      authed.value = res.authed
    }
    catch {
      authed.value = false
    }
  }

  const login = async (password: string) => {
    await $fetch('/api/auth/login', { method: 'POST', body: { password } })
    authed.value = true
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authed.value = false
    await navigateTo('/login')
  }

  return { authed, refresh, login, logout }
}
