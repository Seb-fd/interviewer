import { db, LOCAL_USER_ID } from './index'
import type { Badge, UserBadge } from './types'

export async function getAllBadges(): Promise<Badge[]> {
  return db.badges.toArray()
}

export async function getBadgeBySlug(slug: string): Promise<Badge | undefined> {
  return db.badges.where('slug').equals(slug).first()
}

export async function getBadgeById(id: string): Promise<Badge | undefined> {
  return db.badges.get(id)
}

export async function getEarnedBadges(): Promise<UserBadge[]> {
  return db.userBadges.where('oderId').equals(LOCAL_USER_ID).toArray()
}

export async function getEarnedBadgeIds(): Promise<Set<string>> {
  const earned = await getEarnedBadges()
  return new Set(earned.map(e => e.badgeId))
}

export async function isBadgeEarned(badgeId: string): Promise<boolean> {
  const existing = await db.userBadges
    .where('[oderId+badgeId]')
    .equals([LOCAL_USER_ID, badgeId])
    .first()
  
  return !!existing
}

export async function earnBadge(badgeId: string): Promise<boolean> {
  const existing = await db.userBadges
    .where('[oderId+badgeId]')
    .equals([LOCAL_USER_ID, badgeId])
    .first()
  
  if (existing) {
    return false
  }
  
  await db.userBadges.add({
    id: crypto.randomUUID(),
    oderId: LOCAL_USER_ID,
    badgeId,
    earnedAt: new Date().toISOString(),
  })
  
  return true
}

export async function earnBadgeBySlug(slug: string): Promise<boolean> {
  const badge = await getBadgeBySlug(slug)
  if (!badge) return false
  
  return earnBadge(badge.id)
}

export async function getBadgesWithEarnedStatus(): Promise<Array<Badge & { earned: boolean; earnedAt?: string; progress?: number }>> {
  const badges = await getAllBadges()
  const earnedBadges = await getEarnedBadges()
  
  const earnedMap = new Map<string, string>()
  for (const eb of earnedBadges) {
    earnedMap.set(eb.badgeId, eb.earnedAt)
  }
  
  return badges.map(badge => ({
    ...badge,
    earned: earnedMap.has(badge.id),
    earnedAt: earnedMap.get(badge.id),
    progress: earnedMap.has(badge.id) ? 100 : 0,
  }))
}

export async function getRecentBadges(limit: number = 3): Promise<Array<Badge & { earnedAt: string }>> {
  const earnedBadges = await db.userBadges
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .sortBy('earnedAt')
  
  const recent = earnedBadges.reverse().slice(0, limit)
  
  const result: Array<Badge & { earnedAt: string }> = []
  for (const eb of recent) {
    const badge = await getBadgeById(eb.badgeId)
    if (badge) {
      result.push({
        ...badge,
        earnedAt: eb.earnedAt,
      })
    }
  }
  
  return result
}

export async function getTotalEarnedBadges(): Promise<number> {
  return db.userBadges.where('oderId').equals(LOCAL_USER_ID).count()
}

export async function resetEarnedBadges(): Promise<void> {
  await db.userBadges.where('oderId').equals(LOCAL_USER_ID).delete()
}
