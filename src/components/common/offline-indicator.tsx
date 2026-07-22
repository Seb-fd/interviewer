import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WifiOff, Wifi } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { cn } from '@/lib/utils'

export function OfflineIndicator() {
  const { t } = useTranslation()
  const { isOnline, wasOffline } = useOnlineStatus()
  const [showOnlineToast, setShowOnlineToast] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowOnlineToast(true)
      const timer = setTimeout(() => setShowOnlineToast(false), 4000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isOnline, wasOffline])

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-amber-500 dark:bg-amber-600 text-white',
          'px-4 py-2.5',
          'flex items-center justify-center gap-2',
          'text-sm font-medium',
          'shadow-sm',
          'animate-in slide-in-from-top duration-300'
        )}
      >
        <WifiOff className="h-4 w-4" aria-hidden="true" />
        <span>{t('pwa.offline.title', 'Working offline')}</span>
        <span className="hidden sm:inline opacity-90">
          · {t('pwa.offline.subtitle', 'Your progress is being saved locally')}
        </span>
      </div>
    )
  }

  if (showOnlineToast) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'bg-green-500 dark:bg-green-600 text-white',
          'px-4 py-2.5',
          'flex items-center justify-center gap-2',
          'text-sm font-medium',
          'shadow-sm',
          'animate-in slide-in-from-top duration-300'
        )}
      >
        <Wifi className="h-4 w-4" aria-hidden="true" />
        <span>{t('pwa.online', 'Back online')}</span>
      </div>
    )
  }

  return null
}
