import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuestionsByCategorySlug, getQuestionById, type Question } from '@/lib/queries/questions'
import { recordAttempt } from '@/lib/queries/progress'

export type { Question }

export function useQuestions(categorySlug?: string, difficulty?: string | null) {
  return useQuery({
    queryKey: ['questions', categorySlug, difficulty],
    queryFn: async () => {
      try {
        let questions: Question[] = []
        if (categorySlug) {
          questions = await getQuestionsByCategorySlug(categorySlug)
        }
        if (difficulty) {
          questions = questions.filter(q => q.difficulty === difficulty)
        }
        return questions
      } catch (error) {
        console.error('Error fetching questions:', error)
        throw new Error('Failed to fetch questions')
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useQuestion(questionId: string) {
  return useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      try {
        return await getQuestionById(questionId)
      } catch (error) {
        console.error('Error fetching question:', error)
        throw new Error('Failed to fetch question')
      }
    },
    enabled: !!questionId,
  })
}

interface SubmitAnswerParams {
  userId: string
  questionId: string
  categoryId: string
  answer: string
  timeSpent: number
  hintsUsed: number
  isCorrect: boolean
  points: number
}

interface SubmitAnswerResult {
  success: boolean
  isCorrect: boolean
  scoreEarned: number
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: SubmitAnswerParams): Promise<SubmitAnswerResult> => {
      const { userId, questionId, categoryId, isCorrect, points } = params

      await recordAttempt(userId, questionId, categoryId, isCorrect, points)

      return {
        success: true,
        isCorrect,
        scoreEarned: points,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
    onError: (error) => {
      console.error('Error submitting answer:', error)
    },
  })
}
