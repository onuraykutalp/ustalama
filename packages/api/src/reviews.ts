import { apiClient } from './client'
import type { Review, CreateReviewDto, UpdateReviewDto } from '@talepo/database'

export interface GetReviewsParams {
  providerId?: string
  requestId?: string
}

export const reviewsApi = {
  async getAll(params?: GetReviewsParams): Promise<Review[]> {
    const queryParams = new URLSearchParams()
    if (params?.providerId) queryParams.append('providerId', params.providerId)
    if (params?.requestId) queryParams.append('requestId', params.requestId)
    
    const query = queryParams.toString()
    const response = await apiClient.get<Review[]>(`/reviews${query ? `?${query}` : ''}`)
    return response.data || []
  },

  async create(data: CreateReviewDto): Promise<Review> {
    const response = await apiClient.post<Review>('/reviews', data)
    return response.data!
  },

  async update(id: string, data: UpdateReviewDto): Promise<Review> {
    const response = await apiClient.patch<Review>(`/reviews/${id}`, data)
    return response.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/reviews/${id}`)
  },
}

