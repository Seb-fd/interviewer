import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, X, Check } from 'lucide-react'
import { Button } from '@components/ui/button'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export function InstallPWA() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      if (Date.now() - dismissedAt < DISMISS_DURATION_MS) {
        return
      }
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
    } catch (err) {
      console.error('[PWA] Install prompt failed:', err)
    } finally {
      setIsInstalling(false)
      setIsVisible(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString())
  }

  if (!isVisible || isInstalled) return null

  return (
    <div
      role="dialog"
      aria-labelledby="install-pwa-title"
      aria-describedby="install-pwa-description"
      className={cn(
        'fixed bottom-4 right-4 z-40',
        'max-w-sm w-[calc(100%-2rem)] sm:w-auto',
        'bg-background border border-border rounded-lg shadow-lg',
        'p-4 flex items-start gap-3',
        'animate-in slide-in-from-bottom duration-300'
      )}
    >
      <div className="flex-shrink-0 p-2 rounded-md bg-primary/10">
        <Download className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          id="install-pwa-title"
          className="text-sm font-semibold text-foreground"
        >
          {t('pwa.install', 'Install App')}
        </h3>
        <p
          id="install-pwa-description"
          className="text-xs text-muted-foreground mt-0.5"
        >
          {t('pwa.installDescription', 'Get offline access and a faster experience')}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleInstall}
            disabled={isInstalling}
            aria-label={t('pwa.install', 'Install App')}
          >
            {isInstalling ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                {t('pwa.installing', 'Installing...')}
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                {t('pwa.install', 'Install')}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            aria-label={t('pwa.dismiss', 'Dismiss install prompt')}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
