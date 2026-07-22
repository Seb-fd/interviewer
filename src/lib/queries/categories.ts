import { db } from '@/lib/db'
import { getQuestionCountByCategory } from '@/lib/db/questions'

export interface Category {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  icon: string
  color: string
  type: 'project' | 'tech'
  order: number
}

export async function getCategories(): Promise<Category[]> {
  const categories = await db.categories.orderBy('order').toArray()
  return categories
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await db.categories.where('slug').equals(slug).first()
  return category || null
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await db.categories.get(id)
  return category || null
}

export async function getCategoryQuestionCount(categoryId: string): Promise<number> {
  return getQuestionCountByCategory(categoryId)
}

export async function getCategoriesWithQuestionCount(): Promise<Array<Category & { totalQuestions: number }>> {
  const categories = await getCategories()
  const result = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      totalQuestions: await getQuestionCountByCategory(cat.id),
    }))
  )
  return result
}
