# Tech Interview Platform

A gamified tech interview challenge platform with 150+ questions, featuring bilingual support (EN/ES), streak tracking, and badges.

## Features

- **150+ Questions** across 12 categories
- **Bilingual Support** - English and Spanish (toggle in header)
- **Gamification** - Streaks, badges, leaderboard, and points
- **Clerk Authentication** - Secure sign-in
- **Supabase Backend** - Real-time progress sync
- **Code-splitting** - Optimized bundle sizes

## Categories

### Projects
- Password Manager
- Social Media App
- Multiplayer Mini Game
- Gitanas E-commerce
- Hermit Bar

### Tech Skills
- React & Hooks
- Next.js
- Database & Prisma
- Security & Auth
- Real-time Systems
- State Management
- Testing & CI/CD

## Tech Stack

- **Frontend**: React 19, React Router v7, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **i18n**: react-i18next
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Build**: Vite

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Clerk account

### Environment Variables

Create a `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App
VITE_APP_URL=http://localhost:5173
```

### Database Setup

1. Create a Supabase project
2. Run migrations in order:
   - `supabase/migrations/001_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
3. Run seeds:
   - `supabase/seeds/001_seed_categories.sql`
   - `supabase/seeds/002_seed_badges.sql`
   - `supabase/seeds/003_seed_questions.sql`

### Installation

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/         # Authentication components
│   ├── common/       # Shared components
│   ├── dashboard/    # Dashboard widgets
│   ├── layout/       # Layout components
│   └── ui/           # UI components (shadcn)
├── data/             # Mock data (questions)
├── hooks/            # React Query hooks
├── i18n/             # Internationalization
├── lib/
│   ├── queries/      # Supabase queries
│   └── utils.ts      # Utilities
├── pages/            # Route pages
├── stores/           # Zustand stores
└── supabase/         # SQL migrations & seeds
```

## License

MIT
