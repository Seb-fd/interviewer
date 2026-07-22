import { db, LOCAL_USER_ID } from './index'
import type { Confidence, LearningRecord, MasteryLevel } from './types'
import {
  confidenceToRating,
} from './types'
import {
  calculateNextReview as fsrsCalculateNextReview,
  getInitialLearningRecord,
  calculateDaysSinceReview,
  calculateRetrievability,
  getMasteryLevel,
} from './fsrs'
import { DEFAULT_FSRS_STATE } from './types'

export { getMasteryLevel, calculateDaysSinceReview, calculateRetrievability }
export type { MasteryLevel }

export { DEFAULT_FSRS_STATE }

export async function getOrCreateLearningRecord(
  questionId: string
): Promise<LearningRecord> {
  const existing = await db.learningRecords
    .where('[oderId+questionId]')
    .equals([LOCAL_USER_ID, questionId])
    .first()

  if (existing) return existing

  const now = new Date().toISOString().split('T')[0]
  const newRecord: LearningRecord = {
    oderId: LOCAL_USER_ID,
    questionId,
    stability: 0,
    difficulty: 5,
    retrievability: 0,
    state: 'new',
    lapses: 0,
    repetitions: 0,
    nextReviewDate: now,
    lastReviewDate: now,
  }

  await db.learningRecords.add(newRecord)
  return newRecord
}

export async function updateLearningRecord(
  questionId: string,
  isCorrect: boolean,
  confidence: Confidence
): Promise<LearningRecord> {
  const record = await getOrCreateLearningRecord(questionId)
  const rating = confidenceToRating(confidence, isCorrect)

  let updatedRecord: LearningRecord

  if (record.repetitions === 0) {
    updatedRecord = getInitialLearningRecord(LOCAL_USER_ID, questionId, rating)

    if (!isCorrect) {
      updatedRecord.lapses = 1
    }
  } else {
    updatedRecord = fsrsCalculateNextReview(record, rating)
  }

  updatedRecord = {
    ...record,
    ...updatedRecord,
  }

  await db.learningRecords.put(updatedRecord)
  return updatedRecord
}

export async function getDueQuestions(limit: number = 10): Promise<string[]> {
  const now = new Date().toISOString().split('T')[0]
  const records = await db.learningRecords
    .where('[oderId+nextReviewDate]')
    .between([LOCAL_USER_ID, ''], [LOCAL_USER_ID, now], true, true)
    .limit(limit)
    .toArray()

  return records.map(r => r.questionId)
}

export async function getNewQuestions(limit: number = 3): Promise<string[]> {
  const allQuestions = await db.questions.toArray()
  const existingRecords = await db.learningRecords
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  const learnedQuestionIds = new Set(existingRecords.map(r => r.questionId))
  const newQuestions = allQuestions
    .filter(q => !learnedQuestionIds.has(q.id))
    .slice(0, limit)

  return newQuestions.map(q => q.id)
}

export async function getReviewQueue(
  reviewLimit: number = 10,
  newLimit: number = 3
): Promise<{ dueQuestions: string[]; newQuestions: string[] }> {
  const dueQuestions = await getDueQuestions(reviewLimit)
  const newQuestions = await getNewQuestions(newLimit)

  return { dueQuestions, newQuestions }
}

export async function getLearningStats(): Promise<{
  totalLearned: number
  dueToday: number
  averageStability: number
  averageDifficulty: number
  masteryDistribution: { mastered: number; reviewing: number; learning: number; new: number }
}> {
  const records = await db.learningRecords
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  const now = new Date().toISOString().split('T')[0]

  let totalStability = 0
  let totalDifficulty = 0
  let dueToday = 0
  let mastered = 0
  let reviewing = 0
  let learning = 0
  let newCount = 0

  for (const record of records) {
    totalStability += record.stability
    totalDifficulty += record.difficulty
    if (record.nextReviewDate <= now) dueToday++

    const level = getMasteryLevel(record)
    switch (level) {
      case 'new':
        newCount++
        break
      case 'mastered':
        mastered++
        break
      case 'reviewing':
        reviewing++
        break
      case 'learning':
        learning++
        break
    }
  }

  const totalLearned = records.length
  const averageStability = totalLearned > 0 ? totalStability / totalLearned : 0
  const averageDifficulty = totalLearned > 0 ? totalDifficulty / totalLearned : 5

  return {
    totalLearned,
    dueToday,
    averageStability,
    averageDifficulty,
    masteryDistribution: { mastered, reviewing, learning, new: newCount },
  }
}

export async function getQuestionsByMasteryLevel(level: MasteryLevel): Promise<string[]> {
  const records = await db.learningRecords
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  return records
    .filter(r => getMasteryLevel(r) === level)
    .map(r => r.questionId)
}

export async function getMasteryLevelForQuestion(questionId: string): Promise<MasteryLevel> {
  const record = await getOrCreateLearningRecord(questionId)
  return getMasteryLevel(record)
}

export async function getWeakAreas(limit: number = 5): Promise<Array<{
  categoryId: string
  categoryName: string
  dueCount: number
  averageDifficulty: number
}>> {
  const records = await db.learningRecords
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  const categoryMap = new Map<string, { due: number; totalDifficulty: number; count: number }>()
  const now = new Date().toISOString().split('T')[0]

  for (const record of records) {
    const question = await db.questions.get(record.questionId)
    if (!question) continue

    const cat = categoryMap.get(question.categoryId) || { due: 0, totalDifficulty: 0, count: 0 }
    cat.totalDifficulty += record.difficulty
    cat.count++
    if (record.nextReviewDate <= now) cat.due++
    categoryMap.set(question.categoryId, cat)
  }

  const categories = await db.categories.toArray()
  const categoryNameMap = new Map(categories.map(c => [c.id, c]))

  return Array.from(categoryMap.entries())
    .map(([categoryId, data]) => ({
      categoryId,
      categoryName: categoryNameMap.get(categoryId)?.nameEn || categoryId,
      dueCount: data.due,
      averageDifficulty: data.count > 0 ? data.totalDifficulty / data.count : 5,
    }))
    .filter(c => c.dueCount > 0)
    .sort((a, b) => b.averageDifficulty - a.averageDifficulty)
    .slice(0, limit)
}

export interface CategoryMastery {
  categoryId: string
  mastered: number
  reviewing: number
  learning: number
  new: number
  total: number
  masteryPercent: number
  retention: number
}

export async function getMasteryByCategory(): Promise<Record<string, CategoryMastery>> {
  const records = await db.learningRecords
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  if (records.length === 0) {
    return {}
  }

  const allQuestionIds = records.map(r => r.questionId)
  const questions = await db.questions.bulkGet(allQuestionIds)
  const questionMap = new Map(
    questions.filter((q): q is NonNullable<typeof q> => q !== undefined).map(q => [q.id, q])
  )

  const categoryData = new Map<string, {
    mastered: number
    reviewing: number
    learning: number
    new: number
    total: number
    correctCount: number
    totalAttempts: number
  }>()

  for (const record of records) {
    const question = questionMap.get(record.questionId)
    if (!question) continue

    const catId = question.categoryId
    const data = categoryData.get(catId) || {
      mastered: 0,
      reviewing: 0,
      learning: 0,
      new: 0,
      total: 0,
      correctCount: 0,
      totalAttempts: 0,
    }

    const level = getMasteryLevel(record)
    switch (level) {
      case 'mastered':
        data.mastered++
        break
      case 'reviewing':
        data.reviewing++
        break
      case 'learning':
        data.learning++
        break
      case 'new':
        data.new++
        break
    }

    data.total++
    data.totalAttempts++
    categoryData.set(catId, data)
  }

  const attempts = await db.attempts
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .toArray()

  const recentAttempts = attempts.filter(a => {
    const attemptDate = new Date(a.createdAt)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return attemptDate >= sevenDaysAgo
  })

  for (const attempt of recentAttempts) {
    const question = questionMap.get(attempt.questionId)
    if (!question) continue

    const catId = question.categoryId
    const data = categoryData.get(catId)
    if (!data) continue

    data.totalAttempts++
    if (attempt.isCorrect) {
      data.correctCount++
    }
  }

  const result: Record<string, CategoryMastery> = {}
  for (const [categoryId, data] of categoryData.entries()) {
    const masteryPercent = data.total > 0
      ? Math.round((data.mastered / data.total) * 100)
      : 0
    const retention = data.totalAttempts > 0
      ? Math.round((data.correctCount / data.totalAttempts) * 100)
      : 0

    result[categoryId] = {
      categoryId,
      mastered: data.mastered,
      reviewing: data.reviewing,
      learning: data.learning,
      new: data.new,
      total: data.total,
      masteryPercent,
      retention,
    }
  }

  return result
}
