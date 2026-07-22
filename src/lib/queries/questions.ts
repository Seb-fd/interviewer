import { db, LOCAL_USER_ID } from '@/lib/db'
import type { Question, Difficulty } from '@/lib/db/types'

export type { Question, Difficulty }

export interface QuestionWithProgress extends Question {
  completed: boolean
  correct: boolean
}

export async function getQuestions(categorySlug?: string, difficulty?: string): Promise<Question[]> {
  if (categorySlug) {
    const category = await db.categories.where('slug').equals(categorySlug).first()
    if (!category) return []
    
    let questions = await db.questions.where('categoryId').equals(category.id).toArray()
    
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty)
    }
    
    return questions
  }
  
  return db.questions.toArray()
}

export async function getQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  const category = await db.categories.where('slug').equals(categorySlug).first()
  if (!category) return []
  return db.questions.where('categoryId').equals(category.id).toArray()
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  const question = await db.questions.get(questionId)
  return question || null
}

export async function getQuestionsByDifficulty(difficulty: Difficulty): Promise<Question[]> {
  return db.questions.where('difficulty').equals(difficulty).toArray()
}

export async function getQuestionsWithProgress(categorySlug?: string, difficulty?: string): Promise<QuestionWithProgress[]> {
  const questions = await getQuestions(categorySlug, difficulty)
  
  const attempts = await db.attempts
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()
  
  const correctAttempts = new Set<string>()
  const attemptedQuestions = new Set<string>()
  
  for (const attempt of attempts) {
    attemptedQuestions.add(attempt.questionId)
    if (attempt.isCorrect) {
      correctAttempts.add(attempt.questionId)
    }
  }
  
  return questions.map(q => ({
    ...q,
    completed: attemptedQuestions.has(q.id),
    correct: correctAttempts.has(q.id),
  }))
}

export async function getRandomQuestion(
  categorySlug?: string,
  difficulty?: Difficulty,
  excludeIds?: string[]
): Promise<Question | null> {
  let questions: Question[]
  
  if (categorySlug) {
    const category = await db.categories.where('slug').equals(categorySlug).first()
    if (!category) return null
    questions = await db.questions.where('categoryId').equals(category.id).toArray()
  } else {
    questions = await db.questions.toArray()
  }
  
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty)
  }
  
  if (excludeIds && excludeIds.length > 0) {
    questions = questions.filter(q => !excludeIds.includes(q.id))
  }
  
  if (questions.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * questions.length)
  return questions[randomIndex]
}
