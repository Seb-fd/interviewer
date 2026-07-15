import { useQuery } from '@tanstack/react-query'
import { getCategories as fetchCategories, getCategoryBySlug as fetchCategoryBySlug, getCategoryQuestionCount } from '@/lib/queries/categories'

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
  totalQuestions: number
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const categories = await fetchCategories()
        const categoriesWithCount = await Promise.all(
          categories.map(async (cat) => ({
            ...cat,
            totalQuestions: await getCategoryQuestionCount(cat.id),
          }))
        )
        return categoriesWithCount
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw new Error('Failed to fetch categories')
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      try {
        const category = await fetchCategoryBySlug(slug)
        if (category) {
          const totalQuestions = await getCategoryQuestionCount(category.id)
          return { ...category, totalQuestions }
        }
        return null
      } catch (error) {
        console.error('Error fetching category:', error)
        throw new Error('Failed to fetch category')
      }
    },
    enabled: !!slug,
  })
}
