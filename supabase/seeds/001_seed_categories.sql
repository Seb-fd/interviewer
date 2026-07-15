-- ============================================
-- 001_seed_categories.sql
-- Tech Interview Challenge Platform
-- Created: Julio 14, 2026
-- ============================================

-- ============================================
-- PROJECT CATEGORIES (5)
-- ============================================

INSERT INTO categories (slug, name_en, name_es, description_en, description_es, icon, color, type, sort_order) VALUES
(
    'password-manager',
    'Password Manager',
    'Gestor de Contraseñas',
    'Security, encryption, zero-knowledge authentication, and military-grade password protection.',
    'Seguridad, cifrado, autenticación zero-knowledge y protección de contraseñas de grado militar.',
    'Shield',
    '#ef4444',
    'project',
    1
),
(
    'social-media-app',
    'Social Media App',
    'App de Redes Sociales',
    'Server Actions, real-time notifications, SSR, mentions, and social interactions.',
    'Server Actions, notificaciones en tiempo real, SSR, menciones e interacciones sociales.',
    'Users',
    '#3b82f6',
    'project',
    2
),
(
    'multiplayer-mini-game',
    'Multiplayer Mini Game',
    'Juego Multiplayer',
    'Socket.io, game state synchronization, collision detection, and real-time multiplayer.',
    'Socket.io, sincronización de estado de juego, detección de colisiones y multiplayer en tiempo real.',
    'Zap',
    '#22c55e',
    'project',
    3
),
(
    'gitanas-ecommerce',
    'Gitanas E-commerce',
    'Gitanas E-commerce',
    'POS system, inventory management, shopping cart, and point of sale for real business.',
    'Sistema POS, gestión de inventario, carrito de compras y punto de venta para negocio real.',
    'ShoppingCart',
    '#a855f7',
    'project',
    4
),
(
    'hermit-bar',
    'Hermit Bar',
    'Hermit Bar',
    'Landing pages, i18n, SEO, animations with Framer Motion, and glassmorphism effects.',
    'Landing pages, i18n, SEO, animaciones con Framer Motion y efectos de glassmorphism.',
    'Glass',
    '#f97316',
    'project',
    5
);

-- ============================================
-- TECH MODULES (7)
-- ============================================

INSERT INTO categories (slug, name_en, name_es, description_en, description_es, icon, color, type, sort_order) VALUES
(
    'react-hooks',
    'React & Hooks',
    'React & Hooks',
    'useState, useEffect, useReducer, custom hooks, and advanced React patterns.',
    'useState, useEffect, useReducer, hooks personalizados y patrones avanzados de React.',
    'BookOpen',
    '#06b6d4',
    'tech',
    6
),
(
    'nextjs',
    'Next.js',
    'Next.js',
    'Server Components, Server Actions, App Router, caching, and streaming.',
    'Server Components, Server Actions, App Router, caching y streaming.',
    'Code',
    '#64748b',
    'tech',
    7
),
(
    'database-prisma',
    'Database & Prisma',
    'Database & Prisma',
    'PostgreSQL, Prisma ORM, schema design, migrations, and query optimization.',
    'PostgreSQL, Prisma ORM, diseño de schema, migraciones y optimización de queries.',
    'Database',
    '#6366f1',
    'tech',
    8
),
(
    'security-auth',
    'Security & Auth',
    'Seguridad & Auth',
    'JWT, OAuth, encryption, CSRF protection, rate limiting, and authentication flows.',
    'JWT, OAuth, cifrado, protección CSRF, rate limiting y flujos de autenticación.',
    'Lock',
    '#ef4444',
    'tech',
    9
),
(
    'realtime-systems',
    'Real-time Systems',
    'Sistemas Real-time',
    'WebSockets, Socket.io, rooms, broadcasting, and real-time state sync.',
    'WebSockets, Socket.io, rooms, broadcasting y sincronización de estado en tiempo real.',
    'Wifi',
    '#eab308',
    'tech',
    10
),
(
    'state-management',
    'State Management',
    'Gestión de Estado',
    'Zustand, Context API, React Query, cache invalidation, and server state.',
    'Zustand, Context API, React Query, invalidación de cache y estado del servidor.',
    'Layers',
    '#8b5cf6',
    'tech',
    11
),
(
    'testing-cicd',
    'Testing & CI/CD',
    'Testing & CI/CD',
    'Vitest, Playwright, k6 load testing, GitHub Actions, and test strategies.',
    'Vitest, Playwright, k6 load testing, GitHub Actions y estrategias de testing.',
    'TestTube',
    '#22c55e',
    'tech',
    12
);
