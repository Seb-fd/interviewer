import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { StatsCard } from '@components/dashboard/stats-card'
import { StreakCounter } from '@components/dashboard/streak-counter'
import { BadgeItem } from '@components/dashboard/badge-item'
import { ProgressRing } from '@components/dashboard/progress-ring'
import { QuestionCard } from '@/components/dashboard/question-card'
import { CategoryIcon } from '@/components/dashboard/category-icon'
import { LearningStatsCard } from '@/components/dashboard/learning-stats-card'
import { Trophy, Target, Flame, Award } from 'lucide-react'
import { useCategories, useBadges, useQuestionsWithProgress } from '@/hooks'
import { useProgressStore } from '@/stores/progress-store'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const { data: categories = [] } = useCategories()
  const { data: badges = [] } = useBadges()
  const { data: questions = [] } = useQuestionsWithProgress()

  const { totalScore, totalQuestions, correctAnswers, currentStreak, longestStreak, categoryProgress } = useProgressStore()
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  const projectCategories = categories.filter(c => c.type === 'project')
  const techCategories = categories.filter(c => c.type === 'tech')

  const earnedBadges = badges.filter(b => b.earned)
  const recentBadges = badges.slice(0, 4)

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.title', 'Dashboard')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.subtitle', 'Your progress and statistics')}
          </p>
        </div>
        <StreakCounter streakDays={currentStreak} longestStreak={longestStreak} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title={t('dashboard.totalScore', 'Total Score')}
          value={totalScore}
          icon={Trophy}
          description={t('dashboard.answered', { count: totalQuestions, defaultValue: `${totalQuestions} questions answered` })}
        />
        <StatsCard
          title={t('dashboard.accuracy', 'Accuracy')}
          value={`${accuracy}%`}
          icon={Target}
          description={`${correctAnswers} / ${totalQuestions} ${t('dashboard.correct', 'correct')}`}
        />
        <StatsCard
          title={t('dashboard.streak', 'Streak')}
          value={t('dashboard.streakDays', { count: currentStreak })}
          icon={Flame}
          description={t('dashboard.keepGoing', 'Keep it going!')}
        />
        <StatsCard
          title={t('dashboard.badges', 'Badges')}
          value={`${earnedBadges.length}/${badges.length}`}
          icon={Award}
          description={`${earnedBadges.length} ${t('dashboard.earned', 'earned')}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningStatsCard />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.portfolioProjects', 'Portfolio Projects')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projectCategories.map((cat) => (
            <Card key={cat.slug} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{isSpanish ? cat.nameEs : cat.nameEn}</CardTitle>
                <CardDescription>
                  {isSpanish ? cat.descriptionEs : cat.descriptionEn}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{cat.totalQuestions} {t('dashboard.questions', 'questions')}</span>
                  <ProgressRing progress={(() => {
                    const progress = categoryProgress[cat.slug]
                    const completed = progress?.questionsCompleted?.length || 0
                    return cat.totalQuestions > 0 ? Math.round((completed / cat.totalQuestions) * 100) : 0
                  })()} size={40} />
                </div>
                <Link to={`/category/${cat.slug}`}>
                  <Button variant="outline" className="w-full">
                    {t('dashboard.practice', 'Practice')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.technicalModules', 'Technical Modules')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {techCategories.map((cat) => (
            <Card key={cat.slug} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{isSpanish ? cat.nameEs : cat.nameEn}</CardTitle>
                <CardDescription>
                  {isSpanish ? cat.descriptionEs : cat.descriptionEn}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{cat.totalQuestions} {t('dashboard.questions', 'questions')}</span>
                  <ProgressRing progress={(() => {
                    const progress = categoryProgress[cat.slug]
                    const completed = progress?.questionsCompleted?.length || 0
                    return cat.totalQuestions > 0 ? Math.round((completed / cat.totalQuestions) * 100) : 0
                  })()} size={40} />
                </div>
                <Link to={`/category/${cat.slug}`}>
                  <Button variant="outline" className="w-full">
                    {t('dashboard.practice', 'Practice')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.recentBadges', 'Recent Badges')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentBadges.map((badge) => (
            <BadgeItem
              key={badge.slug}
              name={isSpanish ? badge.nameEs : badge.nameEn}
              tier={badge.tier}
              earned={badge.earned}
              progress={badge.progress}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.featuredQuestions', 'Featured Questions')}
        </h2>
        <div className="space-y-4">
          {questions.slice(0, 3).map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              slug={question.slug}
              titleEn={question.titleEn}
              titleEs={question.titleEs}
              difficulty={question.difficulty}
              type={question.type}
              points={question.points}
              completed={question.completed}
              correct={question.correct}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
