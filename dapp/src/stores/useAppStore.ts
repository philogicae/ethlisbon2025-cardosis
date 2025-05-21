import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AppState = {
  sessionId: string | null
  isAuthenticated: boolean
  
  // UI state
  isDarkMode: boolean
  
  // Actions
  setSessionId: (sessionId: string | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  toggleDarkMode: () => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sessionId: null,
      isAuthenticated: false,

      // UI state
      isDarkMode: false,
      
      // Actions
      setSessionId: (sessionId) => set({ sessionId }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      reset: () => set({
        sessionId: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'cardosis-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)
