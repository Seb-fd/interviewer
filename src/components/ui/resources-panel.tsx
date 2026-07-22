import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Badge } from '@components/ui/badge'
import { Skeleton } from '@components/ui/skeleton'
import { BookOpen, PlayCircle, FileText, Video, ExternalLink } from 'lucide-react'
import type { Resource } from '@/lib/db/types'
import { cn } from '@/lib/utils'

interface ResourcesPanelProps {
  resources: Resource[]
  isLoading?: boolean
  className?: string
}

const ICON_MAP = {
  documentation: BookOpen,
  tutorial: PlayCircle,
  article: FileText,
  video: Video,
} as const

const COLOR_MAP = {
  documentation: 'text-blue-500',
  tutorial: 'text-purple-500',
  article: 'text-orange-500',
  video: 'text-red-500',
} as const

function ResourceSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg" aria-busy="true">
      <Skeleton className="h-5 w-5 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function ResourcesPanel({ resources, isLoading = false, className }: ResourcesPanelProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div
        role="tabpanel"
        aria-labelledby="resources-tab"
        aria-busy="true"
        className={cn('space-y-3', className)}
      >
        <div className="space-y-2">
          <ResourceSkeleton />
          <ResourceSkeleton />
          <ResourceSkeleton />
        </div>
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div
        role="tabpanel"
        aria-labelledby="resources-tab"
        className={cn('py-8 text-center text-muted-foreground', className)}
      >
        <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" aria-hidden="true" />
        <p className="text-sm">{t('resources.noResources', 'No resources available for this topic')}</p>
      </div>
    )
  }

  return (
    <div
      role="tabpanel"
      aria-labelledby="resources-tab"
      className={cn('space-y-3', className)}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            {t('resources.title', 'Learning Resources')}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t('resources.subtitle', 'Deepen your understanding with these curated materials')}
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {resources.map((resource, index) => {
            const Icon = ICON_MAP[resource.type] || BookOpen
            const iconColor = COLOR_MAP[resource.type] || 'text-blue-500'

            return (
              <a
                key={`${resource.url}-${index}`}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-3 border rounded-lg hover:bg-accent hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label={`${resource.title} - ${t(`resources.${resource.type}`, resource.type)} - ${t('resources.openExternal', 'Opens in new tab')}`}
              >
                <Icon
                  className={cn('h-5 w-5 flex-shrink-0', iconColor)}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary">
                    {resource.title}
                  </p>
                  <Badge variant="secondary" className="mt-0.5 text-xs">
                    {t(`resources.${resource.type}`, resource.type)}
                  </Badge>
                </div>
                <ExternalLink
                  className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0"
                  aria-hidden="true"
                />
              </a>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
