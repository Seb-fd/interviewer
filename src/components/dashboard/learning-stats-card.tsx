import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { useLearningStats, useWeakAreas, useReviewQueue, useMasteryByCategory, useCategories } from '@/hooks'
import { BookOpen, Target, Zap, AlertTriangle, Clock, TrendingUp } from 'lucide-react'

export function LearningStatsCard() {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const { data: stats, isLoading: statsLoading } = useLearningStats()
  const { data: weakAreas = [] } = useWeakAreas(5)
  const { data: reviewQueue } = useReviewQueue(10, 5)
  const { data: categories = [] } = useCategories()
  const { data: masteryByCategory = {}, isLoading: masteryLoading } = useMasteryByCategory()

  const totalDue = reviewQueue?.dueQuestions.length || 0
  const totalNew = reviewQueue?.newQuestions.length || 0
  const sessionTotal = totalDue + totalNew

  const mastery = stats?.masteryDistribution || { mastered: 0, reviewing: 0, learning: 0, new: 0 }
  const totalQuestions = mastery.mastered + mastery.reviewing + mastery.learning + mastery.new

  const categoryStats = categories.map(cat => {
    const catData = masteryByCategory[cat.id]
    const catMastered = catData?.mastered ?? 0
    const catTotal = catData?.total ?? cat.totalQuestions ?? 0
    const catPercent = catTotal > 0 ? Math.round((catMastered / catTotal) * 100) : 0

    return {
      id: cat.id,
      slug: cat.slug,
      name: isSpanish ? cat.nameEs : cat.nameEn,
      total: catTotal,
      mastered: catMastered,
      reviewing: catData?.reviewing ?? 0,
      learning: catData?.learning ?? 0,
      new: catData?.new ?? 0,
      percent: catPercent,
      retention: catData?.retention ?? 0,
    }
  }).filter(c => c.total > 0)

  if (statsLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('learning.title', 'Learning Dashboard')}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-500/10 rounded-lg">
            <div className="text-3xl font-bold text-orange-500">
              {stats?.dueToday || 0}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {t('learning.dueToday', 'Due Today')}
            </div>
          </div>

          <div className="text-center p-3 bg-green-500/10 rounded-lg">
            <div className="text-3xl font-bold text-green-500">
              {mastery.mastered}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Target className="h-3 w-3" />
              {t('learning.mastered', 'Mastered')}
            </div>
          </div>

          <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500">
              {mastery.learning + mastery.reviewing}
            </div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Zap className="h-3 w-3" />
              {t('learning.learning', 'Learning')}
            </div>
          </div>
        </div>

        {sessionTotal > 0 && (
          <Button asChild className="w-full" size="lg">
            <Link to="/review">
              <Target className="h-4 w-4 mr-2" />
              {t('learning.startReview', 'Start Review Session')} ({sessionTotal} {t('learning.questions', 'questions')})
            </Link>
          </Button>
        )}

        {sessionTotal === 0 && totalQuestions > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">{t('learning.allCaughtUp', '✨ All caught up! No reviews due.')}</p>
          </div>
        )}

        {totalQuestions === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">{t('learning.startLearning', 'Start practicing to see your learning progress!')}</p>
          </div>
        )}

        {weakAreas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              {t('learning.weakAreas', 'Areas needing review')}
            </h4>
            <div className="space-y-2">
              {weakAreas.slice(0, 3).map(area => (
                <div key={area.categoryId} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">{area.categoryName}</span>
                  <span className="text-orange-500 font-medium whitespace-nowrap">
                    {area.dueCount} {t('learning.due', 'due')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {categoryStats.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t('learning.masteryProgress', 'Mastery Progress')}
            </h4>
            <div className="space-y-3">
              {categoryStats.slice(0, 5).map(stat => {
                const breakdownText = isSpanish
                  ? `${stat.mastered} dominados, ${stat.learning} aprendiendo, ${stat.reviewing} repasando, ${stat.new} nuevos`
                  : `${stat.mastered} mastered, ${stat.learning} learning, ${stat.reviewing} reviewing, ${stat.new} new`

                return (
                  <div key={stat.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="truncate mr-2 font-medium">{stat.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help tabular-nums">
                              {stat.mastered}/{stat.total}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{breakdownText}</p>
                            {stat.retention > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {t('learning.retention7d', '7-day retention')}: {stat.retention}%
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Progress
                      value={stat.percent}
                      className="h-2"
                      role="progressbar"
                      aria-valuenow={stat.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${stat.name}: ${stat.percent}% ${t('learning.mastered', 'mastered')}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {categoryStats.length === 0 && !masteryLoading && totalQuestions > 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">{t('learning.startPracticing', 'Start practicing to see category progress')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
