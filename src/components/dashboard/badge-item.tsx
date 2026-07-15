import { cn } from '@/lib/utils'
import { Trophy, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface BadgeItemProps {
  name: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  earned: boolean
  progress?: number
  className?: string
}

const tierColors = {
  bronze: 'bg-amber-700/20 text-amber-700 border-amber-700/30',
  silver: 'bg-gray-400/20 text-gray-400 border-gray-400/30',
  gold: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  platinum: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
}

const tierIconColors = {
  bronze: 'text-amber-700',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
  platinum: 'text-purple-500',
}

export function BadgeItem({
  name,
  tier,
  earned,
  progress = 0,
  className,
}: BadgeItemProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-300',
        earned
          ? cn('bg-card', tierColors[tier], 'shadow-md hover:shadow-lg')
          : 'bg-muted/50 border-muted opacity-50',
        className
      )}
      title={earned ? name : `${t('gamification.badges.lockedLabel', 'Locked:')} ${name}`}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full border-2',
          earned ? cn('bg-background/80', tierColors[tier]) : 'bg-muted border-muted'
        )}
      >
        {earned ? (
          <Trophy className={cn('h-6 w-6', tierIconColors[tier])} />
        ) : (
          <Lock className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <span className="text-xs font-medium text-center line-clamp-1">
        {name}
      </span>
      {!earned && progress > 0 && (
        <div className="absolute bottom-1 left-1 right-1 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
