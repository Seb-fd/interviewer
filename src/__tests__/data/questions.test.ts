import { describe, it, expect } from 'vitest'
import { mockQuestions } from '@/data/questions'
import { extraPasswordManagerQuestions } from '@/data/extra-questions-pm'
import { extraSocialMediaQuestions } from '@/data/extra-questions-sma'
import { extraMultiplayerGameQuestions } from '@/data/extra-questions-mmg'
import { extraEcommerceQuestions } from '@/data/extra-questions-ecom'
import { extraHermitBarQuestions } from '@/data/extra-questions-hb'
import { extraTechQuestions } from '@/data/extra-questions-tech'

describe('Questions data integrity', () => {
  it('all questions have required fields', () => {
    for (const q of mockQuestions) {
      expect(q.id, `missing id`).toBeTruthy()
      expect(q.slug, `${q.id} missing slug`).toBeTruthy()
      expect(q.titleEn, `${q.id} missing titleEn`).toBeTruthy()
      expect(q.titleEs, `${q.id} missing titleEs`).toBeTruthy()
      expect(q.descriptionEn, `${q.id} missing descriptionEn`).toBeTruthy()
      expect(q.descriptionEs, `${q.id} missing descriptionEs`).toBeTruthy()
      expect(q.solutionEn, `${q.id} missing solutionEn`).toBeTruthy()
      expect(q.solutionEs, `${q.id} missing solutionEs`).toBeTruthy()
      expect(q.hintsEn.length, `${q.id} missing hintsEn`).toBeGreaterThan(0)
      expect(q.hintsEs.length, `${q.id} missing hintsEs`).toBeGreaterThan(0)
      expect(['basic', 'intermediate', 'advanced', 'senior']).toContain(q.difficulty)
      expect(['conceptual', 'coding', 'multiple_choice']).toContain(q.type)
    }
  })

  it('all ids are unique', () => {
    const ids = new Set(mockQuestions.map(q => q.id))
    expect(ids.size).toBe(mockQuestions.length)
  })

  it('all extra question arrays contribute', () => {
    expect(extraPasswordManagerQuestions.length).toBeGreaterThan(0)
    expect(extraSocialMediaQuestions.length).toBeGreaterThan(0)
    expect(extraMultiplayerGameQuestions.length).toBeGreaterThan(0)
    expect(extraEcommerceQuestions.length).toBeGreaterThan(0)
    expect(extraHermitBarQuestions.length).toBeGreaterThan(0)
    expect(extraTechQuestions.length).toBeGreaterThan(0)
  })

  it('all slugs are from known categories', () => {
    const validSlugs = new Set([
      'password-manager', 'social-media-app', 'multiplayer-mini-game',
      'gitanas-ecommerce', 'hermit-bar', 'react-hooks', 'state-management',
      'nextjs', 'database-prisma', 'security-auth', 'realtime-systems', 'testing-cicd',
    ])
    for (const q of mockQuestions) {
      expect(validSlugs.has(q.slug), `invalid slug: ${q.slug} in ${q.id}`).toBe(true)
    }
  })

  it('has at least 100 questions', () => {
    expect(mockQuestions.length).toBeGreaterThanOrEqual(100)
  })
})
