import { useQuery } from '@tanstack/react-query'
import { getLeaderboard as fetchLeaderboard, type LeaderboardEntry as DBLeaderboardEntry } from '@/lib/queries/leaderboard'

export interface LeaderboardEntry {
  rank: number
  username: string
  avatarUrl?: string
  score: number
  accuracy: number
  badge: string
  isCurrentUser?: boolean
}

export function useLeaderboard(type: 'global' | 'weekly' = 'global', userId?: string) {
  return useQuery({
    queryKey: ['leaderboard', type, userId],
    queryFn: async () => {
      try {
        const entries = await fetchLeaderboard(10)

        return entries.map((entry: DBLeaderboardEntry) => ({
          rank: entry.rank,
          username: entry.username,
          avatarUrl: entry.avatarUrl,
          score: entry.totalPoints,
          accuracy: entry.completedQuestions > 0
            ? Math.round((entry.totalPoints / entry.completedQuestions) * 100)
            : 0,
          badge: entry.badges[0] || 'Beginner',
          isCurrentUser: userId ? entry.odcUserId === userId : false,
        }))
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        throw new Error('Failed to fetch leaderboard')
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
