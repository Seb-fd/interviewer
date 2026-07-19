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

export async function getLeaderboard(_limit: number = 10): Promise<LeaderboardEntry[]> {
  return mockLeaderboard
}

export async function getUserRank(_userId: string): Promise<number | null> {
  return null
}
