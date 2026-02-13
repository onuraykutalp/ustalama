import { create } from 'zustand'
import { providersApi } from '@talepo/api'
import type { ProviderProfile } from '@talepo/database'

interface ProvidersState {
  providers: ProviderProfile[]
  featuredProviders: ProviderProfile[]
  selectedProvider: ProviderProfile | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchProviders: (params?: { verified?: boolean }) => Promise<void>
  fetchFeaturedProviders: () => Promise<void>
  getProviderById: (id: string) => Promise<ProviderProfile | null>
  clearError: () => void
}

export const useProvidersStore = create<ProvidersState>()((set, get) => ({
  providers: [],
  featuredProviders: [],
  selectedProvider: null,
  loading: false,
  error: null,
  
  fetchProviders: async (params) => {
    set({ loading: true, error: null })
    try {
      const providers = await providersApi.getAll(params)
      set({ providers, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet sağlayıcılar yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  fetchFeaturedProviders: async () => {
    set({ loading: true, error: null })
    try {
      // Verified ve yüksek rating'li provider'ları getir
      const providers = await providersApi.getAll({ verified: true })
      // Rating'e göre sırala ve ilk 4'ü al
      const featured = providers
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4)
      set({ featuredProviders: featured, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Öne çıkan hizmet sağlayıcılar yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  getProviderById: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const provider = await providersApi.getById(id)
      set({ selectedProvider: provider, loading: false })
      return provider
    } catch (error: any) {
      set({ 
        error: error.error || 'Hizmet sağlayıcı yüklenirken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

