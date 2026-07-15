# Supabase Scripts

Tech Interview Challenge Platform - Database Setup

## Estructura

```
supabase/
├── migrations/
│   ├── 001_schema.sql      # Tablas principales
│   └── 002_rls_policies.sql # Row Level Security
└── seeds/
    ├── 001_seed_categories.sql # 12 categorías
    ├── 002_seed_badges.sql     # 22 badges
    └── 003_seed_questions.sql  # Preguntas de ejemplo
```

## Orden de Ejecución

### 1. Schema y RLS
```bash
psql $DATABASE_URL -f supabase/migrations/001_schema.sql
psql $DATABASE_URL -f supabase/migrations/002_rls_policies.sql
```

### 2. Seeds (en orden)
```bash
psql $DATABASE_URL -f supabase/seeds/001_seed_categories.sql
psql $DATABASE_URL -f supabase/seeds/002_seed_badges.sql
psql $DATABASE_URL -f supabase/seeds/003_seed_questions.sql
```

## Variables de Entorno

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Verificación

```sql
-- Ver tablas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Ver categorías
SELECT slug, name_en, type FROM categories ORDER BY sort_order;

-- Verificar counts
SELECT 'categories' as tbl, COUNT(*) as cnt FROM categories
UNION ALL SELECT 'badges', COUNT(*) FROM badges;
```

## Usando Supabase CLI

```bash
# Link al proyecto
supabase link --project-ref <ref>

# Push schema
supabase db push

# O ejecutar directamente
psql $DATABASE_URL -f supabase/migrations/001_schema.sql
```
