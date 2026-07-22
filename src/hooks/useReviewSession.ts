import { useState, useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { getReviewQueue } from '@/lib/db/spaced-repetition'
import type { Question } from '@/lib/db/types'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function useReviewSession(reviewLimit: number = 10, newLimit: number = 5) {
  const queryClient = useQueryClient()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shuffledQueue, setShuffledQueue] = useState<Question[]>([])
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    timeSpent: 0,
    completed: 0,
  })

  const { data: queueData, isLoading } = useQuery({
    queryKey: ['review-queue', reviewLimit, newLimit],
    queryFn: () => getReviewQueue(reviewLimit, newLimit),
    staleTime: 1000 * 60,
  })

  const questionsQuery = useQuery({
    queryKey: ['questions-by-ids', queueData?.dueQuestions, queueData?.newQuestions],
    queryFn: async () => {
      if (!queueData) return []
      const allIds = [...queueData.dueQuestions, ...queueData.newQuestions]
      if (allIds.length === 0) return []
      const questions = await db.questions.bulkGet(allIds)
      return questions.filter((q): q is Question => q !== undefined)
    },
    enabled: !!queueData && (queueData.dueQuestions.length > 0 || queueData.newQuestions.length > 0),
  })

  useEffect(() => {
    if (questionsQuery.data && questionsQuery.data.length > 0) {
      setShuffledQueue(shuffleArray(questionsQuery.data))
    }
  }, [questionsQuery.data])

  const currentQuestion = shuffledQueue[currentIndex] || null
  const isComplete = currentIndex >= shuffledQueue.length && shuffledQueue.length > 0

  const advanceToNext = useCallback(() => {
    if (currentIndex < shuffledQueue.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCurrentIndex(shuffledQueue.length)
    }
  }, [currentIndex, shuffledQueue.length])

  const skipQuestion = useCallback(() => {
    if (shuffledQueue.length === 0) return

    const currentQ = shuffledQueue[currentIndex]
    const remainingQuestions = shuffledQueue.filter((_, i) => i !== currentIndex)
    const newQueue = [currentQ, ...remainingQuestions]
    setShuffledQueue(newQueue)
    setCurrentIndex(0)
  }, [shuffledQueue, currentIndex])

  const endSession = useCallback(() => {
    setCurrentIndex(shuffledQueue.length)
    queryClient.invalidateQueries({ queryKey: ['review-queue'] })
    queryClient.invalidateQueries({ queryKey: ['learning-stats'] })
  }, [shuffledQueue.length, queryClient])

  const recordAnswer = useCallback((isCorrect: boolean, timeSpent: number) => {
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      timeSpent: prev.timeSpent + timeSpent,
      completed: prev.completed + 1,
    }))
  }, [])

  return {
    queue: shuffledQueue,
    currentIndex,
    currentQuestion,
    sessionStats,
    isLoading: isLoading || questionsQuery.isLoading,
    isComplete,
    shuffledQueue,
    advanceToNext,
    skipQuestion,
    endSession,
    recordAnswer,
  }
}
