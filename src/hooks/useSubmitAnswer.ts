import { useMutation, useQueryClient } from '@tanstack/react-query'
import { recordAttempt } from '@/lib/db/progress'
import { db } from '@/lib/db'
import { calculateScore } from '@/lib/gamification/scoring'
import { checkAndAwardBadges } from '@/lib/gamification/badges'
import { updateLearningRecord } from '@/lib/db/spaced-repetition'
import { useProgressStore } from '@/stores/progress-store'
import type { Confidence, Difficulty } from '@/lib/db/types'
import type { QuestionMode } from '@/stores/ui-store'

interface SubmitAnswerParams {
  questionId: string
  categorySlug: string
  answer: string
  timeSpent: number
  hintsUsed: number
  isCorrect: boolean
  difficulty: Difficulty
  currentStreak: number
  confidence?: Confidence
  mode?: QuestionMode
}

interface SubmitAnswerResult {
  success: boolean
  isCorrect: boolean
  scoreEarned: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  newBadges: Array<{
    slug: string
    nameEn: string
    nameEs: string
    icon: string
    tier: string
  }>
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient()
  const syncFromDb = useProgressStore(state => state.syncFromDb)

  return useMutation({
    mutationFn: async (params: SubmitAnswerParams): Promise<SubmitAnswerResult> => {
      const { questionId, categorySlug, answer, timeSpent, hintsUsed, isCorrect, difficulty, currentStreak, confidence, mode } = params

      const category = await db.categories.where('slug').equals(categorySlug).first()
      if (!category) {
        throw new Error('Category not found')
      }

      const scoringResult = calculateScore({
        difficulty,
        timeSpent,
        hintsUsed,
        isCorrect,
        currentStreak,
      })

      await recordAttempt({
        questionId,
        categoryId: category.id,
        answer,
        isCorrect,
        timeSpent,
        hintsUsed,
        scoreEarned: scoringResult.totalPoints,
        confidence,
      })

      if (mode === 'practice' || mode === 'review') {
        const confidenceToUse = confidence ?? 'uncertain'
        await updateLearningRecord(questionId, isCorrect, confidenceToUse)
      }

      const newBadges = await checkAndAwardBadges()

      return {
        success: true,
        isCorrect,
        scoreEarned: scoringResult.totalPoints,
        grade: scoringResult.grade,
        newBadges,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['badges'] })
      queryClient.invalidateQueries({ queryKey: ['learning-stats'] })
      syncFromDb()
    },
    onError: (error) => {
      console.error('Error submitting answer:', error)
    },
  })
}
