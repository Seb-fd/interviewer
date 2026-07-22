export interface Badge {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  icon: string
  color: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  earned: boolean
  earnedAt?: string
  progress?: number
}

export { 
  getAllBadges,
  getBadgeBySlug,
  getEarnedBadges,
  getBadgesWithEarnedStatus,
  earnBadge,
  getRecentBadges,
} from '@/lib/db/badges'
