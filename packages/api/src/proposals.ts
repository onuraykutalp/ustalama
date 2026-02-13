import { apiClient } from './client'
import type { Request, RequestStatus } from '@talepo/database'

export interface GetProposalsParams {
  status?: RequestStatus
}

export const proposalsApi = {
  async getAll(params?: GetProposalsParams): Promise<Request[]> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    
    const query = queryParams.toString()
    const response = await apiClient.get<Request[]>(`/proposals${query ? `?${query}` : ''}`)
    return response.data || []
  },

  async create(requestId: string): Promise<Request> {
    const response = await apiClient.post<Request>('/proposals', { requestId })
    return response.data!
  },
}

