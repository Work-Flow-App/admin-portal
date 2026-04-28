import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  tenantId: string | null
  setToken: (token: string) => void
  setTenantId: (tenantId: string) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tenantId: null,
      setToken: (token) => set({ token }),
      setTenantId: (tenantId) => set({ tenantId }),
      clear: () => set({ token: null, tenantId: null }),
    }),
    { name: 'auth-storage' }
  )
)
