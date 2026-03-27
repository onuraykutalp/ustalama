import { create } from 'zustand'

interface SavedCard {
  id: string
  cardAlias: string | null
  cardLast4: string
  cardBrand: string
  cardBankName: string | null
  isDefault: boolean
  createdAt: string
}

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PREMIUM' | 'REFUND'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string | null
  createdAt: string
}

interface PaymentState {
  cards: SavedCard[]
  transactions: Transaction[]
  balance: number
  isPremium: boolean
  loading: boolean
  error: string | null

  fetchCards: (token: string) => Promise<void>
  addCard: (token: string, data: any) => Promise<void>
  deleteCard: (token: string, cardId: string) => Promise<void>
  setDefaultCard: (token: string, cardId: string) => Promise<void>
  fetchBalance: (token: string) => Promise<void>
  fetchTransactions: (token: string) => Promise<void>
  initializePayment: (token: string, data: any) => Promise<{ status: boolean; paymentID?: string; htmlContent?: string; error?: string }>
  payWithSavedCard: (token: string, data: any) => Promise<{ status: boolean; error?: string }>
  checkPaymentStatus: (token: string, paymentID: string) => Promise<any>
  clearError: () => void
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  cards: [],
  transactions: [],
  balance: 0,
  isPremium: false,
  loading: false,
  error: null,

  fetchCards: async (token) => {
    try {
      const res = await fetch('/api/cards', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) set({ cards: data.data })
    } catch (e) {
      console.error('fetchCards error:', e)
    }
  },

  addCard: async (token, cardData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cardData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kart eklenemedi')
      await get().fetchCards(token)
    } catch (e: any) {
      set({ error: e.message })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  deleteCard: async (token, cardId) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Kart silinemedi')
      }
      await get().fetchCards(token)
    } catch (e: any) {
      set({ error: e.message })
      throw e
    } finally {
      set({ loading: false })
    }
  },

  setDefaultCard: async (token, cardId) => {
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      await get().fetchCards(token)
    } catch (e) {
      console.error('setDefaultCard error:', e)
    }
  },

  fetchBalance: async (token) => {
    try {
      const res = await fetch('/api/balance', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        set({ balance: data.data.balance, isPremium: data.data.isPremium })
      }
    } catch (e) {
      console.error('fetchBalance error:', e)
    }
  },

  fetchTransactions: async (token) => {
    try {
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) set({ transactions: data.data })
    } catch (e) {
      console.error('fetchTransactions error:', e)
    }
  },

  initializePayment: async (token, paymentData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ödeme başlatılamadı')
      return { status: true, paymentID: data.paymentID, htmlContent: data.htmlContent }
    } catch (e: any) {
      set({ error: e.message })
      return { status: false, error: e.message }
    } finally {
      set({ loading: false })
    }
  },

  payWithSavedCard: async (token, paymentData) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/payments/saved-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ödeme başarısız')
      await get().fetchBalance(token)
      await get().fetchTransactions(token)
      return { status: true }
    } catch (e: any) {
      set({ error: e.message })
      return { status: false, error: e.message }
    } finally {
      set({ loading: false })
    }
  },

  checkPaymentStatus: async (token, paymentID) => {
    try {
      const res = await fetch('/api/payments/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentID }),
      })
      return await res.json()
    } catch (e) {
      console.error('checkPaymentStatus error:', e)
      return null
    }
  },

  clearError: () => set({ error: null }),
}))
