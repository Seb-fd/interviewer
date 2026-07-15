import { z } from 'zod'

export const questionSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'senior']),
  type: z.enum(['conceptual', 'coding', 'multiple_choice']),
  questionEn: z.string(),
  questionEs: z.string(),
  contextEn: z.string().optional(),
  contextEs: z.string().optional(),
  starterCode: z.string().optional(),
  language: z.string().optional(),
  solutionEn: z.string(),
  solutionEs: z.string(),
  explanationEn: z.string(),
  explanationEs: z.string(),
  hint1En: z.string().optional(),
  hint1Es: z.string().optional(),
  hint2En: z.string().optional(),
  hint2Es: z.string().optional(),
  hint3En: z.string().optional(),
  hint3Es: z.string().optional(),
  points: z.number().default(10),
  tags: z.array(z.string()).default([]),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(['documentation', 'tutorial', 'article', 'video']),
  })).optional(),
})

export const submitAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, 'Answer is required'),
  timeSpent: z.number().int().positive(),
  hintsUsed: z.number().int().min(0).max(3),
})

export const categorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  nameEn: z.string(),
  nameEs: z.string(),
  descriptionEn: z.string(),
  descriptionEs: z.string(),
  icon: z.string(),
  color: z.string(),
  type: z.enum(['project', 'tech']),
  sortOrder: z.number(),
  isActive: z.boolean(),
})

export type Question = z.infer<typeof questionSchema>
export type SubmitAnswer = z.infer<typeof submitAnswerSchema>
export type Category = z.infer<typeof categorySchema>
