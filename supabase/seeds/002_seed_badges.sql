-- ============================================
-- 002_seed_badges.sql
-- Tech Interview Challenge Platform
-- Created: Julio 14, 2026
-- ============================================

INSERT INTO badges (slug, name_en, name_es, description_en, description_es, icon, tier, type, requirement) VALUES
-- First Steps Badges
(
    'first-blood',
    'First Blood',
    'Primera Sangre',
    'Answer your first question correctly',
    'Responde tu primera pregunta correctamente',
    'Trophy',
    'bronze',
    'volume',
    '{"type": "volume", "value": 1}'::jsonb
),
(
    'learning-begins',
    'Learning Begins',
    'Comienza el Aprendizaje',
    'Complete 10 questions',
    'Completa 10 preguntas',
    'BookOpen',
    'bronze',
    'volume',
    '{"type": "volume", "value": 10}'::jsonb
),
(
    'getting-started',
    'Getting Started',
    'Primeros Pasos',
    'Complete 25 questions',
    'Completa 25 preguntas',
    'Rocket',
    'bronze',
    'volume',
    '{"type": "volume", "value": 25}'::jsonb
),

-- Streak Badges
(
    'streak-3',
    'On Fire',
    'En Llamas',
    'Maintain a 3-day streak',
    'Mantén un streak de 3 días',
    'Flame',
    'bronze',
    'streak',
    '{"type": "streak", "value": 3}'::jsonb
),
(
    'streak-7',
    'Week Warrior',
    'Guerrero Semanal',
    'Maintain a 7-day streak',
    'Mantén un streak de 7 días',
    'Flame',
    'silver',
    'streak',
    '{"type": "streak", "value": 7}'::jsonb
),
(
    'streak-30',
    'Monthly Master',
    'Maestro Mensual',
    'Maintain a 30-day streak',
    'Mantén un streak de 30 días',
    'Flame',
    'gold',
    'streak',
    '{"type": "streak", "value": 30}'::jsonb
),
(
    'streak-100',
    'Century Champion',
    'Campeón del Siglo',
    'Maintain a 100-day streak',
    'Mantén un streak de 100 días',
    'Flame',
    'platinum',
    'streak',
    '{"type": "streak", "value": 100}'::jsonb
),

-- Category Completion Badges
(
    'pm-master',
    'Password Manager Master',
    'Maestro del Gestor de Contraseñas',
    'Complete all Password Manager questions',
    'Completa todas las preguntas del Gestor de Contraseñas',
    'Shield',
    'gold',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "password-manager"}'::jsonb
),
(
    'ss-master',
    'Social Media Master',
    'Maestro de Redes Sociales',
    'Complete all Social Media App questions',
    'Completa todas las preguntas de la App de Redes Sociales',
    'Users',
    'gold',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "social-media-app"}'::jsonb
),
(
    'game-master',
    'Game Master',
    'Maestro de Juegos',
    'Complete all Multiplayer Mini Game questions',
    'Completa todas las preguntas del Juego Multiplayer',
    'Zap',
    'gold',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "multiplayer-mini-game"}'::jsonb
),
(
    'commerce-master',
    'E-commerce Master',
    'Maestro de E-commerce',
    'Complete all Gitanas E-commerce questions',
    'Completa todas las preguntas de Gitanas E-commerce',
    'ShoppingCart',
    'gold',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "gitanas-ecommerce"}'::jsonb
),
(
    'landing-master',
    'Landing Page Master',
    'Maestro de Landing Pages',
    'Complete all Hermit Bar questions',
    'Completa todas las preguntas de Hermit Bar',
    'Glass',
    'gold',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "hermit-bar"}'::jsonb
),

-- Tech Module Badges
(
    'react-pro',
    'React Pro',
    'React Pro',
    'Complete all React & Hooks questions',
    'Completa todas las preguntas de React & Hooks',
    'BookOpen',
    'silver',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "react-hooks"}'::jsonb
),
(
    'next-ninja',
    'Next.js Ninja',
    'Next.js Ninja',
    'Complete all Next.js questions',
    'Completa todas las preguntas de Next.js',
    'Code',
    'silver',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "nextjs"}'::jsonb
),
(
    'database-wizard',
    'Database Wizard',
    'Mago de Bases de Datos',
    'Complete all Database & Prisma questions',
    'Completa todas las preguntas de Database & Prisma',
    'Database',
    'silver',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "database-prisma"}'::jsonb
),
(
    'security-guardian',
    'Security Guardian',
    'Guardián de la Seguridad',
    'Complete all Security & Auth questions',
    'Completa todas las preguntas de Seguridad & Auth',
    'Lock',
    'silver',
    'category_complete',
    '{"type": "category_complete", "categorySlug": "security-auth"}'::jsonb
),

-- Special Badges
(
    'perfectionist',
    'Perfectionist',
    'Perfeccionista',
    'Achieve 100% accuracy in any category',
    'Logra 100% de precisión en cualquier categoría',
    'Target',
    'silver',
    'accuracy',
    '{"type": "accuracy", "value": 100}'::jsonb
),
(
    'speed-demon',
    'Speed Demon',
    'Demonio de la Velocidad',
    'Complete a senior question in under 2 minutes',
    'Completa una pregunta senior en menos de 2 minutos',
    'Zap',
    'platinum',
    'speed',
    '{"type": "speed", "value": 120}'::jsonb
),
(
    'polyglot',
    'Polyglot',
    'Políglota',
    'Complete 50% of questions in each project',
    'Completa 50% de preguntas en cada proyecto',
    'Globe',
    'gold',
    'polyglot',
    '{"type": "polyglot", "value": 5}'::jsonb
);
