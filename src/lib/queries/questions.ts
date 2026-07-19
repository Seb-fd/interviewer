import { mockQuestions, getQuestionsBySlug as getMockBySlug, type Question } from '@/data/questions'

export type { Question }

export async function getQuestions(categorySlug?: string, difficulty?: string): Promise<Question[]> {
  if (categorySlug) {
    return getMockBySlug(categorySlug).filter(q => !difficulty || q.difficulty === difficulty)
  }
  return mockQuestions
}

export async function getQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  return getMockBySlug(categorySlug)
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  return mockQuestions.find(q => q.id === questionId) || null
}
