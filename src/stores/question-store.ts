import { create } from 'zustand'
import type { Confidence } from '@/lib/db/types'

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
  selectedConfidence: Confidence | null

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
  setSelectedConfidence: (confidence: Confidence | null) => void
  resetQuestion: () => void
}

export const useQuestionStore = create<QuestionState>()((set) => ({
  currentQuestionId: null,
  currentSlug: null,
  isTimerRunning: false,
  timeSpent: 0,
  hintsRevealed: 0,
  userAnswer: '',
  isSubmitting: false,
  isSubmitted: false,
  showSolution: false,
  selectedConfidence: null,

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
      selectedConfidence: null,
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
  setSelectedConfidence: (confidence) => set({ selectedConfidence: confidence }),

  resetQuestion: () => set({
    isTimerRunning: false,
    timeSpent: 0,
    hintsRevealed: 0,
    userAnswer: '',
    isSubmitting: false,
    isSubmitted: false,
    showSolution: false,
    selectedConfidence: null,
  }),
}))
