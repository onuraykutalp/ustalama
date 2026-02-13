import { create } from 'zustand'
import { apiClient } from '@talepo/api'

interface AdminStats {
  users: {
    total: number
    providers: number
    customers: number
    admins: number
  }
  requests: {
    total: number
    pending: number
    active: number
    completed: number
    cancelled: number
  }
  services: {
    total: number
  }
  categories: {
    total: number
  }
  reviews: {
    total: number
  }
  messages: {
    total: number
  }
}

interface AdminState {
  stats: AdminStats | null
  loading: boolean
  error: string | null
  
  fetchStats: () => Promise<void>
  clearError: () => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  stats: null,
  loading: false,
  error: null,
  
  fetchStats: async () => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.get<{ data: AdminStats }>('/admin/stats')
      set({ stats: response.data?.data || null, loading: false })
    } catch (error: any) {
      console.error('Admin stats fetch error:', error)
      set({ 
        error: error.error || error.message || 'İstatistikler yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

