import { apiClient } from './client'
import type { ProviderProfile, UpdateProviderProfileDto } from '@talepo/database'

export interface GetProvidersParams {
  verified?: boolean
}

export const providersApi = {
  async getAll(params?: GetProvidersParams): Promise<ProviderProfile[]> {
    const queryParams = new URLSearchParams()
    if (params?.verified) queryParams.append('verified', 'true')
    
    const query = queryParams.toString()
    const response = await apiClient.get<ProviderProfile[]>(`/providers${query ? `?${query}` : ''}`)
    return response.data || []
  },

  async getById(id: string): Promise<ProviderProfile | null> {
    const response = await apiClient.get<ProviderProfile>(`/providers/${id}`)
    return response.data || null
  },

  async update(id: string, data: UpdateProviderProfileDto): Promise<ProviderProfile> {
    const response = await apiClient.patch<ProviderProfile>(`/providers/${id}`, data)
    return response.data!
  },
}

