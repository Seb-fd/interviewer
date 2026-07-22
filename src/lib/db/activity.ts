import { db, LOCAL_USER_ID } from './index'
import type { DailyActivity } from './types'
import { format, subDays } from 'date-fns'

export interface StreakInfo {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  isActiveToday: boolean
}

export async function getTodayActivity(): Promise<DailyActivity | undefined> {
  const today = format(new Date(), 'yyyy-MM-dd')
  
  return db.dailyActivity
    .where('[oderId+date]')
    .equals([LOCAL_USER_ID, today])
    .first()
}

export async function getActivityByDate(date: string): Promise<DailyActivity | undefined> {
  return db.dailyActivity
    .where('[oderId+date]')
    .equals([LOCAL_USER_ID, date])
    .first()
}

export async function getRecentActivity(days: number = 30): Promise<DailyActivity[]> {
  const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd')
  
  const all = await db.dailyActivity
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()
  
  return all
    .filter(a => a.date >= startDate)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getActivityForDateRange(startDate: string, endDate: string): Promise<DailyActivity[]> {
  const all = await db.dailyActivity
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()
  
  return all
    .filter(a => a.date >= startDate && a.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function recordActivity(params: {
  questionsAttempted?: number
  questionsCorrect?: number
  totalScore?: number
  timeSpent?: number
}): Promise<void> {
  const today = format(new Date(), 'yyyy-MM-dd')
  
  const existing = await getTodayActivity()
  
  if (existing) {
    await db.dailyActivity.update(existing.id, {
      questionsAttempted: existing.questionsAttempted + (params.questionsAttempted || 0),
      questionsCorrect: existing.questionsCorrect + (params.questionsCorrect || 0),
      totalScore: existing.totalScore + (params.totalScore || 0),
      timeSpent: existing.timeSpent + (params.timeSpent || 0),
    })
  } else {
    await db.dailyActivity.add({
      id: crypto.randomUUID(),
      oderId: LOCAL_USER_ID,
      date: today,
      questionsAttempted: params.questionsAttempted || 0,
      questionsCorrect: params.questionsCorrect || 0,
      totalScore: params.totalScore || 0,
      timeSpent: params.timeSpent || 0,
    })
  }
}

export async function calculateStreak(): Promise<StreakInfo> {
  const activities = await db.dailyActivity
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .reverse()
    .sortBy('date')
  
  if (activities.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      isActiveToday: false,
    }
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
}

export async function getWeeklyActivity(): Promise<{
  weekStart: string
  weekEnd: string
  days: DailyActivity[]
  totalQuestions: number
  totalCorrect: number
  totalScore: number
  totalTime: number
}> {
  const today = new Date()
  const weekStart = format(subDays(today, 6), 'yyyy-MM-dd')
  const weekEnd = format(today, 'yyyy-MM-dd')
  
  const days = await getActivityForDateRange(weekStart, weekEnd)
  
  let totalQuestions = 0
  let totalCorrect = 0
  let totalScore = 0
  let totalTime = 0
  
  for (const day of days) {
    totalQuestions += day.questionsAttempted
    totalCorrect += day.questionsCorrect
    totalScore += day.totalScore
    totalTime += day.timeSpent
  }
  
  return {
    weekStart,
    weekEnd,
    days,
    totalQuestions,
    totalCorrect,
    totalScore,
    totalTime,
  }
}

export async function getActivityHeatmap(days: number = 90): Promise<Map<string, number>> {
  const activities = await getRecentActivity(days)
  const heatmap = new Map<string, number>()
  
  for (const activity of activities) {
    heatmap.set(activity.date, activity.questionsAttempted)
  }
  
  return heatmap
}

export async function resetActivity(): Promise<void> {
  await db.dailyActivity.where('oderId').equals(LOCAL_USER_ID).delete()
}
