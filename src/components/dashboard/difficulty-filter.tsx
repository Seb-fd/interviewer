import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface DifficultyFilterProps {
  selectedDifficulty: string | null
  onDifficultyChange: (difficulty: string | null) => void
  className?: string
}

const difficulties = [
  { value: 'basic', labelEn: 'Basic', labelEs: 'Básico', color: 'bg-green-500' },
  { value: 'intermediate', labelEn: 'Intermediate', labelEs: 'Intermedio', color: 'bg-yellow-500' },
  { value: 'advanced', labelEn: 'Advanced', labelEs: 'Avanzado', color: 'bg-orange-500' },
  { value: 'senior', labelEn: 'Senior', labelEs: 'Senior', color: 'bg-red-500' },
]

export function DifficultyFilter({
  selectedDifficulty,
  onDifficultyChange,
  className,
}: DifficultyFilterProps) {
  const { t } = useTranslation()
  const isSpanish = useTranslation().i18n.language === 'es'

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => onDifficultyChange(null)}
        className={cn(
          'px-3 py-1.5 text-sm rounded-full border transition-colors',
          selectedDifficulty === null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background border-input hover:bg-accent'
        )}
      >
        {t('all', 'All')}
      </button>
      {difficulties.map((diff) => (
        <button
          key={diff.value}
          onClick={() => onDifficultyChange(diff.value)}
          className={cn(
            'px-3 py-1.5 text-sm rounded-full border transition-colors flex items-center gap-2',
            selectedDifficulty === diff.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-input hover:bg-accent'
          )}
        >
          <span className={cn('h-2 w-2 rounded-full', diff.color)} />
          {isSpanish ? diff.labelEs : diff.labelEn}
        </button>
      ))}
    </div>
  )
}
