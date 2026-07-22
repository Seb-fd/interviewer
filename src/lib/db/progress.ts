import { db, LOCAL_USER_ID } from './index'
import type { Confidence, UserProgress, Attempt } from './types'

export async function getUserProgress(): Promise<UserProgress[]> {
  return db.userProgress.where('oderId').equals(LOCAL_USER_ID).toArray()
}

export async function getCategoryProgress(categoryId: string): Promise<UserProgress | undefined> {
  return db.userProgress
    .where('[oderId+categoryId]')
    .equals([LOCAL_USER_ID, categoryId])
    .first()
}

export async function getAllProgress(): Promise<{
  totalScore: number
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  categoryProgress: Map<string, UserProgress>
}> {
  const progressList = await getUserProgress()
  
  let totalScore = 0
  let totalQuestions = 0
  let correctAnswers = 0
  const categoryProgress = new Map<string, UserProgress>()
  
  for (const progress of progressList) {
    totalScore += progress.totalScore
    totalQuestions += progress.completedQuestions.length
    correctAnswers += progress.correctCount
    categoryProgress.set(progress.categoryId, progress)
  }
  
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  
  return {
    totalScore,
    totalQuestions,
    correctAnswers,
    accuracy,
    categoryProgress,
  }
}

export async function saveProgress(
  categoryId: string,
  data: Partial<UserProgress>
): Promise<void> {
  const existing = await getCategoryProgress(categoryId)
  
  if (existing) {
    await db.userProgress.update(existing.id, data)
  } else {
    await db.userProgress.add({
      id: crypto.randomUUID(),
      oderId: LOCAL_USER_ID,
      categoryId,
      completedQuestions: [],
      correctCount: 0,
      totalScore: 0,
      accuracy: 0,
      bestStreak: 0,
      avgTimeSpent: 0,
      startedAt: new Date().toISOString(),
      ...data,
    })
  }
}

export async function markQuestionCompleted(
  categoryId: string,
  questionId: string,
  isCorrect: boolean,
  scoreEarned: number,
  timeSpent: number
): Promise<void> {
  const existing = await getCategoryProgress(categoryId)
  
  if (existing) {
    if (existing.completedQuestions.includes(questionId)) {
      return
    }
    
    const completedQuestions = [...existing.completedQuestions, questionId]
    const correctCount = isCorrect ? existing.correctCount + 1 : existing.correctCount
    const totalQuestions = completedQuestions.length
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const totalScore = existing.totalScore + (isCorrect ? scoreEarned : 0)
    const avgTimeSpent = Math.round(
      (existing.avgTimeSpent * (totalQuestions - 1) + timeSpent) / totalQuestions
    )
    
    await db.userProgress.update(existing.id, {
      completedQuestions,
      correctCount,
      totalScore,
      accuracy,
      avgTimeSpent,
    })
  } else {
    await db.userProgress.add({
      id: crypto.randomUUID(),
      oderId: LOCAL_USER_ID,
      categoryId,
      completedQuestions: [questionId],
      correctCount: isCorrect ? 1 : 0,
      totalScore: isCorrect ? scoreEarned : 0,
      accuracy: isCorrect ? 100 : 0,
      bestStreak: 0,
      avgTimeSpent: timeSpent,
      startedAt: new Date().toISOString(),
    })
  }
}

export async function recordAttempt(params: {
  questionId: string
  categoryId: string
  answer: string
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
  scoreEarned: number
  confidence?: Confidence
}): Promise<string> {
  const { questionId, categoryId, answer, isCorrect, timeSpent, hintsUsed, scoreEarned, confidence } = params
  
  const attemptId = crypto.randomUUID()
  
  await db.attempts.add({
    id: attemptId,
    oderId: LOCAL_USER_ID,
    questionId,
    answer,
    isCorrect,
    timeSpent,
    hintsUsed,
    scoreEarned,
    confidence,
    createdAt: new Date().toISOString(),
  })
  
  await markQuestionCompleted(categoryId, questionId, isCorrect, scoreEarned, timeSpent)
  
  return attemptId
}

export async function getAttempts(questionId?: string): Promise<Attempt[]> {
  if (questionId) {
    return db.attempts
      .where('[oderId+questionId]')
      .equals([LOCAL_USER_ID, questionId])
      .reverse()
      .sortBy('createdAt')
  }
  
  return db.attempts
    .where('oderId')
    .equals(LOCAL_USER_ID)
    .reverse()
    .sortBy('createdAt')
}

export async function getAttemptCount(): Promise<number> {
  return db.attempts.where('oderId').equals(LOCAL_USER_ID).count()
}

export async function getCorrectAttemptCount(): Promise<number> {
  const attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
  return attempts.filter(a => a.isCorrect).length
}

export async function getAverageTimeSpent(): Promise<number> {
  const attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
  if (attempts.length === 0) return 0
  
  const totalTime = attempts.reduce((sum, a) => sum + a.timeSpent, 0)
  return Math.round(totalTime / attempts.length)
}

export async function getFastestCorrectAttempt(questionId?: string): Promise<number | null> {
  let attempts: Attempt[]
  
  if (questionId) {
    attempts = await db.attempts
      .where('[oderId+questionId]')
      .equals([LOCAL_USER_ID, questionId])
      .toArray()
  } else {
    attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
  }
  
  const correctAttempts = attempts.filter(a => a.isCorrect)
  if (correctAttempts.length === 0) return null
  
  return Math.min(...correctAttempts.map(a => a.timeSpent))
}

export async function resetAllProgress(): Promise<void> {
  await db.transaction('rw', db.userProgress, db.attempts, async () => {
    await db.userProgress.where('oderId').equals(LOCAL_USER_ID).delete()
    await db.attempts.where('oderId').equals(LOCAL_USER_ID).delete()
  })
}

export async function isQuestionCompleted(questionId: string): Promise<boolean> {
  const attempts = await db.attempts
    .where('[oderId+questionId]')
    .equals([LOCAL_USER_ID, questionId])
    .toArray()
  
  return attempts.some(a => a.isCorrect)
}

export async function getCompletedQuestionIds(): Promise<string[]> {
  const attempts = await db.attempts.where('oderId').equals(LOCAL_USER_ID).toArray()
  const completed = new Set<string>()
  
  for (const attempt of attempts) {
    if (attempt.isCorrect) {
      completed.add(attempt.questionId)
    }
  }
  
  return Array.from(completed)
}
