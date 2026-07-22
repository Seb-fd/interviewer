export interface Resource {
  title: string
  url: string
  type: 'documentation' | 'tutorial' | 'article' | 'video'
}

export interface Profile {
  id: string
  username: string
  email: string
  avatarUrl?: string
  createdAt: string
  lastActiveAt: string
}

export interface Category {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  icon: string
  color: string
  type: 'project' | 'tech'
  order: number
}

export interface Question {
  id: string
  categoryId: string
  slug: string
  titleEn: string
  titleEs: string
  descriptionEn: string
  descriptionEs: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'senior'
  type: 'conceptual' | 'coding' | 'multiple_choice'
  points: number
  language?: string
  hintsEn: string[]
  hintsEs: string[]
  solutionEn: string
  solutionEs: string
  explanationEn?: string
  explanationEs?: string
  contextEn?: string
  contextEs?: string
  starterCode?: string
  tags?: string[]
  resources?: Resource[]
}

export interface UserProgress {
  id: string
  oderId: string
  categoryId: string
  completedQuestions: string[]
  correctCount: number
  totalScore: number
  accuracy: number
  bestStreak: number
  avgTimeSpent: number
  startedAt: string
  completedAt?: string
}

export interface Badge {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  icon: string
  tier: BadgeTier
  type: BadgeType
  requirement: Record<string, unknown>
}

export interface UserBadge {
  id: string
  oderId: string
  badgeId: string
  earnedAt: string
}

export interface DailyActivity {
  id: string
  oderId: string
  date: string
  questionsAttempted: number
  questionsCorrect: number
  totalScore: number
  timeSpent: number
}

export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'senior'
export type QuestionType = 'conceptual' | 'coding' | 'multiple_choice'
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type BadgeType = 'streak' | 'volume' | 'accuracy' | 'speed' | 'category' | 'learning' | 'confidence'

export type Confidence = 'know' | 'uncertain' | 'dont-know'

export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered'

export type Rating = 1 | 2 | 3 | 4

export interface FSRSState {
  stability: number
  difficulty: number
  retrievability: number
  state: MasteryLevel
  lapses: number
}

export const RATING_LABELS: Record<Rating, { en: string; es: string }> = {
  1: { en: 'Again', es: 'Otra vez' },
  2: { en: 'Hard', es: 'Difícil' },
  3: { en: 'Good', es: 'Bien' },
  4: { en: 'Easy', es: 'Fácil' },
}

export function confidenceToRating(confidence: Confidence | undefined, isCorrect: boolean): Rating {
  if (!isCorrect) return 1

  switch (confidence) {
    case 'know':
      return 4
    case 'uncertain':
      return 3
    case 'dont-know':
      return 2
    default:
      return 3
  }
}

export function ratingToConfidence(rating: Rating): Confidence | undefined {
  switch (rating) {
    case 4:
      return 'know'
    case 3:
      return 'uncertain'
    case 2:
      return 'dont-know'
    default:
      return undefined
  }
}

export interface Attempt {
  id: string
  oderId: string
  questionId: string
  answer: string
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
  scoreEarned: number
  confidence?: Confidence
  createdAt: string
}

export interface LearningRecord {
  oderId: string
  questionId: string
  stability: number
  difficulty: number
  retrievability: number
  state: MasteryLevel
  lapses: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string
}

export const DEFAULT_FSRS_STATE: Omit<LearningRecord, 'oderId' | 'questionId' | 'nextReviewDate' | 'lastReviewDate'> = {
  stability: 0,
  difficulty: 5,
  retrievability: 0,
  state: 'new',
  lapses: 0,
  repetitions: 0,
}
