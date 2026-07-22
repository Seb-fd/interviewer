import { db, LOCAL_USER_ID } from './index'
import { mockQuestions } from '@/data/questions'
import type { Category, Question, Badge, Profile } from './types'

const mockCategories: Omit<Category, 'order'>[] = [
  { id: 'cat-1', slug: 'password-manager', nameEn: 'Password Manager', nameEs: 'Gestor de Contraseñas', descriptionEn: 'Security, encryption, zero-knowledge auth', descriptionEs: 'Seguridad, cifrado, autenticación zero-knowledge', icon: 'Shield', color: '#ef4444', type: 'project' },
  { id: 'cat-2', slug: 'social-media-app', nameEn: 'Social Media App', nameEs: 'App de Redes Sociales', descriptionEn: 'Server Actions, real-time notifications', descriptionEs: 'Server Actions, notificaciones real-time', icon: 'Users', color: '#3b82f6', type: 'project' },
  { id: 'cat-3', slug: 'multiplayer-mini-game', nameEn: 'Multiplayer Mini Game', nameEs: 'Juego Multiplayer', descriptionEn: 'Socket.io, game state sync', descriptionEs: 'Socket.io, sincronización de estado', icon: 'Zap', color: '#22c55e', type: 'project' },
  { id: 'cat-4', slug: 'gitanas-ecommerce', nameEn: 'Gitanas E-commerce', nameEs: 'Gitanas E-commerce', descriptionEn: 'POS, inventory, cart system', descriptionEs: 'POS, inventario, sistema de carrito', icon: 'ShoppingCart', color: '#a855f7', type: 'project' },
  { id: 'cat-5', slug: 'hermit-bar', nameEn: 'Hermit Bar', nameEs: 'Hermit Bar', descriptionEn: 'i18n, SEO, animations', descriptionEs: 'i18n, SEO, animaciones', icon: 'Glass', color: '#f97316', type: 'project' },
  { id: 'cat-6', slug: 'react-hooks', nameEn: 'React & Hooks', nameEs: 'React & Hooks', descriptionEn: 'useState, useEffect, custom hooks', descriptionEs: 'useState, useEffect, hooks personalizados', icon: 'BookOpen', color: '#06b6d4', type: 'tech' },
  { id: 'cat-7', slug: 'nextjs', nameEn: 'Next.js', nameEs: 'Next.js', descriptionEn: 'Server Components, Actions', descriptionEs: 'Server Components, Actions', icon: 'Code', color: '#64748b', type: 'tech' },
  { id: 'cat-8', slug: 'database-prisma', nameEn: 'Database & Prisma', nameEs: 'Database & Prisma', descriptionEn: 'PostgreSQL, schema design', descriptionEs: 'PostgreSQL, diseño de schema', icon: 'Database', color: '#6366f1', type: 'tech' },
  { id: 'cat-9', slug: 'security-auth', nameEn: 'Security & Auth', nameEs: 'Seguridad & Auth', descriptionEn: 'JWT, OAuth, encryption', descriptionEs: 'JWT, OAuth, cifrado', icon: 'Lock', color: '#ef4444', type: 'tech' },
  { id: 'cat-10', slug: 'realtime-systems', nameEn: 'Real-time Systems', nameEs: 'Sistemas Real-time', descriptionEn: 'WebSockets, Socket.io', descriptionEs: 'WebSockets, Socket.io', icon: 'Wifi', color: '#eab308', type: 'tech' },
  { id: 'cat-11', slug: 'state-management', nameEn: 'State Management', nameEs: 'Gestión de Estado', descriptionEn: 'Zustand, Context API, React Query', descriptionEs: 'Zustand, Context API, React Query', icon: 'Layers', color: '#8b5cf6', type: 'tech' },
  { id: 'cat-12', slug: 'testing-cicd', nameEn: 'Testing & CI/CD', nameEs: 'Testing & CI/CD', descriptionEn: 'Vitest, Playwright, GitHub Actions', descriptionEs: 'Vitest, Playwright, GitHub Actions', icon: 'TestTube', color: '#22c55e', type: 'tech' },
]

const mockBadges: Badge[] = [
  { id: 'badge-1', slug: 'first-blood', nameEn: 'First Blood', nameEs: 'Primera Sangre', descriptionEn: 'Answer your first question correctly', descriptionEs: 'Responde tu primera pregunta correctamente', icon: 'Trophy', tier: 'bronze', type: 'volume', requirement: { count: 1 } },
  { id: 'badge-2', slug: 'learning-begins', nameEn: 'Learning Begins', nameEs: 'Comienza el Aprendizaje', descriptionEn: 'Complete 10 questions', descriptionEs: 'Completa 10 preguntas', icon: 'BookOpen', tier: 'bronze', type: 'volume', requirement: { count: 10 } },
  { id: 'badge-3', slug: 'getting-started', nameEn: 'Getting Started', nameEs: 'Primeros Pasos', descriptionEn: 'Complete 25 questions', descriptionEs: 'Completa 25 preguntas', icon: 'Star', tier: 'bronze', type: 'volume', requirement: { count: 25 } },
  { id: 'badge-4', slug: 'dedicated', nameEn: 'Dedicated', nameEs: 'Dedicado', descriptionEn: 'Complete 50 questions', descriptionEs: 'Completa 50 preguntas', icon: 'Award', tier: 'bronze', type: 'volume', requirement: { count: 50 } },
  { id: 'badge-5', slug: 'committed', nameEn: 'Committed', nameEs: 'Comprometido', descriptionEn: 'Complete 100 questions', descriptionEs: 'Completa 100 preguntas', icon: 'Medal', tier: 'silver', type: 'volume', requirement: { count: 100 } },
  { id: 'badge-6', slug: 'streak-3', nameEn: 'Streak Starter', nameEs: 'Iniciador de Racha', descriptionEn: 'Maintain a 3-day streak', descriptionEs: 'Mantén un streak de 3 días', icon: 'Flame', tier: 'bronze', type: 'streak', requirement: { days: 3 } },
  { id: 'badge-7', slug: 'streak-7', nameEn: 'Week Warrior', nameEs: 'Guerrero Semanal', descriptionEn: 'Maintain a 7-day streak', descriptionEs: 'Mantén un streak de 7 días', icon: 'Flame', tier: 'silver', type: 'streak', requirement: { days: 7 } },
  { id: 'badge-8', slug: 'streak-14', nameEn: 'Fortnight Fighter', nameEs: 'Luchador Quincenal', descriptionEn: 'Maintain a 14-day streak', descriptionEs: 'Mantén un streak de 14 días', icon: 'Flame', tier: 'silver', type: 'streak', requirement: { days: 14 } },
  { id: 'badge-9', slug: 'streak-30', nameEn: 'Month Master', nameEs: 'Maestro del Mes', descriptionEn: 'Maintain a 30-day streak', descriptionEs: 'Mantén un streak de 30 días', icon: 'Flame', tier: 'gold', type: 'streak', requirement: { days: 30 } },
  { id: 'badge-10', slug: 'streak-60', nameEn: 'Unstoppable', nameEs: 'Imparable', descriptionEn: 'Maintain a 60-day streak', descriptionEs: 'Mantén un streak de 60 días', icon: 'Flame', tier: 'gold', type: 'streak', requirement: { days: 60 } },
  { id: 'badge-11', slug: 'streak-100', nameEn: 'Legend', nameEs: 'Leyenda', descriptionEn: 'Maintain a 100-day streak', descriptionEs: 'Mantén un streak de 100 días', icon: 'Flame', tier: 'platinum', type: 'streak', requirement: { days: 100 } },
  { id: 'badge-12', slug: 'pm-master', nameEn: 'Password Manager Master', nameEs: 'Maestro del Gestor de Contraseñas', descriptionEn: 'Complete all Password Manager questions', descriptionEs: 'Completa todas las preguntas del Gestor de Contraseñas', icon: 'Shield', tier: 'gold', type: 'category', requirement: { categorySlug: 'password-manager' } },
  { id: 'badge-13', slug: 'ss-master', nameEn: 'Social Media Master', nameEs: 'Maestro de Redes Sociales', descriptionEn: 'Complete all Social Media questions', descriptionEs: 'Completa todas las preguntas de Redes Sociales', icon: 'Users', tier: 'gold', type: 'category', requirement: { categorySlug: 'social-media-app' } },
  { id: 'badge-14', slug: 'game-master', nameEn: 'Game Master', nameEs: 'Maestro del Juego', descriptionEn: 'Complete all Multiplayer Game questions', descriptionEs: 'Completa todas las preguntas de Juegos Multiplayer', icon: 'Zap', tier: 'gold', type: 'category', requirement: { categorySlug: 'multiplayer-mini-game' } },
  { id: 'badge-15', slug: 'commerce-master', nameEn: 'Commerce Master', nameEs: 'Maestro del Comercio', descriptionEn: 'Complete all E-commerce questions', descriptionEs: 'Completa todas las preguntas de E-commerce', icon: 'ShoppingCart', tier: 'gold', type: 'category', requirement: { categorySlug: 'gitanas-ecommerce' } },
  { id: 'badge-16', slug: 'landing-master', nameEn: 'Landing Page Master', nameEs: 'Maestro de Landing Pages', descriptionEn: 'Complete all Hermit Bar questions', descriptionEs: 'Completa todas las preguntas de Hermit Bar', icon: 'Glass', tier: 'gold', type: 'category', requirement: { categorySlug: 'hermit-bar' } },
  { id: 'badge-17', slug: 'react-pro', nameEn: 'React Pro', nameEs: 'React Pro', descriptionEn: 'Complete all React & Hooks questions', descriptionEs: 'Completa todas las preguntas de React & Hooks', icon: 'BookOpen', tier: 'silver', type: 'category', requirement: { categorySlug: 'react-hooks' } },
  { id: 'badge-18', slug: 'next-ninja', nameEn: 'Next.js Ninja', nameEs: 'Ninja de Next.js', descriptionEn: 'Complete all Next.js questions', descriptionEs: 'Completa todas las preguntas de Next.js', icon: 'Code', tier: 'silver', type: 'category', requirement: { categorySlug: 'nextjs' } },
  { id: 'badge-19', slug: 'database-wizard', nameEn: 'Database Wizard', nameEs: 'Mago de Bases de Datos', descriptionEn: 'Complete all Database questions', descriptionEs: 'Completa todas las preguntas de Database', icon: 'Database', tier: 'silver', type: 'category', requirement: { categorySlug: 'database-prisma' } },
  { id: 'badge-20', slug: 'security-guardian', nameEn: 'Security Guardian', nameEs: 'Guardián de la Seguridad', descriptionEn: 'Complete all Security questions', descriptionEs: 'Completa todas las preguntas de Seguridad', icon: 'Lock', tier: 'silver', type: 'category', requirement: { categorySlug: 'security-auth' } },
  { id: 'badge-21', slug: 'realtime-expert', nameEn: 'Realtime Expert', nameEs: 'Experto en Tiempo Real', descriptionEn: 'Complete all Real-time Systems questions', descriptionEs: 'Completa todas las preguntas de Sistemas Real-time', icon: 'Wifi', tier: 'silver', type: 'category', requirement: { categorySlug: 'realtime-systems' } },
  { id: 'badge-22', slug: 'testing-champion', nameEn: 'Testing Champion', nameEs: 'Campeón del Testing', descriptionEn: 'Complete all Testing questions', descriptionEs: 'Completa todas las preguntas de Testing', icon: 'TestTube', tier: 'silver', type: 'category', requirement: { categorySlug: 'testing-cicd' } },
  { id: 'badge-23', slug: 'perfectionist', nameEn: 'Perfectionist', nameEs: 'Perfeccionista', descriptionEn: 'Achieve 100% accuracy in any category', descriptionEs: 'Logra 100% de precisión en cualquier categoría', icon: 'Target', tier: 'silver', type: 'accuracy', requirement: { accuracy: 100 } },
  { id: 'badge-24', slug: 'sharp-shooter', nameEn: 'Sharp Shooter', nameEs: 'Tirador Experto', descriptionEn: 'Achieve 80% or higher accuracy', descriptionEs: 'Logra 80% o más de precisión', icon: 'Target', tier: 'bronze', type: 'accuracy', requirement: { accuracy: 80 } },
  { id: 'badge-25', slug: 'speed-demon', nameEn: 'Speed Demon', nameEs: 'Demonio de la Velocidad', descriptionEn: 'Complete a senior question in under 2 minutes', descriptionEs: 'Completa una pregunta senior en menos de 2 minutos', icon: 'Zap', tier: 'platinum', type: 'speed', requirement: { seconds: 120 } },
  { id: 'badge-26', slug: 'state-master', nameEn: 'State Management Master', nameEs: 'Maestro de Gestión de Estado', descriptionEn: 'Complete all State Management questions', descriptionEs: 'Completa todas las preguntas de Gestión de Estado', icon: 'Layers', tier: 'silver', type: 'category', requirement: { categorySlug: 'state-management' } },
  { id: 'badge-27', slug: 'first-review', nameEn: 'First Review', nameEs: 'Primera Repetición', descriptionEn: 'Complete your first spaced repetition review', descriptionEs: 'Completa tu primera repetición espaciada', icon: 'Brain', tier: 'bronze', type: 'learning', requirement: { reviews: 1 } },
  { id: 'badge-28', slug: 'consistent-learner', nameEn: 'Consistent Learner', nameEs: 'Aprendiz Consistente', descriptionEn: 'Complete reviews 7 days in a row', descriptionEs: 'Completa repasos 7 días seguidos', icon: 'Calendar', tier: 'silver', type: 'learning', requirement: { reviewStreak: 7 } },
  { id: 'badge-29', slug: 'spaced-master', nameEn: 'Spaced Repetition Master', nameEs: 'Maestro de Repetición Espaciada', descriptionEn: 'Complete 100 questions using spaced repetition', descriptionEs: 'Completa 100 preguntas usando repetición espaciada', icon: 'Clock', tier: 'gold', type: 'learning', requirement: { spacedReviews: 100 } },
  { id: 'badge-30', slug: 'confident', nameEn: 'Confident', nameEs: 'Confiado', descriptionEn: 'Answer 10 questions correctly with "I know this" confidence', descriptionEs: 'Responde 10 preguntas correctamente con "Sé la respuesta"', icon: 'CheckCircle', tier: 'silver', type: 'confidence', requirement: { confidentCorrect: 10 } },
  { id: 'badge-31', slug: 'humble-learner', nameEn: 'Humble Learner', nameEs: 'Aprendiz Humilde', descriptionEn: 'Admit "No idea" 5 times and improve afterward', descriptionEs: 'Admitió "No tengo idea" 5 veces y mejoró después', icon: 'TrendingUp', tier: 'bronze', type: 'learning', requirement: { humbleAcknowledged: 5 } },
]

function mapQuestionToDbFormat(question: typeof mockQuestions[number], categories: Map<string, string>): Question {
  const categoryId = categories.get(question.slug)
  if (!categoryId) {
    throw new Error(`Category not found for slug: ${question.slug}`)
  }
  
  return {
    id: question.id,
    categoryId,
    slug: question.slug,
    titleEn: question.titleEn,
    titleEs: question.titleEs,
    descriptionEn: question.descriptionEn,
    descriptionEs: question.descriptionEs,
    difficulty: question.difficulty,
    type: question.type,
    points: question.points,
    language: question.language,
    hintsEn: question.hintsEn,
    hintsEs: question.hintsEs,
    solutionEn: question.solutionEn,
    solutionEs: question.solutionEs,
    explanationEn: question.explanationEn,
    explanationEs: question.explanationEs,
    contextEn: question.contextEn,
    contextEs: question.contextEs,
    starterCode: question.starterCode,
    tags: question.tags,
    resources: question.resources,
  }
}

export async function seedDatabase(): Promise<void> {
  const isSeeded = await db.categories.count()
  if (isSeeded > 0) {
    console.log('Database already seeded')
    return
  }
  
  console.log('Seeding database...')
  
  await db.transaction('rw', db.categories, db.questions, db.badges, db.profiles, async () => {
    const categoriesWithOrder: Category[] = mockCategories.map((cat, index) => ({
      ...cat,
      order: index,
    }))
    
    await db.categories.bulkAdd(categoriesWithOrder)
    console.log(`Added ${categoriesWithOrder.length} categories`)
    
    const categorySlugToId = new Map<string, string>()
    for (const cat of mockCategories) {
      categorySlugToId.set(cat.slug, cat.id)
    }
    
    const questions = mockQuestions.map(q => mapQuestionToDbFormat(q, categorySlugToId))
    await db.questions.bulkAdd(questions)
    console.log(`Added ${questions.length} questions`)
    
    await db.badges.bulkAdd(mockBadges)
    console.log(`Added ${mockBadges.length} badges`)
    
    const localUser: Profile = {
      id: LOCAL_USER_ID,
      username: 'Learner',
      email: 'local@user',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }
    await db.profiles.add(localUser)
    console.log('Created local user')
  })
  
  console.log('Database seeding completed!')
}

export async function checkAndSeedDatabase(): Promise<void> {
  const isSeeded = await db.categories.count()
  if (isSeeded === 0) {
    await seedDatabase()
  }
}
