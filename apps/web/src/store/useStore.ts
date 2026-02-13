import { create } from 'zustand'

interface StoreState {
  // Store state buraya eklenecek
}

export const useStore = create<StoreState>()((set) => ({
  // Store implementation buraya eklenecek
}))

