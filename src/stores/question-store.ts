import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface QuestionState {
  currentQuestionId: string | null
  currentSlug: string | null
  isTimerRunning: boolean
  timeSpent: number
  hintsRevealed: number
  userAnswer: string
  isSubmitting: boolean
  isSubmitted: boolean
  showSolution: boolean

  setCurrentQuestion: (id: string | null, slug: string | null) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  tickTimer: () => void
  revealHint: () => void
  resetHints: () => void
  setUserAnswer: (answer: string) => void
  setIsSubmitting: (submitting: boolean) => void
  setIsSubmitted: (submitted: boolean) => void
  setShowSolution: (show: boolean) => void
  resetQuestion: () => void
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      currentQuestionId: null,
      currentSlug: null,
      isTimerRunning: false,
      timeSpent: 0,
      hintsRevealed: 0,
      userAnswer: '',
      isSubmitting: false,
      isSubmitted: false,
      showSolution: false,

      setCurrentQuestion: (id, slug) => {
        set({
          currentQuestionId: id,
          currentSlug: slug,
          isTimerRunning: false,
          timeSpent: 0,
          hintsRevealed: 0,
          userAnswer: '',
          isSubmitting: false,
          isSubmitted: false,
          showSolution: false,
        })
      },

      startTimer: () => set({ isTimerRunning: true }),
      pauseTimer: () => set({ isTimerRunning: false }),
      resetTimer: () => set({ isTimerRunning: false, timeSpent: 0 }),

      tickTimer: () => set((state) => ({ timeSpent: state.timeSpent + 1 })),

      revealHint: () => set((state) => ({ hintsRevealed: state.hintsRevealed + 1 })),
      resetHints: () => set({ hintsRevealed: 0 }),

      setUserAnswer: (answer) => set({ userAnswer: answer }),
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
      setIsSubmitted: (submitted) => set({ isSubmitted: submitted }),
      setShowSolution: (show) => set({ showSolution: show }),

      resetQuestion: () => set({
        isTimerRunning: false,
        timeSpent: 0,
        hintsRevealed: 0,
        userAnswer: '',
        isSubmitting: false,
        isSubmitted: false,
        showSolution: false,
      }),
    }),
    {
      name: 'question-storage',
      partialize: (state) => ({
        currentQuestionId: state.currentQuestionId,
        currentSlug: state.currentSlug,
      }),
    }
  )
)
