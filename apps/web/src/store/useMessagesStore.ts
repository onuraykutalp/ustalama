import { create } from 'zustand'
import { messagesApi } from '@talepo/api'
import type { Message, MessageWithRelations, CreateMessageDto } from '@talepo/database'

interface MessagesState {
  messages: Record<string, MessageWithRelations[]> // requestId -> messages
  loading: boolean
  error: string | null

  // Actions
  fetchMessages: (requestId: string) => Promise<void>
  sendMessage: (data: CreateMessageDto) => Promise<MessageWithRelations | null>
  clearError: () => void
}

export const useMessagesStore = create<MessagesState>()((set, get) => ({
  messages: {},
  loading: false,
  error: null,

  fetchMessages: async (requestId: string) => {
    set({ loading: true, error: null })
    try {
      const messages = await messagesApi.getByRequestId(requestId)
      // API'den gelen mesajlar MessageWithRelations formatinda (sender bilgisi ile)
      set((state) => ({
        messages: {
          ...state.messages,
          [requestId]: messages as MessageWithRelations[]
        },
        loading: false
      }))
    } catch (error: any) {
      set({
        error: error.error || 'Mesajlar yüklenirken bir hata oluştu',
        loading: false
      })
    }
  },

  sendMessage: async (data) => {
    set({ loading: true, error: null })
    try {
      const message = await messagesApi.create(data)
      // API'den gelen mesaj MessageWithRelations formatinda (sender bilgisi ile)
      set((state) => ({
        messages: {
          ...state.messages,
          [data.requestId]: [
            ...(state.messages[data.requestId] || []),
            message as MessageWithRelations
          ]
        },
        loading: false
      }))
      return message as MessageWithRelations
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || 'Mesaj gönderilirken bir hata oluştu'
      set({
        error: errorMessage,
        loading: false
      })
      throw error // Re-throw to allow component to handle
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

