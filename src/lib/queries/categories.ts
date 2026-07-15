import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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
  totalQuestions: number
}

const mockCategories: Category[] = [
  { id: '1', slug: 'password-manager', nameEn: 'Password Manager', nameEs: 'Gestor de Contraseñas', descriptionEn: 'Security, encryption, zero-knowledge auth', descriptionEs: 'Seguridad, cifrado, autenticación zero-knowledge', icon: 'Shield', color: '#ef4444', type: 'project', totalQuestions: 25 },
  { id: '2', slug: 'social-media-app', nameEn: 'Social Media App', nameEs: 'App de Redes Sociales', descriptionEn: 'Server Actions, real-time notifications', descriptionEs: 'Server Actions, notificaciones real-time', icon: 'Users', color: '#3b82f6', type: 'project', totalQuestions: 25 },
  { id: '3', slug: 'multiplayer-mini-game', nameEn: 'Multiplayer Mini Game', nameEs: 'Juego Multiplayer', descriptionEn: 'Socket.io, game state sync', descriptionEs: 'Socket.io, sincronización de estado', icon: 'Zap', color: '#22c55e', type: 'project', totalQuestions: 20 },
  { id: '4', slug: 'gitanas-ecommerce', nameEn: 'Gitanas E-commerce', nameEs: 'Gitanas E-commerce', descriptionEn: 'POS, inventory, cart system', descriptionEs: 'POS, inventario, sistema de carrito', icon: 'ShoppingCart', color: '#a855f7', type: 'project', totalQuestions: 25 },
  { id: '5', slug: 'hermit-bar', nameEn: 'Hermit Bar', nameEs: 'Hermit Bar', descriptionEn: 'i18n, SEO, animations', descriptionEs: 'i18n, SEO, animaciones', icon: 'Glass', color: '#f97316', type: 'project', totalQuestions: 15 },
  { id: '6', slug: 'react-hooks', nameEn: 'React & Hooks', nameEs: 'React & Hooks', descriptionEn: 'useState, useEffect, custom hooks', descriptionEs: 'useState, useEffect, hooks personalizados', icon: 'BookOpen', color: '#06b6d4', type: 'tech', totalQuestions: 10 },
  { id: '7', slug: 'nextjs', nameEn: 'Next.js', nameEs: 'Next.js', descriptionEn: 'Server Components, Actions', descriptionEs: 'Server Components, Actions', icon: 'Code', color: '#64748b', type: 'tech', totalQuestions: 10 },
  { id: '8', slug: 'database-prisma', nameEn: 'Database & Prisma', nameEs: 'Database & Prisma', descriptionEn: 'PostgreSQL, schema design', descriptionEs: 'PostgreSQL, diseño de schema', icon: 'Database', color: '#6366f1', type: 'tech', totalQuestions: 10 },
  { id: '9', slug: 'security-auth', nameEn: 'Security & Auth', nameEs: 'Seguridad & Auth', descriptionEn: 'JWT, OAuth, encryption', descriptionEs: 'JWT, OAuth, cifrado', icon: 'Lock', color: '#ef4444', type: 'tech', totalQuestions: 10 },
  { id: '10', slug: 'realtime-systems', nameEn: 'Real-time Systems', nameEs: 'Sistemas Real-time', descriptionEn: 'WebSockets, Socket.io', descriptionEs: 'WebSockets, Socket.io', icon: 'Wifi', color: '#eab308', type: 'tech', totalQuestions: 10 },
  { id: '11', slug: 'state-management', nameEn: 'State Management', nameEs: 'Gestión de Estado', descriptionEn: 'Zustand, Context API, React Query', descriptionEs: 'Zustand, Context API, React Query', icon: 'Layers', color: '#8b5cf6', type: 'tech', totalQuestions: 10 },
  { id: '12', slug: 'testing-cicd', nameEn: 'Testing & CI/CD', nameEs: 'Testing & CI/CD', descriptionEn: 'Vitest, Playwright, GitHub Actions', descriptionEs: 'Vitest, Playwright, GitHub Actions', icon: 'TestTube', color: '#22c55e', type: 'tech', totalQuestions: 8 },
]

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return mockCategories
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return mockCategories
  }

  return data.map((cat: any) => ({
    id: cat.id,
    slug: cat.slug,
    nameEn: cat.name_en,
    nameEs: cat.name_es,
    descriptionEn: cat.description_en,
    descriptionEs: cat.description_es,
    icon: cat.icon,
    color: cat.color,
    type: cat.type,
    totalQuestions: 0,
  }))
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured) {
    return mockCategories.find((c: Category) => c.slug === slug) || null
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return mockCategories.find((c: Category) => c.slug === slug) || null
  }

  return {
    id: data.id,
    slug: data.slug,
    nameEn: data.name_en,
    nameEs: data.name_es,
    descriptionEn: data.description_en,
    descriptionEs: data.description_es,
    icon: data.icon,
    color: data.color,
    type: data.type,
    totalQuestions: 0,
  }
}

export async function getCategoryQuestionCount(categoryId: string): Promise<number> {
  if (!isSupabaseConfigured) {
    return 0
  }

  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)

  if (error) {
    console.error('Error counting questions:', error)
    return 0
  }

  return count || 0
}
