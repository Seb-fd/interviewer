import { calculateStreak, type StreakInfo } from '@/lib/db/activity'

export interface StreakMilestone {
  days: number
  achieved: boolean
  next: number | null
  progress: number
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]

export async function getStreakInfo(): Promise<StreakInfo> {
  return calculateStreak()
}

export async function getStreakMilestone(currentStreak: number): Promise<StreakMilestone | null> {
  for (let i = 0; i < STREAK_MILESTONES.length; i++) {
    const milestone = STREAK_MILESTONES[i]
    
    if (currentStreak < milestone) {
      const prev = i === 0 ? 0 : STREAK_MILESTONES[i - 1]
      const progress = ((currentStreak - prev) / (milestone - prev)) * 100
      
      return {
        days: milestone,
        achieved: false,
        next: milestone,
        progress: Math.min(100, Math.max(0, progress)),
      }
    }
  }
  
  return null
}

export async function getStreakAchievements(currentStreak: number): Promise<StreakMilestone[]> {
  const achievements: StreakMilestone[] = []
  
  for (let i = 0; i < STREAK_MILESTONES.length; i++) {
    const milestone = STREAK_MILESTONES[i]
    const achieved = currentStreak >= milestone
    
    achievements.push({
      days: milestone,
      achieved,
      next: null,
      progress: achieved ? 100 : 0,
    })
  }
  
  return achievements
}

export function getStreakBonusMultiplier(streakDays: number): number {
  if (streakDays >= 100) return 1.5
  if (streakDays >= 60) return 1.35
  if (streakDays >= 30) return 1.25
  if (streakDays >= 14) return 1.15
  if (streakDays >= 7) return 1.1
  return 1.0
}

export function formatStreakMessage(streak: number, language: 'en' | 'es' = 'en'): string {
  if (streak === 0) {
    return language === 'en' 
      ? 'Start your streak today!' 
      : '¡Comienza tu racha hoy!'
  }
  
  if (streak === 1) {
    return language === 'en'
      ? '1 day streak! Keep it going!'
      : '¡1 día de racha! ¡Sigue así!'
  }
  
  return language === 'en'
    ? `${streak} days streak! Amazing!`
    : `¡${streak} días de racha! ¡Increíble!`
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return '🔥💎'
  if (streak >= 60) return '🔥👑'
  if (streak >= 30) return '🔥⭐'
  if (streak >= 14) return '🔥✨'
  if (streak >= 7) return '🔥'
  if (streak >= 3) return '💪'
  return '⭐'
}
