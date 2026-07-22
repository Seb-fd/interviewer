import { useQuery } from '@tanstack/react-query'
import { getBadgesWithEarnedStatus } from '@/lib/queries/badges'

export type { Badge } from '@/lib/queries/badges'

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async () => {
      try {
        return await getBadgesWithEarnedStatus()
      } catch (error) {
        console.error('Error fetching badges:', error)
        throw new Error('Failed to fetch badges')
      }
    },
    staleTime: Infinity,
  })
}
