import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockQuestions, getQuestionsBySlug as getMockBySlug, type Question } from '@/data/questions'

export type { Question }

export async function getQuestions(categorySlug?: string, difficulty?: string): Promise<Question[]> {
  if (!isSupabaseConfigured) {
    if (categorySlug) {
      return getMockBySlug(categorySlug).filter(q => !difficulty || q.difficulty === difficulty)
    }
    return mockQuestions
  }

  let query = supabase
    .from('questions')
    .select(`
      id,
      category_id,
      difficulty,
      type,
      question_en,
      question_es,
      solution_en,
      solution_es,
      points,
      language,
      hint1_en,
      hint1_es,
      hint2_en,
      hint2_es,
      hint3_en,
      hint3_es,
      tags
    `)

  if (difficulty) {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching questions:', error)
    return categorySlug ? getMockBySlug(categorySlug) : mockQuestions
  }

  return data.map(q => ({
    id: q.id,
    slug: '', // Will be set by the caller
    titleEn: '',
    titleEs: '',
    descriptionEn: q.question_en,
    descriptionEs: q.question_es,
    difficulty: q.difficulty,
    type: q.type,
    points: q.points,
    language: q.language,
    hintsEn: [q.hint1_en, q.hint2_en, q.hint3_en].filter(Boolean),
    hintsEs: [q.hint1_es, q.hint2_es, q.hint3_es].filter(Boolean),
    solutionEn: q.solution_en,
    solutionEs: q.solution_es,
    tags: q.tags || [],
  }))
}

export async function getQuestionsByCategorySlug(categorySlug: string): Promise<Question[]> {
  if (!isSupabaseConfigured) {
    return getMockBySlug(categorySlug)
  }

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) {
    console.warn('Category not found:', categorySlug)
    return getMockBySlug(categorySlug)
  }

  const { data, error } = await supabase
    .from('questions')
    .select(`
      id,
      category_id,
      difficulty,
      type,
      question_en,
      question_es,
      solution_en,
      solution_es,
      points,
      language,
      hint1_en,
      hint1_es,
      hint2_en,
      hint2_es,
      hint3_en,
      hint3_es,
      tags
    `)
    .eq('category_id', category.id)

  if (error) {
    console.error('Error fetching questions by category:', error)
    return getMockBySlug(categorySlug)
  }

  return data.map(q => ({
    id: q.id,
    slug: categorySlug,
    titleEn: '',
    titleEs: '',
    descriptionEn: q.question_en,
    descriptionEs: q.question_es,
    difficulty: q.difficulty,
    type: q.type,
    points: q.points,
    language: q.language,
    hintsEn: [q.hint1_en, q.hint2_en, q.hint3_en].filter(Boolean),
    hintsEs: [q.hint1_es, q.hint2_es, q.hint3_es].filter(Boolean),
    solutionEn: q.solution_en,
    solutionEs: q.solution_es,
    tags: q.tags || [],
  }))
}

export async function getQuestionById(questionId: string): Promise<Question | null> {
  if (!isSupabaseConfigured) {
    return mockQuestions.find(q => q.id === questionId) || null
  }

  const { data, error } = await supabase
    .from('questions')
    .select(`
      id,
      category_id,
      difficulty,
      type,
      question_en,
      question_es,
      solution_en,
      solution_es,
      points,
      language,
      hint1_en,
      hint1_es,
      hint2_en,
      hint2_es,
      hint3_en,
      hint3_es,
      tags
    `)
    .eq('id', questionId)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return mockQuestions.find(q => q.id === questionId) || null
  }

  const { data: category } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', data.category_id)
    .single()

  return {
    id: data.id,
    slug: category?.slug || '',
    titleEn: '',
    titleEs: '',
    descriptionEn: data.question_en,
    descriptionEs: data.question_es,
    difficulty: data.difficulty,
    type: data.type,
    points: data.points,
    language: data.language,
    hintsEn: [data.hint1_en, data.hint2_en, data.hint3_en].filter(Boolean),
    hintsEs: [data.hint1_es, data.hint2_es, data.hint3_es].filter(Boolean),
    solutionEn: data.solution_en,
    solutionEs: data.solution_es,
    tags: data.tags || [],
  }
}
