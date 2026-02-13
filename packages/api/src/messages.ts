import { apiClient } from './client'
import type { Message, CreateMessageDto } from '@talepo/database'

export const messagesApi = {
  async getByRequestId(requestId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/messages?requestId=${requestId}`)
    return response.data || []
  },

  async create(data: CreateMessageDto): Promise<Message> {
    const response = await apiClient.post<Message>('/messages', data)
    return response.data!
  },
}

