"use client";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AppState = {
  sessionId: string | null
  address: string | null
  chainId: number | null
  isAuthenticated: boolean
  isCreated: boolean  
  // UI state
  isDarkMode: boolean
  
  // Actions
  setSessionId: (sessionId: string | null) => void
  setAddress: (address: string | null) => void
  setChainId: (chainId: number | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setIsCreated: (isCreated: boolean) => void
  toggleDarkMode: () => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sessionId: null,
      address: null,
      chainId: null,
      isAuthenticated: false,
      isCreated: false,

      // UI state
      isDarkMode: false,
      
      // Actions
      setSessionId: (sessionId) => set({ sessionId }),
      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setIsCreated: (isCreated) => set({ isCreated }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      reset: () => set({
        sessionId: null,
        address: null,
        chainId: null,
        isAuthenticated: false,
        isCreated: false,
      }),
    }),
    {
      name: 'cardosis-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
        isCreated: state.isCreated,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)
