'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RequestStatus } from '@talepo/database'
import type { RequestWithRelations, MessageWithRelations } from '@talepo/database'
import { useAuthStore } from '@/store/useAuthStore'
import { useRequestsStore } from '@/store/useRequestsStore'
import { useMessagesStore } from '@/store/useMessagesStore'

export default function RequestDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { getRequestById, loading: requestLoading } = useRequestsStore()
  const { messages: messagesByRequest, fetchMessages, sendMessage, loading: messagesLoading } = useMessagesStore()
  const [request, setRequest] = useState<RequestWithRelations | null>(null)
  const [newMessage, setNewMessage] = useState('')

  // Fetch request data
  useEffect(() => {
    const loadRequest = async () => {
      const requestData = await getRequestById(id)
      if (requestData) {
        setRequest(requestData as RequestWithRelations)
      }
    }
    loadRequest()
  }, [id, getRequestById])

  // Fetch messages
  useEffect(() => {
    if (id) {
      fetchMessages(id)
    }
  }, [id, fetchMessages])

  if (requestLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Talep yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Talep bulunamadı</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    )
  }

  const messages = (messagesByRequest[id] || []) as MessageWithRelations[]
  const customer = request.customer
  const provider = request.provider

  // Determine current user ID (for message display)
  const currentUserId = user?.id || ''

  const statusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
    [RequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-700',
    [RequestStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700',
    [RequestStatus.COMPLETED]: 'bg-green-100 text-green-700',
    [RequestStatus.CANCELLED]: 'bg-red-100 text-red-700'
  }

  const statusLabels: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Beklemede',
    [RequestStatus.ACCEPTED]: 'Kabul Edildi',
    [RequestStatus.IN_PROGRESS]: 'Devam Ediyor',
    [RequestStatus.COMPLETED]: 'Tamamlandı',
    [RequestStatus.CANCELLED]: 'İptal Edildi'
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      const result = await sendMessage({
        requestId: id,
        content: newMessage.trim(),
      })
      if (result) {
        setNewMessage('')
      } else {
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
      }
    } catch (error: any) {
      const errorMsg = error?.error || error?.message || 'Mesaj gönderilirken bir hata oluştu'
      alert(`Mesaj gönderilemedi: ${errorMsg}`)
    }
  }

  const formatTime = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Şimdi'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} sa önce`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`
    return dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Request Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Talep Detayları</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Başlık</label>
                  <p className="mt-1 text-gray-900 font-semibold">{request.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Açıklama</label>
                  <p className="mt-1 text-gray-900">{request.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Durum</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[request.status] || request.status}
                    </span>
                  </div>
                </div>

                {request.budget && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bütçe</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {request.budget.toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                )}

                {request.location && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Konum</label>
                    <p className="mt-1 text-gray-900">{request.location}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Oluşturulma Tarihi</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {customer && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Müşteri</label>
                    <p className="mt-1 text-gray-900">{customer.name || customer.email}</p>
                  </div>
                )}

                {provider && provider.user && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Hizmet Sağlayıcı</label>
                    <p className="mt-1 text-gray-900">{provider.user.name || provider.user.email || 'Bilinmiyor'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-xl font-bold text-gray-900">Mesajlar</h2>
                <p className="text-sm text-gray-600 mt-1">{request.title}</p>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-gray-600">Mesajlar yükleniyor...</p>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message: MessageWithRelations, index) => {
                    const isMyMessage = message.senderId === currentUserId
                    const prevMessage = index > 0 ? messages[index - 1] : null
                    const showAvatar = !prevMessage ||
                      prevMessage.senderId !== message.senderId ||
                      (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 5 * 60 * 1000

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}
                      >
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
                          <span className="text-xs text-gray-500 mt-1">{formatTime(message.createdAt)}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

