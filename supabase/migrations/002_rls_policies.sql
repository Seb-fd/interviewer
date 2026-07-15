-- ============================================
-- 002_rls_policies.sql
-- Row Level Security for Tech Interview Platform
-- Created: Julio 14, 2026
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid()::text = clerk_id);

-- ============================================
-- BADGES POLICIES
-- Badges are publicly readable
-- ============================================
CREATE POLICY "Badges are viewable by all"
    ON badges FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- CATEGORIES POLICIES
-- Categories are publicly readable
-- ============================================
CREATE POLICY "Categories are viewable by all"
    ON categories FOR SELECT
    TO authenticated
    USING (is_active = true);

-- ============================================
-- QUESTIONS POLICIES
-- Questions are publicly readable
-- ============================================
CREATE POLICY "Questions are viewable by all"
    ON questions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM categories
            WHERE categories.id = questions.category_id
            AND categories.is_active = true
        )
    );

-- ============================================
-- USER_BADGES POLICIES
-- ============================================
CREATE POLICY "Users can view their own badges"
    ON user_badges FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
    ON user_badges FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER_PROGRESS POLICIES
-- ============================================
CREATE POLICY "Users can manage their own progress"
    ON user_progress FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- ATTEMPTS POLICIES
-- ============================================
CREATE POLICY "Users can manage their own attempts"
    ON attempts FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- DAILY_ACTIVITY POLICIES
-- ============================================
CREATE POLICY "Users can manage their own daily activity"
    ON daily_activity FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- Note: auth.uid() is Supabase built-in function
-- Do NOT override it as it's used internally
-- ============================================
