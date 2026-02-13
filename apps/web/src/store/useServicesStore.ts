import { create } from 'zustand'
import { servicesApi } from '@talepo/api'
import type { Service, CreateServiceDto, UpdateServiceDto } from '@talepo/database'

interface ServicesState {
  services: Service[]
  selectedService: Service | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchServices: (params?: { providerId?: string; categoryId?: string; userId?: string }) => Promise<void>
  getServiceById: (id: string) => Promise<Service | null>
  createService: (data: CreateServiceDto) => Promise<Service | null>
  updateService: (id: string, data: UpdateServiceDto) => Promise<void>
  deleteService: (id: string) => Promise<void>
  setSelectedService: (service: Service | null) => void
  clearError: () => void
}

export const useServicesStore = create<ServicesState>()((set, get) => ({
  services: [],
  selectedService: null,
  loading: false,
  error: null,
  
  fetchServices: async (params) => {
    set({ loading: true, error: null })
    try {
      const services = await servicesApi.getAll(params)
      set({ services, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmetler yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  getServiceById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const service = await servicesApi.getById(id)
      set({ selectedService: service, loading: false })
      return service
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet yüklenirken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  createService: async (data) => {
    set({ loading: true, error: null })
    try {
      const service = await servicesApi.create(data)
      set((state) => ({
        services: [service, ...state.services],
        loading: false
      }))
      return service
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet oluşturulurken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  updateService: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updatedService = await servicesApi.update(id, data)
      set((state) => ({
        services: state.services.map(s => s.id === id ? updatedService : s),
        selectedService: state.selectedService?.id === id ? updatedService : state.selectedService,
        loading: false
      }))
      return updatedService
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet güncellenirken bir hata oluştu',
        loading: false 
      })
      throw error
    }
  },
  
  deleteService: async (id) => {
    set({ loading: true, error: null })
    try {
      await servicesApi.delete(id)
      set((state) => ({
        services: state.services.filter(s => s.id !== id),
        selectedService: state.selectedService?.id === id ? null : state.selectedService,
        loading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet silinirken bir hata oluştu',
        loading: false 
      })
      throw error
    }
  },
  
  setSelectedService: (service) => {
    set({ selectedService: service })
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

