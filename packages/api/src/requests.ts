import { apiClient } from './client'
import type { Request, CreateRequestDto, UpdateRequestDto, RequestStatus } from '@talepo/database'

export interface GetRequestsParams {
  customerId?: string
  providerId?: string
  status?: RequestStatus
  opportunities?: boolean
}

export const requestsApi = {
  async getAll(params?: GetRequestsParams): Promise<Request[]> {
    const queryParams = new URLSearchParams()
    if (params?.customerId) queryParams.append('customerId', params.customerId)
    if (params?.providerId) queryParams.append('providerId', params.providerId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.opportunities) queryParams.append('opportunities', 'true')
    
    const query = queryParams.toString()
    const response = await apiClient.get<Request[]>(`/requests${query ? `?${query}` : ''}`)
    return response.data || []
  },

  async getById(id: string): Promise<Request | null> {
    const response = await apiClient.get<Request>(`/requests/${id}`)
    return response.data || null
  },

  async create(data: CreateRequestDto): Promise<Request> {
    const response = await apiClient.post<Request>('/requests', data)
    return response.data!
  },

  async update(id: string, data: UpdateRequestDto): Promise<Request> {
    const response = await apiClient.patch<Request>(`/requests/${id}`, data)
    return response.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/requests/${id}`)
  },
}

