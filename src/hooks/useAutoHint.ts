import { useState, useEffect, useRef, useCallback } from 'react'

interface UseAutoHintOptions {
  isActive: boolean
  totalHints: number
  hintsRevealed: number
  inactivityThresholdMs?: number
}

interface UseAutoHintReturn {
  isInactivityDetected: boolean
  inactivityDurationMs: number
  shouldPromptHint: boolean
  dismissPrompt: () => void
  resetInactivityTimer: () => void
}

const DEFAULT_INACTIVITY_THRESHOLD_MS = 30000

export function useAutoHint({
  isActive,
  totalHints,
  hintsRevealed,
  inactivityThresholdMs = DEFAULT_INACTIVITY_THRESHOLD_MS,
}: UseAutoHintOptions): UseAutoHintReturn {
  const [isInactivityDetected, setIsInactivityDetected] = useState(false)
  const [dismissedFor, setDismissedFor] = useState(0)
  const inactivityStartRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [inactivityDurationMs, setInactivityDurationMs] = useState(0)

  const resetInactivityTimer = useCallback(() => {
    inactivityStartRef.current = null
    setIsInactivityDetected(false)
    setInactivityDurationMs(0)
  }, [])

  const dismissPrompt = useCallback(() => {
    setDismissedFor(Date.now())
    resetInactivityTimer()
  }, [resetInactivityTimer])

  useEffect(() => {
    if (!isActive || hintsRevealed >= totalHints) {
      resetInactivityTimer()
      return
    }

    if (dismissedFor > 0) {
      const timeSinceDismiss = Date.now() - dismissedFor
      if (timeSinceDismiss < 60000) {
        return
      }
      setDismissedFor(0)
    }

    inactivityStartRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      if (inactivityStartRef.current === null) return

      const elapsed = Date.now() - inactivityStartRef.current
      setInactivityDurationMs(elapsed)

      if (elapsed >= inactivityThresholdMs) {
        setIsInactivityDetected(true)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, totalHints, hintsRevealed, inactivityThresholdMs, dismissedFor, resetInactivityTimer])

  const shouldPromptHint =
    isInactivityDetected &&
    isActive &&
    hintsRevealed < totalHints &&
    dismissedFor === 0

  return {
    isInactivityDetected,
    inactivityDurationMs,
    shouldPromptHint,
    dismissPrompt,
    resetInactivityTimer,
  }
}
