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

export async function getUserProgress(_userId: string): Promise<UserProgress | null> {
  return null
}

export async function getCategoryProgress(_userId: string, _categoryId: string): Promise<CategoryProgress | null> {
  return null
}

export async function getAllCategoryProgress(_userId: string): Promise<Record<string, CategoryProgress>> {
  return {}
}

export async function saveUserProgress(
  _userId: string,
  _progress: Partial<UserProgress>
): Promise<boolean> {
  return true
}

export async function saveCategoryProgress(
  _userId: string,
  _categoryId: string,
  _progress: Partial<CategoryProgress>
): Promise<boolean> {
  return true
}

export async function recordAttempt(
  _userId: string,
  _questionId: string,
  _categoryId: string,
  _isCorrect: boolean,
  _points: number
): Promise<boolean> {
  return true
}

export async function getDailyActivity(_userId: string, _days: number = 30): Promise<DailyActivity[]> {
  return []
}
