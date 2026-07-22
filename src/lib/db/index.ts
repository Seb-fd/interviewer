import Dexie, { type EntityTable } from 'dexie'
import type {
  Profile,
  Category,
  Question,
  UserProgress,
  Attempt,
  Badge,
  UserBadge,
  DailyActivity,
  LearningRecord,
} from './types'

const db = new Dexie('TechInterviewPlatform') as Dexie & {
  profiles: EntityTable<Profile, 'id'>
  categories: EntityTable<Category, 'id'>
  questions: EntityTable<Question, 'id'>
  userProgress: EntityTable<UserProgress, 'id'>
  attempts: EntityTable<Attempt, 'id'>
  badges: EntityTable<Badge, 'id'>
  userBadges: EntityTable<UserBadge, 'id'>
  dailyActivity: EntityTable<DailyActivity, 'id'>
  learningRecords: EntityTable<LearningRecord, 'questionId'>
}

db.version(1).stores({
  profiles: 'id, username, email',
  categories: 'id, slug, type, order',
  questions: 'id, categoryId, slug, difficulty, type',
  userProgress: 'id, [oderId+categoryId], oderId, categoryId',
  attempts: 'id, [oderId+questionId], oderId, questionId, createdAt',
  badges: 'id, slug, tier, type',
  userBadges: 'id, [oderId+badgeId], oderId, badgeId',
  dailyActivity: 'id, [oderId+date], oderId, date',
  learningRecords: 'questionId, [oderId+questionId], oderId, nextReviewDate, state',
})

export { db }

export const LOCAL_USER_ID = 'local-user'

export async function getOrCreateLocalUser(): Promise<Profile> {
  let user = await db.profiles.get(LOCAL_USER_ID)
  
  if (!user) {
    user = {
      id: LOCAL_USER_ID,
      username: 'Learner',
      email: 'local@user',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }
    await db.profiles.add(user)
  }
  
  return user
}

export async function updateLastActive(): Promise<void> {
  await db.profiles.update(LOCAL_USER_ID, {
    lastActiveAt: new Date().toISOString(),
  })
}

export async function isDatabaseSeeded(): Promise<boolean> {
  const count = await db.categories.count()
  return count > 0
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.profiles, db.categories, db.questions, db.userProgress, db.attempts, db.badges, db.userBadges, db.dailyActivity] as any, async () => {
    await db.profiles.clear()
    await db.categories.clear()
    await db.questions.clear()
    await db.userProgress.clear()
    await db.attempts.clear()
    await db.badges.clear()
    await db.userBadges.clear()
    await db.dailyActivity.clear()
  })
}

export async function resetUserData(): Promise<void> {
  await db.transaction('rw', [db.userProgress, db.attempts, db.userBadges, db.dailyActivity] as any, async () => {
    await db.userProgress.where('oderId').equals(LOCAL_USER_ID).delete()
    await db.attempts.where('oderId').equals(LOCAL_USER_ID).delete()
    await db.userBadges.where('oderId').equals(LOCAL_USER_ID).delete()
    await db.dailyActivity.where('oderId').equals(LOCAL_USER_ID).delete()
  })
}
