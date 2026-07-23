import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMasteryByCategory, useCategories } from '@/hooks'
import { TrendingUp } from 'lucide-react'

export function MasteryByCategory() {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'
  const { data: categories = [] } = useCategories()
  const { data: masteryByCategory = {}, isLoading } = useMasteryByCategory()

  const categoryStats = categories
    .map((cat) => {
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
    })
    .filter((c) => c.total > 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('learning.masteryProgress', 'Mastery Progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (categoryStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('learning.masteryProgress', 'Mastery Progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t(
              'learning.startPracticing',
              'Start practicing to see category progress'
            )}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('learning.masteryProgress', 'Mastery Progress')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryStats.map((stat) => {
          const breakdownText = isSpanish
            ? `${stat.mastered} dominados, ${stat.learning} aprendiendo, ${stat.reviewing} repasando, ${stat.new} nuevos`
            : `${stat.mastered} mastered, ${stat.learning} learning, ${stat.reviewing} reviewing, ${stat.new} new`

          return (
            <Link
              key={stat.id}
              to={`/category/${stat.slug}`}
              className="block space-y-2 hover:bg-muted/30 -mx-2 px-2 py-1 rounded transition-colors"
            >
              <div className="flex justify-between text-sm">
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
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
