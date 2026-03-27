import { apiClient } from './client'
import type { Message, MessageWithRelations, CreateMessageDto } from '@talepo/database'

export const messagesApi = {
  async getByRequestId(requestId: string): Promise<MessageWithRelations[]> {
    const response = await apiClient.get<MessageWithRelations[]>(`/messages?requestId=${requestId}`)
    return response.data || []
  },

  async create(data: CreateMessageDto): Promise<MessageWithRelations> {
    const response = await apiClient.post<MessageWithRelations>('/messages', data)
    return response.data!
  },
}

