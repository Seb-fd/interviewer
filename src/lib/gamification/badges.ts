import { db, LOCAL_USER_ID } from '@/lib/db'
import { getAllBadges, earnBadge } from '@/lib/db/badges'
import { getAllProgress } from '@/lib/db/progress'
import { calculateStreak } from '@/lib/db/activity'
import { getLearningStats } from '@/lib/db/spaced-repetition'

export interface BadgeCheckParams {
  questionsAnswered: number
  categoriesCompleted: string[]
  currentStreak: number
  longestStreak: number
  accuracy: number
  fastestTime: number
  fastestQuestionDifficulty?: string
  totalReviews: number
  confidentCorrect: number
  humbleAcknowledged: number
  reviewStreak: number
}

export interface BadgeEarnResult {
  slug: string
  nameEn: string
  nameEs: string
  icon: string
  tier: string
}

export async function checkAndAwardBadges(): Promise<BadgeEarnResult[]> {
  const earnedBadges: BadgeEarnResult[] = []
  
  const progress = await getAllProgress()
  const streakInfo = await calculateStreak()
  const attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
  
  const categories = await db.categories.toArray()
  const categorySlugToId = new Map<string, string>()
  for (const cat of categories) {
    categorySlugToId.set(cat.slug, cat.id)
  }
  
  const questionsAnswered = progress.totalQuestions
  const accuracy = progress.accuracy
  
  const categoriesCompleted: string[] = []
  
  for (const [catId, prog] of progress.categoryProgress) {
    const cat = categories.find(c => c.id === catId)
    if (!cat) continue
    
    const totalQuestionsInCategory = await db.questions
      .where('categoryId')
      .equals(catId)
      .count()
    
    if (totalQuestionsInCategory > 0 && prog.completedQuestions.length >= totalQuestionsInCategory) {
      categoriesCompleted.push(cat.slug)
    }
  }
  
  const correctAttempts = attempts.filter(a => a.isCorrect)
  
  let fastestTime = 0
  let fastestQuestionDifficulty: string | undefined
  
  if (correctAttempts.length > 0) {
    const fastestAttempt = correctAttempts.reduce((fastest, attempt) => 
      attempt.timeSpent < fastest.timeSpent ? attempt : fastest
    , correctAttempts[0])
    
    fastestTime = fastestAttempt.timeSpent
    
    const fastestQuestion = await db.questions.get(fastestAttempt.questionId)
    fastestQuestionDifficulty = fastestQuestion?.difficulty
  }
  
  const params: BadgeCheckParams = {
    questionsAnswered,
    categoriesCompleted,
    currentStreak: streakInfo.currentStreak,
    longestStreak: streakInfo.longestStreak,
    accuracy,
    fastestTime,
    fastestQuestionDifficulty,
    totalReviews: 0,
    confidentCorrect: 0,
    humbleAcknowledged: 0,
    reviewStreak: 0,
  }

  const learningStats = await getLearningStats()
  params.totalReviews = learningStats.totalLearned

  params.confidentCorrect = attempts.filter(a => a.isCorrect && a.confidence === 'know').length
  params.humbleAcknowledged = attempts.filter(a => a.confidence === 'dont-know').length

  const allBadges = await getAllBadges()
  
  for (const badge of allBadges) {
    const alreadyEarned = await db.userBadges
      .where('[oderId+badgeId]')
      .equals([LOCAL_USER_ID, badge.id])
      .first()
    
    if (alreadyEarned) continue
    
    let shouldEarn = false
    
    switch (badge.type) {
      case 'volume':
        shouldEarn = checkVolumeBadge(badge.slug, params.questionsAnswered)
        break
      case 'streak':
        shouldEarn = checkStreakBadge(badge.slug, params.currentStreak)
        break
      case 'accuracy':
        shouldEarn = checkAccuracyBadge(badge.slug, params.accuracy)
        break
      case 'speed':
        shouldEarn = checkSpeedBadge(badge.slug, params.fastestTime, params.fastestQuestionDifficulty)
        break
      case 'category':
        shouldEarn = checkCategoryBadge(badge.slug, params.categoriesCompleted)
        break
      case 'learning':
        shouldEarn = checkLearningBadge(badge.slug, params.totalReviews, params.reviewStreak)
        break
      case 'confidence':
        shouldEarn = checkConfidenceBadge(badge.slug, params.confidentCorrect, params.humbleAcknowledged)
        break
    }
    
    if (shouldEarn) {
      const awarded = await earnBadge(badge.id)
      if (awarded) {
        earnedBadges.push({
          slug: badge.slug,
          nameEn: badge.nameEn,
          nameEs: badge.nameEs,
          icon: badge.icon,
          tier: badge.tier,
        })
      }
    }
  }
  
  return earnedBadges
}

function checkVolumeBadge(slug: string, questionsAnswered: number): boolean {
  const volumeThresholds: Record<string, number> = {
    'first-blood': 1,
    'learning-begins': 10,
    'getting-started': 25,
    'dedicated': 50,
    'committed': 100,
  }
  
  const threshold = volumeThresholds[slug]
  return threshold !== undefined && questionsAnswered >= threshold
}

function checkStreakBadge(slug: string, currentStreak: number): boolean {
  const streakThresholds: Record<string, number> = {
    'streak-3': 3,
    'streak-7': 7,
    'streak-14': 14,
    'streak-30': 30,
    'streak-60': 60,
    'streak-100': 100,
  }
  
  const threshold = streakThresholds[slug]
  return threshold !== undefined && currentStreak >= threshold
}

function checkAccuracyBadge(slug: string, accuracy: number): boolean {
  if (slug === 'perfectionist') {
    return accuracy === 100
  }
  if (slug === 'sharp-shooter') {
    return accuracy >= 80
  }
  return false
}

function checkSpeedBadge(slug: string, fastestTime: number, fastestQuestionDifficulty?: string): boolean {
  if (slug === 'speed-demon') {
    return fastestTime > 0 && fastestTime <= 120 && fastestQuestionDifficulty === 'senior'
  }
  return false
}

function checkCategoryBadge(slug: string, categoriesCompleted: string[]): boolean {
  const categoryMap: Record<string, string> = {
    'pm-master': 'password-manager',
    'ss-master': 'social-media-app',
    'game-master': 'multiplayer-mini-game',
    'commerce-master': 'gitanas-ecommerce',
    'landing-master': 'hermit-bar',
    'react-pro': 'react-hooks',
    'next-ninja': 'nextjs',
    'database-wizard': 'database-prisma',
    'security-guardian': 'security-auth',
    'realtime-expert': 'realtime-systems',
    'testing-champion': 'testing-cicd',
    'state-master': 'state-management',
  }
  
  const requiredCategory = categoryMap[slug]
  if (!requiredCategory) return false
  
  return categoriesCompleted.includes(requiredCategory)
}

function checkLearningBadge(slug: string, totalReviews: number, reviewStreak: number): boolean {
  const learningThresholds: Record<string, number> = {
    'first-review': 1,
    'consistent-learner': 7,
    'spaced-master': 100,
  }
  
  if (slug === 'consistent-learner') {
    return reviewStreak >= 7
  }
  
  const threshold = learningThresholds[slug]
  return threshold !== undefined && totalReviews >= threshold
}

function checkConfidenceBadge(slug: string, confidentCorrect: number, humbleAcknowledged: number): boolean {
  if (slug === 'confident') {
    return confidentCorrect >= 10
  }
  if (slug === 'humble-learner') {
    return humbleAcknowledged >= 5
  }
  return false
}

export function getBadgeTierColor(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'text-amber-700'
    case 'silver':
      return 'text-gray-400'
    case 'gold':
      return 'text-yellow-500'
    case 'platinum':
      return 'text-purple-400'
    default:
      return 'text-gray-400'
  }
}

export function getBadgeTierBgColor(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-100 text-amber-700'
    case 'silver':
      return 'bg-gray-100 text-gray-400'
    case 'gold':
      return 'bg-yellow-100 text-yellow-600'
    case 'platinum':
      return 'bg-purple-100 text-purple-400'
    default:
      return 'bg-gray-100 text-gray-400'
  }
}
