import { useLiveQuery } from 'dexie-react-hooks'
import { db, LOCAL_USER_ID } from '@/lib/db'
import { format, subDays } from 'date-fns'

export function useProgress() {
  return useLiveQuery(
    async () => {
      const progress = await db.userProgress.where('oderId').equals(LOCAL_USER_ID).toArray()
      return progress
    },
    [],
    []
  )
}

export function useStreak() {
  return useLiveQuery(
    async () => {
      const activities = await db.dailyActivity
        .where('oderId')
        .equals(LOCAL_USER_ID)
        .reverse()
        .sortBy('date')
      
      if (activities.length === 0) {
        return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, isActiveToday: false }
      }
      
      const today = format(new Date(), 'yyyy-MM-dd')
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
      
      const mostRecent = activities[0]
      const lastDate = mostRecent.date
      
      let currentStreak = 0
      let longestStreak = 0
      let tempStreak = 0
      
      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i]
        const expectedDate = format(subDays(new Date(), i), 'yyyy-MM-dd')
        
        if (activity.date === expectedDate && activity.questionsAttempted > 0) {
          tempStreak++
          if (i === 0) {
            currentStreak = tempStreak
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 0
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak)
      
      const isActiveToday = lastDate === today
      const streakActive = lastDate === today || lastDate === yesterday
      
      return {
        currentStreak: streakActive ? currentStreak : 0,
        longestStreak,
        lastActiveDate: lastDate,
        isActiveToday,
      }
    },
    [],
    { currentStreak: 0, longestStreak: 0, lastActiveDate: null, isActiveToday: false }
  )
}

export function useDailyActivity(days: number = 7) {
  return useLiveQuery(
    async () => {
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')
      
      const activities = await db.dailyActivity
        .where('oderId')
        .equals(LOCAL_USER_ID)
        .toArray()
      
      return activities
        .filter(a => a.date >= startDate)
        .sort((a, b) => b.date.localeCompare(a.date))
    },
    [days],
    []
  )
}

export function useAttempts(questionId?: string) {
  return useLiveQuery(
    async () => {
      if (questionId) {
        return db.attempts
          .where('[oderId+questionId]')
          .equals([LOCAL_USER_ID, questionId])
          .reverse()
          .sortBy('createdAt')
      }
      
      return db.attempts
        .where('oderId')
        .equals(LOCAL_USER_ID)
        .reverse()
        .sortBy('createdAt')
    },
    [questionId],
    []
  )
}

export function useCompletedQuestions() {
  return useLiveQuery(
    async () => {
      const attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
      const completed = new Set<string>()
      
      for (const attempt of attempts) {
        if (attempt.isCorrect) {
          completed.add(attempt.questionId)
        }
      }
      
      return completed
    },
    [],
    new Set<string>()
  )
}

export function useQuestionProgress(categoryId: string) {
  return useLiveQuery(
    async () => {
      return db.userProgress
        .where('[oderId+categoryId]')
        .equals([LOCAL_USER_ID, categoryId])
        .first()
    },
    [categoryId],
    undefined
  )
}

export function useTotalStats() {
  return useLiveQuery(
    async () => {
      const progress = await db.userProgress.where('oderId').equals(LOCAL_USER_ID).toArray()
      
      let totalScore = 0
      let totalQuestions = 0
      let correctAnswers = 0
      
      for (const p of progress) {
        totalScore += p.totalScore
        totalQuestions += p.completedQuestions.length
        correctAnswers += p.correctCount
      }
      
      const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
      
      return {
        totalScore,
        totalQuestions,
        correctAnswers,
        accuracy,
      }
    },
    [],
    { totalScore: 0, totalQuestions: 0, correctAnswers: 0, accuracy: 0 }
  )
}
