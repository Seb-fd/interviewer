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

export { 
  getUserProgress,
  getCategoryProgress,
  getAllProgress,
  recordAttempt,
  isQuestionCompleted,
  getCompletedQuestionIds,
} from '@/lib/db/progress'

export { calculateStreak, getRecentActivity, recordActivity } from '@/lib/db/activity'
