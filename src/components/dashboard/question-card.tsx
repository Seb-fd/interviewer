import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  id: string
  slug: string
  titleEn: string
  titleEs: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'senior'
  type: 'conceptual' | 'coding' | 'multiple_choice'
  points: number
  language?: string
  completed?: boolean
  correct?: boolean
  className?: string
}

const difficultyConfig = {
  basic: { labelEn: 'Basic', labelEs: 'Básico', variant: 'basic' as const },
  intermediate: { labelEn: 'Intermediate', labelEs: 'Intermedio', variant: 'intermediate' as const },
  advanced: { labelEn: 'Advanced', labelEs: 'Avanzado', variant: 'advanced' as const },
  senior: { labelEn: 'Senior', labelEs: 'Senior', variant: 'senior' as const },
}

export function QuestionCard({
  id,
  slug,
  titleEn,
  titleEs,
  difficulty,
  type,
  points,
  language,
  completed,
  correct,
  className,
}: QuestionCardProps) {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'
  const config = difficultyConfig[difficulty]

  return (
    <Card
      className={cn(
        'hover:border-primary/50 transition-colors cursor-pointer',
        completed && 'opacity-75',
        completed && correct && 'border-green-500/50 bg-green-500/5',
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={config.variant}>
                {isSpanish ? config.labelEs : config.labelEn}
              </Badge>
              <Badge variant="outline">
                {t(`questions.types.${type}`, type === 'coding' ? 'Code' : type === 'conceptual' ? 'Concept' : 'Choice')}
              </Badge>
              {language && (
                <Badge variant="outline" className="text-xs">
                  {language}
                </Badge>
              )}
            </div>
            <h3 className="font-medium line-clamp-2">
              {isSpanish ? titleEs : titleEn}
            </h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                {points || 0} pts
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{Math.ceil((points || 0) / 10)} min
              </span>
            </div>
          </div>
          {completed && (
            <div className="flex-shrink-0">
              {correct ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <Link to={`/category/${slug}/question/${id}`} className="block mt-3">
          <span className="text-sm text-primary hover:underline">
            {t('dashboard.practice', { defaultValue: isSpanish ? 'Practicar →' : 'Practice →' })}
          </span>
        </Link>
      </CardContent>
    </Card>
  )
}
