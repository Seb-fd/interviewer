import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface LeaderboardEntry {
  rank: number
  odcUserId: string
  username: string
  avatarUrl?: string
  totalPoints: number
  streakDays: number
  completedQuestions: number
  badges: string[]
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, odcUserId: 'user-1', username: 'alex_dev', totalPoints: 12500, streakDays: 45, completedQuestions: 150, badges: ['Legend'] },
  { rank: 2, odcUserId: 'user-2', username: 'maria_code', totalPoints: 11200, streakDays: 30, completedQuestions: 140, badges: ['Master'] },
  { rank: 3, odcUserId: 'user-3', username: 'john_sec', totalPoints: 9800, streakDays: 21, completedQuestions: 120, badges: ['Expert'] },
  { rank: 4, odcUserId: 'user-4', username: 'emma_js', totalPoints: 8700, streakDays: 14, completedQuestions: 105, badges: ['Pro'] },
  { rank: 5, odcUserId: 'user-5', username: 'you', totalPoints: 0, streakDays: 0, completedQuestions: 0, badges: ['Beginner'] },
]

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured) {
    return mockLeaderboard
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      user_id,
      total_points,
      streak_days,
      updated_at,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .order('total_points', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return mockLeaderboard
  }

  return data.map((entry: any, index: number) => ({
    rank: index + 1,
    odcUserId: entry.user_id,
    username: entry.profiles?.username || `User ${entry.user_id.slice(0, 8)}`,
    avatarUrl: entry.profiles?.avatar_url,
    totalPoints: entry.total_points || 0,
    streakDays: entry.streak_days || 0,
    completedQuestions: 0,
    badges: [],
  }))
}

export async function getUserRank(userId: string): Promise<number | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  const { data: userProgress } = await supabase
    .from('user_progress')
    .select('total_points')
    .eq('user_id', userId)
    .single()

  if (!userProgress) {
    return null
  }

  const { count, error } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .gt('total_points', userProgress.total_points)

  if (error) {
    console.error('Error fetching user rank:', error)
    return null
  }

  return (count || 0) + 1
}
