import { db } from './index'
import type { Question, Difficulty, QuestionType } from './types'

export async function getAllQuestions(): Promise<Question[]> {
  return db.questions.toArray()
}

export async function getQuestionsByCategory(categoryId: string): Promise<Question[]> {
  return db.questions.where('categoryId').equals(categoryId).toArray()
}

export async function getQuestionsBySlug(slug: string): Promise<Question[]> {
  return db.questions.where('slug').equals(slug).toArray()
}

export async function getQuestionsByDifficulty(difficulty: Difficulty): Promise<Question[]> {
  return db.questions.where('difficulty').equals(difficulty).toArray()
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  return db.questions.get(id)
}

export async function getQuestionCount(): Promise<number> {
  return db.questions.count()
}

export async function getQuestionCountByCategory(categoryId: string): Promise<number> {
  return db.questions.where('categoryId').equals(categoryId).count()
}

export async function getQuestionCountByDifficulty(difficulty: Difficulty): Promise<number> {
  return db.questions.where('difficulty').equals(difficulty).count()
}

export async function getRandomQuestion(
  categoryId?: string,
  difficulty?: Difficulty,
  excludeIds?: string[]
): Promise<Question | undefined> {
  let collection = db.questions.toCollection()
  
  if (categoryId) {
    collection = db.questions.where('categoryId').equals(categoryId)
  }
  
  const questions = await collection.toArray()
  
  let filtered = questions
  
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty)
  }
  
  if (excludeIds && excludeIds.length > 0) {
    filtered = filtered.filter(q => !excludeIds.includes(q.id))
  }
  
  if (filtered.length === 0) {
    return undefined
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length)
  return filtered[randomIndex]
}

export async function searchQuestions(query: string): Promise<Question[]> {
  const lowerQuery = query.toLowerCase()
  const all = await db.questions.toArray()
  
  return all.filter(q => 
    q.titleEn.toLowerCase().includes(lowerQuery) ||
    q.titleEs.toLowerCase().includes(lowerQuery) ||
    q.descriptionEn.toLowerCase().includes(lowerQuery) ||
    q.descriptionEs.toLowerCase().includes(lowerQuery) ||
    (q.tags && q.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  )
}

export async function getQuestionsByType(type: QuestionType): Promise<Question[]> {
  return db.questions.where('type').equals(type).toArray()
}

export async function getCategoriesWithQuestionCount(): Promise<Array<{ id: string; slug: string; nameEn: string; nameEs: string; count: number }>> {
  const categories = await db.categories.orderBy('order').toArray()
  const counts = await Promise.all(
    categories.map(async (cat) => ({
      id: cat.id,
      slug: cat.slug,
      nameEn: cat.nameEn,
      nameEs: cat.nameEs,
      count: await getQuestionCountByCategory(cat.id),
    }))
  )
  return counts
}
