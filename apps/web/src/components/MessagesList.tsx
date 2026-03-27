'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useRequestsStore } from '@/store/useRequestsStore'
import { useMessagesStore } from '@/store/useMessagesStore'
import type { RequestWithRelations, MessageWithRelations } from '@talepo/database'

interface Conversation {
  id: string
  requestId: string
  requestTitle: string
  userId: string
  userName: string
  userAvatar: string | null
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
}

export default function MessagesList() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { requests, fetchRequests, loading: requestsLoading } = useRequestsStore()
  const { messages: messagesByRequest, fetchMessages, sendMessage, loading: messagesLoading } = useMessagesStore()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')

  // Fetch requests for the current user
  useEffect(() => {
    if (user?.id) {
      if (user.role === 'PROVIDER') {
        fetchRequests({ providerId: user.id })
      } else {
        fetchRequests({ customerId: user.id })
      }
    }
  }, [user, fetchRequests])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation, fetchMessages])

  // Convert requests to conversations
  const conversations: Conversation[] = requests
    .filter((request: RequestWithRelations) => {
      // Sadece providerId atanmış request'leri göster (teklif verilmiş)
      return request.providerId !== null
    })
    .map((request: RequestWithRelations) => {
      const otherUser = user?.role === 'PROVIDER'
        ? request.customer
        : request.provider?.user

      const requestMessages = request.messages || []
      const lastMessage = requestMessages.length > 0
        ? requestMessages[requestMessages.length - 1]
        : null

      return {
        id: request.id,
        requestId: request.id,
        requestTitle: request.title,
        userId: otherUser?.id || '',
        userName: otherUser?.name || otherUser?.email || 'Bilinmeyen Kullanıcı',
        userAvatar: otherUser?.avatar || null,
        lastMessage: lastMessage?.content || 'Henüz mesaj yok',
        lastMessageTime: lastMessage?.createdAt ? new Date(lastMessage.createdAt) : new Date(request.createdAt),
        unreadCount: 0,
        isOnline: false,
      }
    })
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get selected conversation
  const activeConversation = conversations.find(conv => conv.id === selectedConversation)

  // Get messages for selected conversation
  const conversationMessages = selectedConversation
    ? (messagesByRequest[selectedConversation] || []) as MessageWithRelations[]
    : []

  // Format time
  const formatTime = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Şimdi'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa önce`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`
    return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  // Format message time
  const formatMessageTime = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Şimdi'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`
    if (diffInSeconds < 86400) {
      return dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !user) return

    try {
      await sendMessage({
        requestId: selectedConversation,
        content: newMessage.trim(),
      })
      setNewMessage('')
    } catch (error) {
      // Error handled by store
    }
  }

  // Navigate to request detail page
  const handleViewRequest = (requestId: string) => {
    router.push(`/profil/talepler/${requestId}`)
  }

  if (requestsLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Mesajlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] max-h-[calc(100vh-200px)] flex flex-col lg:flex-row">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 border-r border-gray-200 flex flex-col ${
        selectedConversation ? 'hidden lg:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mesajlarım</h2>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Mesaj ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 hover:bg-gray-50 transition-all text-left ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conversation.userAvatar ? (
                        <img
                          src={conversation.userAvatar}
                          alt={conversation.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                          {conversation.userName[0]}
                        </div>
                      )}
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conversation.userName}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">{conversation.requestTitle}</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="flex-shrink-0 bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mesaj bulunamadı</h3>
              <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className={`w-full lg:w-2/3 flex flex-col ${
        selectedConversation ? 'flex' : 'hidden lg:flex'
      }`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Avatar */}
                <div className="relative">
                  {activeConversation.userAvatar ? (
                    <img
                      src={activeConversation.userAvatar}
                      alt={activeConversation.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {activeConversation.userName[0]}
                    </div>
                  )}
                  {activeConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{activeConversation.userName}</h3>
                  <p className="text-xs text-gray-500">{activeConversation.requestTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewRequest(activeConversation.requestId)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Talep Detayı
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-600">Mesajlar yükleniyor...</p>
                  </div>
                </div>
              ) : conversationMessages.length > 0 ? (
                conversationMessages.map((message: MessageWithRelations, index) => {
                  const isMyMessage = message.senderId === user?.id
                  const prevMessage = index > 0 ? conversationMessages[index - 1] : null
                  const showAvatar = !prevMessage ||
                    prevMessage.senderId !== message.senderId ||
                    (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 5 * 60 * 1000

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {!isMyMessage && (
                        <div className={`flex-shrink-0 ${showAvatar ? 'w-8 h-8' : 'w-8'}`}>
                          {showAvatar && message.sender ? (
                            message.sender.avatar ? (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender.name || ''}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                {(message.sender.name || message.sender.email || 'U')[0]}
                              </div>
                            )
                          ) : null}
                        </div>
                      )}

                      {/* Message */}
                      <div className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        {showAvatar && !isMyMessage && message.sender && (
                          <span className="text-xs text-gray-500 mb-1 px-2">
                            {message.sender.name || message.sender.email || 'Bilinmeyen'}
                          </span>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isMyMessage
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-xs text-gray-500">{formatMessageTime(message.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mesaj yok</h3>
                    <p className="text-gray-600">İlk mesajı siz gönderin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                    rows={1}
                    placeholder="Mesaj yazın..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim() || messagesLoading}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bir konuşma seçin</h3>
              <p className="text-gray-600">Mesajlaşmak için sol taraftan bir konuşma seçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
