import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { db } from '@/lib/db'
import { getAllProgress, resetAllProgress as resetDbProgress } from '@/lib/db/progress'
import { calculateStreak, recordActivity } from '@/lib/db/activity'
import { getRecentBadges } from '@/lib/db/badges'

interface CategoryProgress {
  questionsCompleted: string[]
  correctCount: number
  totalScore: number
  accuracy: number
  bestStreak: number
  avgTimeSpent: number
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
  isLoading: boolean
  isInitialized: boolean

  loadProgress: () => Promise<void>
  incrementQuestions: (correct: boolean) => void
  addScore: (points: number) => void
  updateStreak: (streak: number) => void
  setCategoryProgress: (categorySlug: string, progress: CategoryProgress) => void
  markQuestionCompleted: (categorySlug: string, questionId: string, correct: boolean, points: number) => void
  addBadge: (badgeSlug: string) => void
  resetProgress: () => Promise<void>
  syncFromDb: () => Promise<void>
}

export const useProgressStore = create<ProgressState>()(
  subscribeWithSelector((set, get) => ({
    totalScore: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    categoryProgress: {},
    recentBadges: [],
    isLoading: true,
    isInitialized: false,

    loadProgress: async () => {
      set({ isLoading: true })
      
      try {
        const progress = await getAllProgress()
        const streakInfo = await calculateStreak()
        const recentBadgeData = await getRecentBadges(3)
        
        const categories = await db.categories.toArray()
        const categorySlugMap = new Map<string, string>()
        for (const cat of categories) {
          categorySlugMap.set(cat.id, cat.slug)
        }
        
        const categoryProgress: Record<string, CategoryProgress> = {}
        for (const [catId, prog] of progress.categoryProgress) {
          const slug = categorySlugMap.get(catId)
          if (slug) {
            categoryProgress[slug] = {
              questionsCompleted: prog.completedQuestions,
              correctCount: prog.correctCount,
              totalScore: prog.totalScore,
              accuracy: prog.accuracy,
              bestStreak: prog.bestStreak,
              avgTimeSpent: prog.avgTimeSpent,
            }
          }
        }
        
        const recentBadges = recentBadgeData.map(b => b.slug)
        
        set({
          totalScore: progress.totalScore,
          totalQuestions: progress.totalQuestions,
          correctAnswers: progress.correctAnswers,
          currentStreak: streakInfo.currentStreak,
          longestStreak: streakInfo.longestStreak,
          lastActivityDate: streakInfo.lastActiveDate,
          categoryProgress,
          recentBadges,
          isLoading: false,
          isInitialized: true,
        })
      } catch (error) {
        console.error('Failed to load progress:', error)
        set({ isLoading: false, isInitialized: true })
      }
    },

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

    markQuestionCompleted: async (categorySlug, questionId, correct, points) => {
      const category = await db.categories.where('slug').equals(categorySlug).first()
      if (!category) return
      
      const existing = get().categoryProgress[categorySlug]
      if (existing?.questionsCompleted.includes(questionId)) return
      
      set((state) => {
        const current = state.categoryProgress[categorySlug] || {
          questionsCompleted: [],
          correctCount: 0,
          totalScore: 0,
          accuracy: 0,
          bestStreak: 0,
          avgTimeSpent: 0,
        }
        
        const newQuestionsCompleted = [...current.questionsCompleted, questionId]
        const newCorrectCount = current.correctCount + (correct ? 1 : 0)
        const newTotalQuestions = newQuestionsCompleted.length
        const newAccuracy = Math.round((newCorrectCount / newTotalQuestions) * 100)
        
        return {
          totalQuestions: state.totalQuestions + 1,
          correctAnswers: correct ? state.correctAnswers + 1 : state.correctAnswers,
          totalScore: state.totalScore + (correct ? points : 0),
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
      })
      
      await recordActivity({
        questionsAttempted: 1,
        questionsCorrect: correct ? 1 : 0,
        totalScore: correct ? points : 0,
      })
    },

    addBadge: (badgeSlug) => set((state) => ({
      recentBadges: [badgeSlug, ...state.recentBadges.filter(b => b !== badgeSlug)].slice(0, 3),
    })),

    resetProgress: async () => {
      await resetDbProgress()
      set({
        totalScore: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        categoryProgress: {},
        recentBadges: [],
      })
    },

    syncFromDb: async () => {
      await get().loadProgress()
    },
  }))
)

let dbSubscriber: (() => void) | null = null

export function initializeProgressStore(): () => void {
  if (dbSubscriber) {
    return dbSubscriber
  }
  
  dbSubscriber = () => {
    useProgressStore.getState().syncFromDb()
  }
  
  useProgressStore.getState().loadProgress()
  
  return dbSubscriber
}
