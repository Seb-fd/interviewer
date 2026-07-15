import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface UserProgress {
  totalPoints: number
  streakDays: number
  lastActivityDate: string | null
  longestStreak: number
  totalQuestionsAnswered: number
}

export interface CategoryProgress {
  completedQuestions: string[]
  correctCount: number
  incorrectCount: number
  totalPoints: number
}

export interface DailyActivity {
  date: string
  questionsAnswered: number
  pointsEarned: number
  streakMaintained: boolean
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user progress:', error)
    return null
  }

  return {
    totalPoints: data.total_points,
    streakDays: data.streak_days,
    lastActivityDate: data.last_activity_date,
    longestStreak: data.longest_streak,
    totalQuestionsAnswered: data.total_questions_answered,
  }
}

export async function getCategoryProgress(userId: string, categoryId: string): Promise<CategoryProgress | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  const { data, error } = await supabase
    .from('category_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .single()

  if (error) {
    console.error('Error fetching category progress:', error)
    return null
  }

  return {
    completedQuestions: data.completed_questions || [],
    correctCount: data.correct_count,
    incorrectCount: data.incorrect_count,
    totalPoints: data.total_points,
  }
}

export async function getAllCategoryProgress(userId: string): Promise<Record<string, CategoryProgress>> {
  if (!isSupabaseConfigured) {
    return {}
  }

  const { data, error } = await supabase
    .from('category_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching all category progress:', error)
    return {}
  }

  const result: Record<string, CategoryProgress> = {}
  data?.forEach((cp: any) => {
    result[cp.category_id] = {
      completedQuestions: cp.completed_questions || [],
      correctCount: cp.correct_count,
      incorrectCount: cp.incorrect_count,
      totalPoints: cp.total_points,
    }
  })

  return result
}

export async function saveUserProgress(
  userId: string,
  progress: Partial<UserProgress>
): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false
  }

  const updateData: Record<string, any> = {
    user_id: userId,
    updated_at: new Date().toISOString(),
  }

  if (progress.totalPoints !== undefined) updateData.total_points = progress.totalPoints
  if (progress.streakDays !== undefined) updateData.streak_days = progress.streakDays
  if (progress.lastActivityDate !== undefined) updateData.last_activity_date = progress.lastActivityDate
  if (progress.longestStreak !== undefined) updateData.longest_streak = progress.longestStreak
  if (progress.totalQuestionsAnswered !== undefined) updateData.total_questions_answered = progress.totalQuestionsAnswered

  const { error } = await supabase
    .from('user_progress')
    .upsert(updateData)

  if (error) {
    console.error('Error saving user progress:', error)
    return false
  }

  return true
}

export async function saveCategoryProgress(
  userId: string,
  categoryId: string,
  progress: Partial<CategoryProgress>
): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false
  }

  const updateData: Record<string, any> = {
    user_id: userId,
    category_id: categoryId,
  }

  if (progress.completedQuestions !== undefined) updateData.completed_questions = progress.completedQuestions
  if (progress.correctCount !== undefined) updateData.correct_count = progress.correctCount
  if (progress.incorrectCount !== undefined) updateData.incorrect_count = progress.incorrectCount
  if (progress.totalPoints !== undefined) updateData.total_points = progress.totalPoints

  const { error } = await supabase
    .from('category_progress')
    .upsert(updateData)

  if (error) {
    console.error('Error saving category progress:', error)
    return false
  }

  return true
}

export async function recordAttempt(
  userId: string,
  questionId: string,
  categoryId: string,
  isCorrect: boolean,
  points: number
): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false
  }

  const { error } = await supabase
    .from('attempts')
    .insert({
      user_id: userId,
      question_id: questionId,
      category_id: categoryId,
      is_correct: isCorrect,
      points_earned: points,
    })

  if (error) {
    console.error('Error recording attempt:', error)
    return false
  }

  return true
}

export async function getDailyActivity(userId: string, days: number = 30): Promise<DailyActivity[]> {
  if (!isSupabaseConfigured) {
    return []
  }

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('daily_activity')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching daily activity:', error)
    return []
  }

  return (data || []).map((d: any) => ({
    date: d.date,
    questionsAnswered: d.questions_answered,
    pointsEarned: d.points_earned,
    streakMaintained: d.streak_maintained,
  }))
}
