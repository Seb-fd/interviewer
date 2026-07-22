import { useQuery } from '@tanstack/react-query'
import { getQuestions as fetchQuestions, getQuestionsByCategorySlug, getQuestionById, getQuestionsWithProgress, type Question, type Difficulty, type QuestionWithProgress } from '@/lib/queries/questions'

export type { Question, Difficulty, QuestionWithProgress }

export function useQuestions(categorySlug?: string, difficulty?: string | null) {
  return useQuery({
    queryKey: ['questions', categorySlug, difficulty],
    queryFn: async () => {
      try {
        if (categorySlug) {
          const questions = await getQuestionsByCategorySlug(categorySlug)
          if (difficulty) {
            return questions.filter(q => q.difficulty === difficulty)
          }
          return questions
        }
        return fetchQuestions()
      } catch (error) {
        console.error('Error fetching questions:', error)
        throw new Error('Failed to fetch questions')
      }
    },
    staleTime: Infinity,
  })
}

export function useQuestionsWithProgress(categorySlug?: string, difficulty?: string | null) {
  return useQuery({
    queryKey: ['questionsWithProgress', categorySlug, difficulty],
    queryFn: async () => {
      try {
        return await getQuestionsWithProgress(categorySlug, difficulty || undefined)
      } catch (error) {
        console.error('Error fetching questions with progress:', error)
        throw new Error('Failed to fetch questions')
      }
    },
    staleTime: Infinity,
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
    staleTime: Infinity,
  })
}
