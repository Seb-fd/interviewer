import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StudyModePicker, WeakAreasList, MasteryByCategory } from '@/components/learn'
import { useLearningStats, useReviewQueue } from '@/hooks/useLearningStats'
import { Clock, Target, Zap, BookOpen, ArrowRight } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function Learn() {
  const { t } = useTranslation()
  const { data: stats, isLoading: statsLoading } = useLearningStats()
  const { data: reviewQueue } = useReviewQueue(10, 5)

  const totalDue = reviewQueue?.dueQuestions.length ?? 0
  const totalNew = reviewQueue?.newQuestions.length ?? 0
  const sessionTotal = totalDue + totalNew

  const mastery = stats?.masteryDistribution ?? { mastered: 0, reviewing: 0, learning: 0, new: 0 }
  const totalQuestions = mastery.mastered + mastery.reviewing + mastery.learning + mastery.new

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            {t('learning.title', 'Learning Dashboard')}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {t('learning.subtitle', 'Track your mastery and study progress')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('learning.reviewQueue.dueToday', 'Due Today')}
                </p>
                {statsLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <p className="text-3xl font-bold text-orange-500">
                    {stats?.dueToday ?? 0}
                  </p>
                )}
              </div>
              <Clock className="h-8 w-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('learning.masteryLevel.mastered', 'Mastered')}
                </p>
                {statsLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <p className="text-3xl font-bold text-green-500">{mastery.mastered}</p>
                )}
              </div>
              <Target className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('learning.masteryLevel.learning', 'Learning')}
                </p>
                {statsLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <p className="text-3xl font-bold text-yellow-500">
                    {mastery.learning + mastery.reviewing}
                  </p>
                )}
              </div>
              <Zap className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {sessionTotal > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="font-semibold">
                {t('learning.reviewQueue.reviewNow', 'Review Now')}
              </p>
              <p className="text-sm text-muted-foreground">
                {totalDue} {t('learning.reviewQueue.dueCards', 'Due Cards')} +{' '}
                {totalNew} {t('learning.reviewQueue.newCards', 'New Cards')}
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link to="/review">
                {t('learning.startReview', 'Start Review Session')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {sessionTotal === 0 && totalQuestions > 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {t('learning.allCaughtUp', '✨ All caught up! No reviews due.')}
          </CardContent>
        </Card>
      )}

      {totalQuestions === 0 && !statsLoading && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {t('learning.startLearning', 'Start practicing to see your learning progress!')}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">
          {t('learning.studyModes.title', 'Study Modes')}
        </h2>
        <StudyModePicker />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WeakAreasList limit={5} />
        <MasteryByCategory />
      </div>
    </div>
  )
}
