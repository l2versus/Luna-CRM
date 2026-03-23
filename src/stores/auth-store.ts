import { create } from 'zustand'

interface AuthUser {
  id: string
  name: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'PATIENT'
  avatar?: string
  tenantId?: string
  teamRole?: string
  tenantName?: string
  tenantSlug?: string
  plan?: string
  planStatus?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('luna-token') : null,
  isLoading: true,

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    localStorage.setItem('luna-token', data.token)
    document.cookie = `luna-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    set({ user: data.user, token: data.token })
  },

  register: async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    localStorage.setItem('luna-token', data.token)
    document.cookie = `luna-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    set({ user: data.user, token: data.token })
  },

  logout: () => {
    localStorage.removeItem('luna-token')
    document.cookie = 'luna-token=; path=/; max-age=0'
    set({ user: null, token: null })
    window.location.href = '/login'
  },

  loadSession: async () => {
    const token = get().token
    if (!token) {
      set({ isLoading: false })
      return
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Session expired')
      const data = await res.json()
      set({ user: data.user, isLoading: false })
    } catch {
      localStorage.removeItem('luna-token')
      document.cookie = 'luna-token=; path=/; max-age=0'
      set({ user: null, token: null, isLoading: false })
    }
  },
}))
