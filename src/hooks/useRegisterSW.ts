import { useEffect, useState } from 'react'
import { useRegisterSW as useRegisterSWBase } from 'virtual:pwa-register/react'

interface UseRegisterSWReturn {
  needRefresh: boolean
  offlineReady: boolean
  updateSW: (reloadPage?: boolean) => Promise<void>
}

export function useRegisterSW(): UseRegisterSWReturn {
  const [updateSWFn, setUpdateSWFn] = useState<((reload?: boolean) => Promise<void>) | null>(null)

  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSWBase({
    immediate: true,
    onRegisteredSW(swUrl: string) {
      console.log('[PWA] Service Worker registered:', swUrl)
    },
    onRegisterError(error: unknown) {
      console.error('[PWA] Service Worker registration failed:', error)
    },
  })

  useEffect(() => {
    setUpdateSWFn(() => updateServiceWorker)
  }, [updateServiceWorker])

  const update = async (reloadPage = true) => {
    if (updateSWFn) {
      await updateSWFn(reloadPage)
    }
  }

  return {
    needRefresh,
    offlineReady,
    updateSW: update,
  }
}
