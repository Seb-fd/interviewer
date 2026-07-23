import { describe, it, expect } from 'vitest'
import { calculateScore, calculateAccuracy } from '@/lib/gamification/scoring'

describe('calculateScore', () => {
  describe('base points by difficulty', () => {
    it('returns 10 points for basic difficulty', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.basePoints).toBe(10)
    })

    it('returns 25 points for intermediate difficulty', () => {
      const result = calculateScore({
        difficulty: 'intermediate',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.basePoints).toBe(25)
    })

    it('returns 50 points for advanced difficulty', () => {
      const result = calculateScore({
        difficulty: 'advanced',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.basePoints).toBe(50)
    })

    it('returns 100 points for senior difficulty', () => {
      const result = calculateScore({
        difficulty: 'senior',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.basePoints).toBe(100)
    })
  })

  describe('time bonus', () => {
    it('applies 10% time bonus when answered within 120 seconds', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.timeBonus).toBe(1)
    })

    it('does not apply time bonus when taking longer than 120 seconds', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 180,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.timeBonus).toBe(0)
    })
  })

  describe('hint penalty', () => {
    it('applies no penalty with 0 hints', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.hintPenalty).toBe(0)
    })

    it('applies 10% penalty with 1 hint', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 1,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.hintPenalty).toBe(1)
    })

    it('applies 25% penalty with 2 hints', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 2,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.hintPenalty).toBe(3) // Math.round(10 * 0.25) = 3
    })

    it('applies 50% penalty with 3 or more hints', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 3,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.hintPenalty).toBe(5)
    })
  })

  describe('streak bonus', () => {
    it('applies no streak bonus with 0 streak', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.streakBonus).toBe(0)
    })

    it('applies 10% streak bonus at 7 days', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 7,
      })
      expect(result.streakBonus).toBe(1)
    })

    it('applies 15% streak bonus at 14 days', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 14,
      })
      expect(result.streakBonus).toBe(2)
    })

    it('applies 25% streak bonus at 30 days', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 30,
      })
      expect(result.streakBonus).toBe(3)
    })
  })

  describe('incorrect answers', () => {
    it('returns 0 points and grade D for incorrect answer', () => {
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: false,
        currentStreak: 0,
      })
      expect(result.totalPoints).toBe(0)
      expect(result.grade).toBe('D')
    })
  })

  describe('grade calculation', () => {
    it('returns grade S for 95%+ score', () => {
      // basic 100pts, 60s (timeBonus 10), 0 hints (penalty 0), streak 100 (bonus 50)
      // total = 100 + 10 - 0 + 50 = 160, max = 100 * 1.6 = 160, percentage = 100%
      const result = calculateScore({
        difficulty: 'senior',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 100,
      })
      expect(result.grade).toBe('S')
    })

    it('returns grade A for 80%+ score', () => {
      // basic 50pts, 60s (timeBonus 5), 0 hints (penalty 0), streak 30 (bonus 12)
      // total = 50 + 5 - 0 + 12 = 67, max = 50 * 1.6 = 80, percentage = 83.75%
      const result = calculateScore({
        difficulty: 'advanced',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 30,
      })
      expect(result.grade).toBe('A')
    })

    it('returns grade B for 65%+ score', () => {
      // basic 25pts, 60s (timeBonus 2), 0 hints (penalty 0), streak 14 (bonus 4)
      // total = 25 + 2 - 0 + 4 = 31, max = 25 * 1.6 = 40, percentage = 77.5%
      const result = calculateScore({
        difficulty: 'intermediate',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 14,
      })
      expect(result.grade).toBe('A')
    })

    it('returns grade C for 50%+ score', () => {
      // basic 10pts, 60s (timeBonus 1), 0 hints (penalty 0), streak 14 (bonus 2)
      // total = 10 + 1 - 0 + 2 = 13, max = 10 * 1.6 = 16, percentage = 81.25%
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 60,
        hintsUsed: 0,
        isCorrect: true,
        currentStreak: 14,
      })
      expect(result.grade).toBe('A')
    })

    it('returns grade D for below 50% score', () => {
      // basic 10pts, 180s (timeBonus 0), 3 hints (penalty 5), streak 0 (bonus 0)
      // total = 10 + 0 - 5 + 0 = 5, max = 10 * 1.6 = 16, percentage = 31.25%
      const result = calculateScore({
        difficulty: 'basic',
        timeSpent: 180,
        hintsUsed: 3,
        isCorrect: true,
        currentStreak: 0,
      })
      expect(result.grade).toBe('D')
    })
  })
})

describe('calculateAccuracy', () => {
  it('calculates accuracy correctly', () => {
    expect(calculateAccuracy(8, 10)).toBe(80)
  })

  it('returns 0 for no questions', () => {
    expect(calculateAccuracy(0, 0)).toBe(0)
  })
})
