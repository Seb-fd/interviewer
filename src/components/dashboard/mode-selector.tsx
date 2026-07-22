import { cn } from '@/lib/utils'
import { BookOpen, Zap, RefreshCw, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { QuestionMode } from '@/stores/ui-store'

interface ModeSelectorProps {
  mode: QuestionMode
  onModeChange: (mode: QuestionMode) => void
  className?: string
}

const modes = [
  {
    value: 'learn' as const,
    icon: BookOpen,
    labelKey: 'questions.modes.learn',
    labelDefault: 'Learn',
  },
  {
    value: 'practice' as const,
    icon: Zap,
    labelKey: 'questions.modes.practice',
    labelDefault: 'Practice',
  },
  {
    value: 'review' as const,
    icon: RefreshCw,
    labelKey: 'questions.modes.review',
    labelDefault: 'Review',
  },
  {
    value: 'exam' as const,
    icon: Clock,
    labelKey: 'questions.modes.exam',
    labelDefault: 'Exam',
  },
]

export function ModeSelector({
  mode,
  onModeChange,
  className,
}: ModeSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex rounded-lg border bg-background p-1', className)}>
      {modes.map(({ value, icon: Icon, labelKey, labelDefault }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
            mode === value
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          )}
        >
          <Icon className="h-4 w-4" />
          {t(labelKey, labelDefault)}
        </button>
      ))}
    </div>
  )
}
