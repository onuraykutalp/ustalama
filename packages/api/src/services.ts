import { apiClient } from './client'
import type { Service, CreateServiceDto, UpdateServiceDto } from '@talepo/database'

export interface GetServicesParams {
  providerId?: string
  categoryId?: string
  userId?: string
}

export const servicesApi = {
  async getAll(params?: GetServicesParams): Promise<Service[]> {
    const queryParams = new URLSearchParams()
    if (params?.providerId) queryParams.append('providerId', params.providerId)
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params?.userId) queryParams.append('userId', params.userId)
    
    const query = queryParams.toString()
    const response = await apiClient.get<Service[]>(`/services${query ? `?${query}` : ''}`)
    return response.data || []
  },

  async getById(id: string): Promise<Service | null> {
    const response = await apiClient.get<Service>(`/services/${id}`)
    return response.data || null
  },

  async create(data: CreateServiceDto): Promise<Service> {
    const response = await apiClient.post<Service>('/services', data)
    return response.data!
  },

  async update(id: string, data: UpdateServiceDto): Promise<Service> {
    const response = await apiClient.patch<Service>(`/services/${id}`, data)
    return response.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`)
  },
}

