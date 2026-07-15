import { cn } from '@/lib/utils'
import { BookOpen, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StudyExamToggleProps {
  mode: 'study' | 'exam'
  onModeChange: (mode: 'study' | 'exam') => void
  className?: string
}

export function ModeSelector({
  mode,
  onModeChange,
  className,
}: StudyExamToggleProps) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex rounded-lg border bg-background p-1', className)}>
      <button
        onClick={() => onModeChange('study')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
          mode === 'study'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent'
        )}
      >
        <BookOpen className="h-4 w-4" />
        {t('questions.modes.study', 'Study')}
      </button>
      <button
        onClick={() => onModeChange('exam')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors',
          mode === 'exam'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent'
        )}
      >
        <ClipboardList className="h-4 w-4" />
        {t('questions.modes.exam', 'Exam')}
      </button>
    </div>
  )
}
