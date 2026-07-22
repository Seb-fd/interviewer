import type { LearningRecord, Rating, MasteryLevel, FSRSState } from './types'

export const DEFAULT_PARAMETERS = [
  0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334,
  3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835,
  0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425,
  0.0912, 0.0658, 0.1542,
] as const

export const TARGET_RETENTION = 0.9

export const DECAY = -0.5
export const FACTOR = 19 / 81

export function getNextInterval(
  stability: number,
  retrievability: number,
  targetRetention: number = TARGET_RETENTION
): number {
  if (stability <= 0) return 1

  const interval = stability / FACTOR * (Math.pow(targetRetention / retrievability, 1 / DECAY) - 1)
  return Math.max(1, Math.min(interval, 36500))
}

export function calculateRetrievability(stability: number, daysSinceReview: number): number {
  if (stability <= 0 || daysSinceReview < 0) return 0

  const factor = Math.pow(0.9, -1 / DECAY) - 1
  const retrievability = Math.pow(1 + factor * (daysSinceReview / stability), DECAY)
  return Math.max(0, Math.min(1, retrievability))
}

export function calculateDaysSinceReview(lastReviewDate: string): number {
  const last = new Date(lastReviewDate)
  const now = new Date()
  const diffTime = now.getTime() - last.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return Math.max(0, diffDays)
}

export function getInitialStability(rating: Rating): number {
  const w = DEFAULT_PARAMETERS
  switch (rating) {
    case 1:
      return w[0]
    case 2:
      return w[1]
    case 3:
      return w[2]
    case 4:
      return w[3]
    default:
      return w[2]
  }
}

export function getInitialDifficulty(rating: Rating): number {
  const w = DEFAULT_PARAMETERS
  const D0G = w[4] - Math.exp(w[5] * (rating - 1)) + 1
  return Math.max(1, Math.min(10, D0G))
}

export function calculateNewStability(
  currentStability: number,
  currentDifficulty: number,
  retrievability: number,
  rating: Rating,
  w: readonly number[] = DEFAULT_PARAMETERS
): number {
  if (rating === 1) {
    const Sf = w[11] *
      Math.pow(currentDifficulty, -w[12]) *
      (Math.pow(currentStability + 1, w[13]) - 1) *
      Math.exp(w[14] * (1 - retrievability))
    return Math.max(0.1, Sf)
  }

  const SInc = Math.exp(
    w[17] * (rating - 3 + w[18]) + w[19] * Math.log(currentStability)
  )

  const stabilityIncrease = SInc - 1

  const DFactor = (10 - currentDifficulty) / 9

  const RModulator = Math.exp(w[10] * (1 - retrievability) - 1)

  const newStability = currentStability * (1 + stabilityIncrease * DFactor * RModulator)

  if (rating === 4) {
    return newStability * w[16]
  }
  if (rating === 2) {
    return newStability * w[15]
  }

  return Math.max(0.1, newStability)
}

export function calculateNewDifficulty(
  currentDifficulty: number,
  rating: Rating,
  w: readonly number[] = DEFAULT_PARAMETERS
): number {
  const D0G = w[4] - Math.exp(w[5] * (rating - 1)) + 1

  const deltaD = -w[6] * (rating - 3)
  const D1 = currentDifficulty + deltaD
  const D2 = Math.max(1, Math.min(10, D1))

  const D3 = w[7] * D0G + (1 - w[7]) * D2

  return Math.max(1, Math.min(10, D3))
}

export function getMasteryLevel(record: LearningRecord): MasteryLevel {
  if (record.repetitions === 0) {
    return 'new'
  }

  if (record.repetitions >= 5 && record.stability >= 21) {
    if (record.difficulty >= 7 || record.difficulty <= 4) {
      return 'mastered'
    }
    return 'reviewing'
  }

  return 'learning'
}

export function calculateNextReview(
  currentRecord: LearningRecord,
  rating: Rating
): LearningRecord {
  const w = DEFAULT_PARAMETERS
  const now = new Date().toISOString().split('T')[0]

  let { stability, difficulty, lapses, repetitions } = currentRecord

  const daysSinceReview = calculateDaysSinceReview(currentRecord.lastReviewDate)
  const retrievability = calculateRetrievability(stability, daysSinceReview)

  if (rating === 1) {
    lapses += 1
    stability = calculateNewStability(stability, difficulty, retrievability, rating, w)
    difficulty = calculateNewDifficulty(difficulty, rating, w)
  } else {
    stability = calculateNewStability(stability, difficulty, retrievability, rating, w)
    difficulty = calculateNewDifficulty(difficulty, rating, w)
    repetitions += 1
  }

  const newRetrievability = calculateRetrievability(stability, 0)
  const interval = getNextInterval(stability, newRetrievability)

  const nextReviewDate = getNextReviewDate(interval)

  const newRecord: LearningRecord = {
    ...currentRecord,
    stability: Math.max(0.1, stability),
    difficulty,
    retrievability: newRetrievability,
    state: 'learning',
    lapses,
    repetitions,
    nextReviewDate,
    lastReviewDate: now,
  }

  newRecord.state = getMasteryLevel(newRecord)

  return newRecord
}

export function getNextReviewDate(intervalDays: number): string {
  const date = new Date()
  date.setDate(date.getDate() + Math.round(intervalDays))
  return date.toISOString().split('T')[0]
}

export function getInitialLearningRecord(
  oderId: string,
  questionId: string,
  rating: Rating
): LearningRecord {
  const now = new Date().toISOString().split('T')[0]

  return {
    oderId,
    questionId,
    stability: getInitialStability(rating),
    difficulty: getInitialDifficulty(rating),
    retrievability: 1,
    state: 'learning',
    lapses: rating === 1 ? 1 : 0,
    repetitions: 1,
    nextReviewDate: now,
    lastReviewDate: now,
  }
}

export function fsrsStateToLearningRecord(
  oderId: string,
  questionId: string,
  state: FSRSState
): LearningRecord {
  const now = new Date().toISOString().split('T')[0]

  return {
    oderId,
    questionId,
    stability: state.stability,
    difficulty: state.difficulty,
    retrievability: state.retrievability,
    state: state.state,
    lapses: state.lapses,
    repetitions: 0,
    nextReviewDate: getNextReviewDate(state.stability),
    lastReviewDate: now,
  }
}

export function learningRecordToFSRSState(record: LearningRecord): FSRSState {
  const daysSinceReview = calculateDaysSinceReview(record.lastReviewDate)
  const retrievability = calculateRetrievability(record.stability, daysSinceReview)

  return {
    stability: record.stability,
    difficulty: record.difficulty,
    retrievability: retrievability,
    state: record.state,
    lapses: record.lapses,
  }
}
