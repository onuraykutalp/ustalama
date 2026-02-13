import { create } from 'zustand'
import { proposalsApi } from '@talepo/api'
import type { Request, RequestStatus } from '@talepo/database'

interface ProposalsState {
  proposals: Request[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchProposals: (params?: { status?: RequestStatus }) => Promise<void>
  createProposal: (requestId: string) => Promise<Request | null>
  clearError: () => void
}

export const useProposalsStore = create<ProposalsState>()((set) => ({
  proposals: [],
  loading: false,
  error: null,
  
  fetchProposals: async (params) => {
    set({ loading: true, error: null })
    try {
      const proposals = await proposalsApi.getAll(params)
      set({ proposals, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Teklifler yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  createProposal: async (requestId) => {
    set({ loading: true, error: null })
    try {
      const proposal = await proposalsApi.create(requestId)
      set((state) => ({
        proposals: [proposal, ...state.proposals],
        loading: false
      }))
      return proposal
    } catch (error: any) {
      set({ 
        error: error.error || 'Teklif oluşturulurken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

