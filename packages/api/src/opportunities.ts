import { apiClient } from './client'
import type { Request, RequestStatus } from '@talepo/database'

export interface GetOpportunitiesParams {
  categoryId?: string
  status?: RequestStatus
}

export const opportunitiesApi = {
  async getAll(params?: GetOpportunitiesParams): Promise<Request[]> {
    const queryParams = new URLSearchParams()
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params?.status) queryParams.append('status', params.status)
    
    const query = queryParams.toString()
    const response = await apiClient.get<Request[]>(`/opportunities${query ? `?${query}` : ''}`)
    return response.data || []
  },
}

