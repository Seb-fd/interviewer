import { useQuery } from '@tanstack/react-query'
import { getLearningStats, getWeakAreas, getReviewQueue, getMasteryByCategory, type CategoryMastery } from '@/lib/db/spaced-repetition'

export interface LearningStats {
  totalLearned: number
  dueToday: number
  averageStability: number
  averageDifficulty: number
  masteryDistribution: {
    mastered: number
    reviewing: number
    learning: number
    new: number
  }
}

export interface WeakArea {
  categoryId: string
  categoryName: string
  dueCount: number
  averageDifficulty: number
}

export function useLearningStats() {
  return useQuery<LearningStats>({
    queryKey: ['learning-stats'],
    queryFn: getLearningStats,
    staleTime: 1000 * 60,
  })
}

export function useWeakAreas(limit: number = 5) {
  return useQuery<WeakArea[]>({
    queryKey: ['weak-areas', limit],
    queryFn: () => getWeakAreas(limit),
    staleTime: 1000 * 60,
  })
}

export function useReviewQueue(reviewLimit: number = 10, newLimit: number = 5) {
  return useQuery<{ dueQuestions: string[]; newQuestions: string[] }>({
    queryKey: ['review-queue', reviewLimit, newLimit],
    queryFn: () => getReviewQueue(reviewLimit, newLimit),
    staleTime: 1000 * 60,
  })
}

export function useMasteryByCategory() {
  return useQuery<Record<string, CategoryMastery>>({
    queryKey: ['mastery-by-category'],
    queryFn: getMasteryByCategory,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: true,
    retry: 3,
  })
}
