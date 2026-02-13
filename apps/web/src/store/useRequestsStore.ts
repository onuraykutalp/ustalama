import { create } from 'zustand'
import { requestsApi } from '@talepo/api'
import type { Request, CreateRequestDto, UpdateRequestDto, RequestStatus } from '@talepo/database'

interface RequestsState {
  requests: Request[]
  selectedRequest: Request | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchRequests: (params?: { customerId?: string; providerId?: string; status?: RequestStatus; opportunities?: boolean }) => Promise<void>
  getRequestById: (id: string) => Promise<Request | null>
  createRequest: (data: CreateRequestDto) => Promise<Request | null>
  updateRequest: (id: string, data: UpdateRequestDto) => Promise<void>
  deleteRequest: (id: string) => Promise<void>
  setSelectedRequest: (request: Request | null) => void
  clearError: () => void
}

export const useRequestsStore = create<RequestsState>()((set, get) => ({
  requests: [],
  selectedRequest: null,
  loading: false,
  error: null,
  
  fetchRequests: async (params) => {
    set({ loading: true, error: null })
    try {
      const requests = await requestsApi.getAll(params)
      set({ requests, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Talepler yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  getRequestById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const request = await requestsApi.getById(id)
      set({ selectedRequest: request, loading: false })
      return request
    } catch (error: any) {
      set({ 
        error: error.error || 'Talep yüklenirken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  createRequest: async (data) => {
    set({ loading: true, error: null })
    try {
      const request = await requestsApi.create(data)
      set((state) => ({
        requests: [request, ...state.requests],
        loading: false
      }))
      return request
    } catch (error: any) {
      set({ 
        error: error.error || 'Talep oluşturulurken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  updateRequest: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updatedRequest = await requestsApi.update(id, data)
      set((state) => ({
        requests: state.requests.map(r => r.id === id ? updatedRequest : r),
        selectedRequest: state.selectedRequest?.id === id ? updatedRequest : state.selectedRequest,
        loading: false
      }))
      return updatedRequest
    } catch (error: any) {
      set({ 
        error: error.error || 'Talep güncellenirken bir hata oluştu',
        loading: false 
      })
      throw error
    }
  },
  
  deleteRequest: async (id) => {
    set({ loading: true, error: null })
    try {
      await requestsApi.delete(id)
      set((state) => ({
        requests: state.requests.filter(r => r.id !== id),
        selectedRequest: state.selectedRequest?.id === id ? null : state.selectedRequest,
        loading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.error || 'Talep silinirken bir hata oluştu',
        loading: false 
      })
      throw error
    }
  },
  
  setSelectedRequest: (request) => {
    set({ selectedRequest: request })
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

