import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveUserProgress, saveCategoryProgress, getAllCategoryProgress, type CategoryProgress as DBCategoryProgress } from '@/lib/queries/progress'

export interface CategoryProgress {
  questionsCompleted: string[]
  correctCount: number
  totalScore: number
  accuracy: number
  bestStreak: number
  avgTimeSpent: number
}

export interface UserProgress {
  totalPoints: number
  streakDays: number
  lastActivityDate: string | null
  longestStreak: number
  totalQuestionsAnswered: number
  categoriesProgress: Record<string, CategoryProgress>
}

interface ProgressState {
  totalScore: number
  totalQuestions: number
  correctAnswers: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  categoryProgress: Record<string, CategoryProgress>
  recentBadges: string[]

  addScore: (points: number) => void
  incrementQuestions: (correct: boolean) => void
  updateStreak: (streak: number) => void
  setCategoryProgress: (categorySlug: string, progress: CategoryProgress) => void
  markQuestionCompleted: (categorySlug: string, questionId: string, correct: boolean, points: number) => void
  addBadge: (badgeSlug: string) => void
  resetProgress: () => void
  syncToSupabase: (userId: string) => Promise<void>
  loadFromSupabase: (userId: string) => Promise<void>
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      totalScore: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      categoryProgress: {},
      recentBadges: [],

      addScore: (points) => set((state) => ({
        totalScore: state.totalScore + points,
      })),

      incrementQuestions: (correct) => set((state) => ({
        totalQuestions: state.totalQuestions + 1,
        correctAnswers: correct ? state.correctAnswers + 1 : state.correctAnswers,
      })),

      updateStreak: (streak) => set((state) => ({
        currentStreak: streak,
        longestStreak: Math.max(state.longestStreak, streak),
      })),

      setCategoryProgress: (categorySlug, progress) => set((state) => ({
        categoryProgress: {
          ...state.categoryProgress,
          [categorySlug]: progress,
        },
      })),

      markQuestionCompleted: (categorySlug, questionId, correct, points) => set((state) => {
        const current = state.categoryProgress[categorySlug] || {
          questionsCompleted: [],
          correctCount: 0,
          totalScore: 0,
          accuracy: 0,
          bestStreak: 0,
          avgTimeSpent: 0,
        }

        if (current.questionsCompleted.includes(questionId)) {
          return state
        }

        const newQuestionsCompleted = [...current.questionsCompleted, questionId]
        const newCorrectCount = current.correctCount + (correct ? 1 : 0)
        const newTotalQuestions = newQuestionsCompleted.length
        const newAccuracy = Math.round((newCorrectCount / newTotalQuestions) * 100)

        return {
          categoryProgress: {
            ...state.categoryProgress,
            [categorySlug]: {
              ...current,
              questionsCompleted: newQuestionsCompleted,
              correctCount: newCorrectCount,
              totalScore: current.totalScore + (correct ? points : 0),
              accuracy: newAccuracy,
            },
          },
        }
      }),

      addBadge: (badgeSlug) => set((state) => ({
        recentBadges: [badgeSlug, ...state.recentBadges.filter(b => b !== badgeSlug)].slice(0, 3),
      })),

      resetProgress: () => set({
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        categoryProgress: {},
        recentBadges: [],
      }),

      syncToSupabase: async (userId: string) => {
        const state = get()
        try {
          await saveUserProgress(userId, {
            totalPoints: state.totalScore,
            streakDays: state.currentStreak,
            lastActivityDate: state.lastActivityDate,
            longestStreak: state.longestStreak,
            totalQuestionsAnswered: state.totalQuestions,
          })

          for (const [categoryId, progress] of Object.entries(state.categoryProgress)) {
            const dbProgress: Partial<DBCategoryProgress> = {
              completedQuestions: progress.questionsCompleted,
              correctCount: progress.correctCount,
              incorrectCount: progress.questionsCompleted.length - progress.correctCount,
              totalPoints: progress.totalScore,
            }
            await saveCategoryProgress(userId, categoryId, dbProgress)
          }
        } catch (error) {
          console.error('Error syncing progress to Supabase:', error)
        }
      },

      loadFromSupabase: async (userId: string) => {
        try {
          const allProgress = await getAllCategoryProgress(userId)
          const categoriesProgress: Record<string, CategoryProgress> = {}

          for (const [categoryId, progress] of Object.entries(allProgress)) {
            categoriesProgress[categoryId] = {
              questionsCompleted: progress.completedQuestions,
              correctCount: progress.correctCount,
              totalScore: progress.totalPoints,
              accuracy: progress.completedQuestions.length > 0
                ? Math.round((progress.correctCount / progress.completedQuestions.length) * 100)
                : 0,
              bestStreak: 0,
              avgTimeSpent: 0,
            }
          }

          set((state) => ({
            categoryProgress: {
              ...state.categoryProgress,
              ...categoriesProgress,
            },
          }))
        } catch (error) {
          console.error('Error loading progress from Supabase:', error)
        }
      },
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        totalScore: state.totalScore,
        totalQuestions: state.totalQuestions,
        correctAnswers: state.correctAnswers,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActivityDate: state.lastActivityDate,
        categoryProgress: state.categoryProgress,
        recentBadges: state.recentBadges,
      }),
    }
  )
)
