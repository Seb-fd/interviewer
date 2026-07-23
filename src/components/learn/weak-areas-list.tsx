import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWeakAreas } from '@/hooks/useLearningStats'
import { AlertTriangle, TrendingUp } from 'lucide-react'

interface WeakAreasListProps {
  limit?: number
}

export function WeakAreasList({ limit = 5 }: WeakAreasListProps) {
  const { t } = useTranslation()
  const { data: weakAreas = [], isLoading } = useWeakAreas(limit)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t('learning.weakAreas.title', 'Weak Areas')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (weakAreas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {t('learning.weakAreas.title', 'Weak Areas')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('learning.weakAreas.noWeakAreas', 'Great job! No weak areas identified')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          {t('learning.weakAreas.title', 'Weak Areas')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('learning.weakAreas.subtitle', 'Topics that need more practice')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {weakAreas.map((area) => (
          <div
            key={area.categoryId}
            className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{area.categoryName}</p>
              <p className="text-xs text-muted-foreground">
                {t('learning.weakAreas.improve', 'Focus on improving')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-orange-500 tabular-nums">
                {area.dueCount} {t('learning.due', 'due')}
              </span>
              <Button asChild size="sm" variant="outline">
                <Link to={`/category/${area.categoryId}`}>
                  <TrendingUp className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
