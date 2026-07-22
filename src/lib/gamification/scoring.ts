import type { Difficulty } from '@/lib/db/types'

export interface ScoringParams {
  difficulty: Difficulty
  timeSpent: number
  hintsUsed: number
  isCorrect: boolean
  currentStreak: number
}

export interface ScoringResult {
  basePoints: number
  timeBonus: number
  hintPenalty: number
  streakBonus: number
  totalPoints: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
}

const BASE_POINTS: Record<Difficulty, number> = {
  basic: 10,
  intermediate: 25,
  advanced: 50,
  senior: 100,
}

const TIME_BONUS_THRESHOLD_SECONDS = 120
const MAX_TIME_BONUS = 0.1

const HINT_PENALTIES: Record<number, number> = {
  0: 0,
  1: 0.1,
  2: 0.25,
  3: 0.5,
}

const STREAK_BONUSES = [
  { streak: 7, bonus: 0.1 },
  { streak: 14, bonus: 0.15 },
  { streak: 30, bonus: 0.25 },
  { streak: 60, bonus: 0.35 },
  { streak: 100, bonus: 0.5 },
]

export function calculateScore(params: ScoringParams): ScoringResult {
  const { difficulty, timeSpent, hintsUsed, isCorrect, currentStreak } = params

  if (!isCorrect) {
    return {
      basePoints: 0,
      timeBonus: 0,
      hintPenalty: 0,
      streakBonus: 0,
      totalPoints: 0,
      grade: 'D',
    }
  }

  const basePoints = BASE_POINTS[difficulty]

  let timeBonus = 0
  if (timeSpent <= TIME_BONUS_THRESHOLD_SECONDS) {
    timeBonus = Math.round(basePoints * MAX_TIME_BONUS)
  }

  const hintPenalty = Math.round(basePoints * (HINT_PENALTIES[hintsUsed] ?? 0.5))

  let streakBonus = 0
  for (const sb of STREAK_BONUSES) {
    if (currentStreak >= sb.streak) {
      streakBonus = Math.round(basePoints * sb.bonus)
    }
  }

  const totalPoints = Math.max(0, basePoints + timeBonus - hintPenalty + streakBonus)

  const maxPossible = basePoints * 1.6
  const percentage = maxPossible > 0 ? totalPoints / maxPossible : 0

  let grade: 'S' | 'A' | 'B' | 'C' | 'D'
  if (percentage >= 0.95) grade = 'S'
  else if (percentage >= 0.8) grade = 'A'
  else if (percentage >= 0.65) grade = 'B'
  else if (percentage >= 0.5) grade = 'C'
  else grade = 'D'

  return {
    basePoints,
    timeBonus,
    hintPenalty,
    streakBonus,
    totalPoints,
    grade,
  }
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getGradeColor(grade: 'S' | 'A' | 'B' | 'C' | 'D'): string {
  switch (grade) {
    case 'S':
      return 'text-purple-500'
    case 'A':
      return 'text-green-500'
    case 'B':
      return 'text-blue-500'
    case 'C':
      return 'text-yellow-500'
    case 'D':
      return 'text-red-500'
  }
}

export function getGradeLabel(grade: 'S' | 'A' | 'B' | 'C' | 'D', language: 'en' | 'es' = 'en'): string {
  const labels: Record<string, Record<string, string>> = {
    en: {
      S: 'Outstanding!',
      A: 'Excellent',
      B: 'Good',
      C: 'Fair',
      D: 'Needs Practice',
    },
    es: {
      S: '¡Excepcional!',
      A: 'Excelente',
      B: 'Bueno',
      C: 'Regular',
      D: 'Necesita Práctica',
    },
  }
  return labels[language][grade]
}
