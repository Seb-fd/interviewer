import { mockQuestions, getQuestionsBySlug as getMockBySlug, type Question } from '@/data/questions'

export type { Question }

export async function getQuestions(categorySlug?: string, difficulty?: string): Promise<Question[]> {
  console.log('[DEBUG queries/getQuestions] categorySlug:', categorySlug, 'mockQuestions length:', mockQuestions.length)
  if (categorySlug) {
    const result = getMockBySlug(categorySlug).filter(q => !difficulty || q.difficulty === difficulty)
    console.log('[DEBUG queries/getQuestions] filtered result:', result)
    return result
  }
  return mockQuestions
}

export async function getQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  console.log('[DEBUG queries/getQuestionsByCategorySlug] categorySlug:', categorySlug)
  console.log('[DEBUG queries/getQuestionsByCategorySlug] mockQuestions:', mockQuestions)
  const result = getMockBySlug(categorySlug)
  console.log('[DEBUG queries/getQuestionsByCategorySlug] result:', result)
  return result
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  console.log('[DEBUG queries/getQuestionById] questionId:', questionId)
  const result = mockQuestions.find(q => q.id === questionId) || null
  console.log('[DEBUG queries/getQuestionById] result:', result)
  return result
}
