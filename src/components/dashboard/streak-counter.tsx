import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface StreakCounterProps {
  streakDays: number
  longestStreak: number
  className?: string
}

export function StreakCounter({
  streakDays,
  longestStreak,
  className,
}: StreakCounterProps) {
  const { t } = useTranslation()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (streakDays > 0) {
      setIsAnimating(true)
      const timeout = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [streakDays])

  const dayLabel = streakDays === 1 ? t('day', 'day') : t('days', 'days')
  const bestLabel = t('best', { count: longestStreak, defaultValue: `Best: ${longestStreak} days` })

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20',
        className
      )}
    >
      <div className="relative">
        <Flame
          className={cn(
            'h-8 w-8 text-orange-500 transition-all duration-300',
            isAnimating && 'scale-125 fill-orange-500'
          )}
        />
        {streakDays >= 7 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
            !
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-orange-500">
            {streakDays}
          </span>
          <span className="text-sm text-muted-foreground">
            {dayLabel}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {bestLabel}
        </p>
      </div>
    </div>
  )
}
