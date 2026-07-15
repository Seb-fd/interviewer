import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface Badge {
  id: string
  slug: string
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  icon: string
  color: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  earned: boolean
  earnedAt?: string
  progress?: number
}

const mockBadges: Badge[] = [
  { id: '1', slug: 'first-blood', nameEn: 'First Blood', nameEs: 'Primera Sangre', descriptionEn: 'Answer your first question correctly', descriptionEs: 'Responde tu primera pregunta correctamente', icon: 'Trophy', color: '#cd7f32', tier: 'bronze', earned: false },
  { id: '2', slug: 'learning-begins', nameEn: 'Learning Begins', nameEs: 'Comienza el Aprendizaje', descriptionEn: 'Complete 10 questions', descriptionEs: 'Completa 10 preguntas', icon: 'BookOpen', color: '#cd7f32', tier: 'bronze', earned: false },
  { id: '3', slug: 'streak-7', nameEn: 'Week Warrior', nameEs: 'Guerrero Semanal', descriptionEn: 'Maintain a 7-day streak', descriptionEs: 'Mantén un streak de 7 días', icon: 'Flame', color: '#c0c0c0', tier: 'silver', earned: false },
  { id: '4', slug: 'pm-master', nameEn: 'Password Manager Master', nameEs: 'Maestro del Gestor de Contraseñas', descriptionEn: 'Complete all Password Manager questions', descriptionEs: 'Completa todas las preguntas del Gestor de Contraseñas', icon: 'Shield', color: '#ffd700', tier: 'gold', earned: false },
  { id: '5', slug: 'perfectionist', nameEn: 'Perfectionist', nameEs: 'Perfeccionista', descriptionEn: 'Achieve 100% accuracy in any category', descriptionEs: 'Logra 100% de precisión en cualquier categoría', icon: 'Target', color: '#c0c0c0', tier: 'silver', earned: false },
  { id: '6', slug: 'speed-demon', nameEn: 'Speed Demon', nameEs: 'Demonio de la Velocidad', descriptionEn: 'Complete a senior question in under 2 minutes', descriptionEs: 'Completa una pregunta senior en menos de 2 minutos', icon: 'Zap', color: '#e5e4e2', tier: 'platinum', earned: false },
]

export async function getBadges(): Promise<Badge[]> {
  if (!isSupabaseConfigured) {
    return mockBadges
  }

  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true)
    .order('tier', { ascending: true })

  if (error) {
    console.error('Error fetching badges:', error)
    return mockBadges
  }

  return data.map(badge => ({
    id: badge.id,
    slug: badge.slug,
    nameEn: badge.name_en,
    nameEs: badge.name_es,
    descriptionEn: badge.description_en,
    descriptionEs: badge.description_es,
    icon: badge.icon,
    color: badge.color,
    tier: badge.tier,
    earned: false,
  }))
}

export async function getBadgeProgress(userId: string): Promise<Record<string, number>> {
  if (!isSupabaseConfigured) {
    return {}
  }

  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id, progress')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching badge progress:', error)
    return {}
  }

  const progress: Record<string, number> = {}
  data?.forEach(entry => {
    progress[entry.badge_id] = entry.progress
  })

  return progress
}

export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false
  }

  const { error } = await supabase
    .from('user_badges')
    .upsert({
      user_id: userId,
      badge_id: badgeId,
      awarded_at: new Date().toISOString(),
      progress: 100,
    })

  if (error) {
    console.error('Error awarding badge:', error)
    return false
  }

  return true
}
