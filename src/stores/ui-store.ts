import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type SupportedLanguage } from '@/i18n/config'
import i18n from '@/i18n'

type Theme = 'light' | 'dark' | 'system'
type QuestionMode = 'study' | 'exam'

interface UIState {
  theme: Theme
  language: SupportedLanguage
  questionMode: QuestionMode
  sidebarOpen: boolean
  setTheme: (theme: Theme) => void
  setLanguage: (language: SupportedLanguage) => void
  setQuestionMode: (mode: QuestionMode) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      questionMode: 'study',
      sidebarOpen: false,

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      setLanguage: (language) => {
        set({ language })
        i18n.changeLanguage(language)
      },

      setQuestionMode: (questionMode) => {
        set({ questionMode })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        questionMode: state.questionMode,
      }),
    }
  )
)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}
