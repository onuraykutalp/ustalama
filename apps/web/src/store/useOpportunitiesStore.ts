import { create } from 'zustand'
import { opportunitiesApi } from '@talepo/api'
import type { Request, RequestStatus } from '@talepo/database'

interface OpportunitiesState {
  opportunities: Request[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchOpportunities: (params?: { categoryId?: string; status?: RequestStatus }) => Promise<void>
  clearError: () => void
}

export const useOpportunitiesStore = create<OpportunitiesState>()((set) => ({
  opportunities: [],
  loading: false,
  error: null,
  
  fetchOpportunities: async (params) => {
    set({ loading: true, error: null })
    try {
      const opportunities = await opportunitiesApi.getAll(params)
      set({ opportunities, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Fırsatlar yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

