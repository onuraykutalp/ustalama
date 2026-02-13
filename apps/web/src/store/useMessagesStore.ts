import { create } from 'zustand'
import { messagesApi } from '@talepo/api'
import type { Message, CreateMessageDto } from '@talepo/database'

interface MessagesState {
  messages: Record<string, Message[]> // requestId -> messages
  loading: boolean
  error: string | null
  
  // Actions
  fetchMessages: (requestId: string) => Promise<void>
  sendMessage: (data: CreateMessageDto) => Promise<Message | null>
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
      set((state) => ({
        messages: {
          ...state.messages,
          [requestId]: messages
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
      set((state) => ({
        messages: {
          ...state.messages,
          [data.requestId]: [
            ...(state.messages[data.requestId] || []),
            message
          ]
        },
        loading: false
      }))
      return message
    } catch (error: any) {
      set({ 
        error: error.error || 'Mesaj gönderilirken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

