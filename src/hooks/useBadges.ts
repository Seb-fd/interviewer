import { useQuery } from '@tanstack/react-query'
import { getBadges as fetchBadges, getBadgeProgress as fetchBadgeProgress, type Badge } from '@/lib/queries/badges'

export type { Badge }

export function useBadges(userId?: string) {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: async () => {
      try {
        const badges = await fetchBadges()

        if (userId) {
          const progress = await fetchBadgeProgress(userId)
          return badges.map(badge => ({
            ...badge,
            earned: progress[badge.id] >= (badge as any).requirementValue,
            progress: progress[badge.id] || 0,
            earnedAt: undefined,
          }))
        }

        return badges.map(badge => ({
          ...badge,
          earned: false,
          progress: 0,
          earnedAt: undefined,
        }))
      } catch (error) {
        console.error('Error fetching badges:', error)
        throw new Error('Failed to fetch badges')
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
