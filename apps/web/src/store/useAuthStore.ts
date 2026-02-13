import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PublicUser } from '@talepo/database'
import { authApi } from '@talepo/api'
import type { LoginCredentials, RegisterData } from '@talepo/api'

// Token'ı API client'a set et (persist'ten sonra)
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth-storage')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.state?.token) {
        authApi.setToken(parsed.state.token)
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}

export type User = PublicUser

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  
  // API Actions
  loginUser: (credentials: LoginCredentials) => Promise<void>
  registerUser: (data: RegisterData) => Promise<void>
  fetchProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      login: (user, token) => {
        authApi.setToken(token)
        set({ user, token, isAuthenticated: true, error: null })
      },
      
      logout: () => {
        authApi.logout()
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },
      
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null
        }))
      },
      
      loginUser: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const response = await authApi.login(credentials)
          get().login(response.user, response.token)
        } catch (error: any) {
          const errorMessage = error.error || 'Giriş yapılırken bir hata oluştu'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      
      registerUser: async (data) => {
        set({ loading: true, error: null })
        try {
          const response = await authApi.register(data)
          get().login(response.user, response.token)
        } catch (error: any) {
          const errorMessage = error.error || 'Kayıt sırasında bir hata oluştu'
          set({ error: errorMessage })
          throw error
        } finally {
          set({ loading: false })
        }
      },
      
      fetchProfile: async () => {
        const { token } = get()
        if (!token) return
        
        set({ loading: true, error: null })
        try {
          // Profile API'yi kullanarak kullanıcı bilgilerini güncelle
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          
          if (!response.ok) {
            throw new Error('Profil bilgileri alınamadı')
          }
          
          const data = await response.json()
          set({ user: data.data, loading: false })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

