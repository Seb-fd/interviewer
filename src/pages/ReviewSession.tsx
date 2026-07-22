import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Textarea } from '@components/ui/textarea'
import { Progress } from '@components/ui/progress'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Brain,
  HelpCircle,
  Zap as ZapConfused,
  Clock,
  Target,
  RefreshCw,
  Zap,
} from 'lucide-react'
import { cn, formatTime, normalizeAnswer } from '@/lib/utils'
import { useReviewSession } from '@/hooks/useReviewSession'
import { useSubmitAnswer } from '@/hooks'
import { useProgressStore } from '@/stores'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function ReviewSessionPage() {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const {
    shuffledQueue,
    currentIndex,
    currentQuestion,
    sessionStats,
    isLoading,
    isComplete,
    advanceToNext,
    skipQuestion,
  } = useReviewSession()

  const submitAnswer = useSubmitAnswer()
  const currentStreak = useProgressStore(state => state.currentStreak)

  const [userAnswer, setUserAnswer] = useState('')
  const [selectedConfidence, setSelectedConfidence] = useState<'know' | 'uncertain' | 'dont-know' | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ isCorrect: boolean; scoreEarned: number } | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (isComplete || shuffledQueue.length === 0) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Target className="h-6 w-6" />
              {t('review.sessionComplete', 'Review Session Complete')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="text-3xl font-bold text-green-500">{sessionStats.correct}</div>
                <div className="text-sm text-muted-foreground">{t('review.correct', 'Correct')}</div>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg">
                <div className="text-3xl font-bold text-red-500">{sessionStats.incorrect}</div>
                <div className="text-sm text-muted-foreground">{t('review.incorrect', 'Incorrect')}</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <div className="text-3xl font-bold text-blue-500">{formatTime(sessionStats.timeSpent)}</div>
                <div className="text-sm text-muted-foreground">{t('review.timeSpent', 'Time')}</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/dashboard">{t('common.back', 'Back to Dashboard')}</Link>
              </Button>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('review.startNewSession', 'Start New Session')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const solution = isSpanish ? currentQuestion?.solutionEs || '' : currentQuestion?.solutionEn || ''
  const explanation = isSpanish ? currentQuestion?.explanationEs || '' : currentQuestion?.explanationEn || ''
  const categorySlug = currentQuestion?.categoryId || ''

  const handleSubmit = async () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(solution)

    try {
      const result = await submitAnswer.mutateAsync({
        questionId: currentQuestion.id,
        categorySlug,
        answer: userAnswer,
        timeSpent,
        hintsUsed: hintsRevealed,
        isCorrect,
        difficulty: currentQuestion.difficulty,
        currentStreak,
        confidence: selectedConfidence || undefined,
        mode: 'review',
      })
      setSubmitResult(result)
      setShowSolution(true)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  const handleNext = () => {
    setUserAnswer('')
    setSelectedConfidence(null)
    setIsSubmitted(false)
    setShowSolution(false)
    setSubmitResult(null)
    setHintsRevealed(0)
    setTimeSpent(0)
    advanceToNext()
  }

  const progressPercent = (currentIndex / shuffledQueue.length) * 100

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t('review.title', 'Review Session')}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {currentIndex + 1} / {shuffledQueue.length}
              </span>
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                {sessionStats.correct}
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <XCircle className="h-4 w-4" />
                {sessionStats.incorrect}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {formatTime(sessionStats.timeSpent)}
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isSpanish ? currentQuestion?.titleEs : currentQuestion?.titleEn}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={
                  currentQuestion?.difficulty === 'basic' ? 'basic' :
                  currentQuestion?.difficulty === 'intermediate' ? 'intermediate' :
                  currentQuestion?.difficulty === 'advanced' ? 'advanced' : 'senior'
                }>
                  {t(`questions.difficulty.${currentQuestion?.difficulty}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {isSpanish ? currentQuestion?.descriptionEs : currentQuestion?.descriptionEn}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('questions.question.yourAnswer', 'Your Answer')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t('questions.question.placeholderConceptual')}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
                disabled={isSubmitted}
              />

              {!isSubmitted && (
                <>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      {t('questions.question.confidenceTitle', 'How confident are you?')}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={selectedConfidence === 'know' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedConfidence('know')}
                        className={cn(
                          "h-auto py-3 flex-col gap-1",
                          selectedConfidence === 'know' && "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        <Zap className="h-5 w-5" />
                        <span className="text-xs">{t('questions.question.confidenceKnow', 'I know this')}</span>
                      </Button>
                      <Button
                        type="button"
                        variant={selectedConfidence === 'uncertain' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedConfidence('uncertain')}
                        className={cn(
                          "h-auto py-3 flex-col gap-1",
                          selectedConfidence === 'uncertain' && "bg-yellow-600 hover:bg-yellow-700"
                        )}
                      >
                        <HelpCircle className="h-5 w-5" />
                        <span className="text-xs">{t('questions.question.confidenceUncertain', 'Not sure')}</span>
                      </Button>
                      <Button
                        type="button"
                        variant={selectedConfidence === 'dont-know' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedConfidence('dont-know')}
                        className={cn(
                          "h-auto py-3 flex-col gap-1",
                          selectedConfidence === 'dont-know' && "bg-red-600 hover:bg-red-700"
                        )}
                      >
                        <ZapConfused className="h-5 w-5" />
                        <span className="text-xs">{t('questions.question.confidenceDontKnow', 'No idea')}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSubmit} disabled={!userAnswer.trim() || submitAnswer.isPending}>
                      {submitAnswer.isPending ? (
                        t('questions.question.submitting', 'Submitting...')
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t('questions.question.submit', 'Submit Answer')}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {isSubmitted && (
                <div className="flex items-center gap-2">
                  {submitResult?.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {showSolution && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('questions.solution.title', 'Solution')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                  {solution}
                </pre>
                {explanation && (
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      {t('questions.solution.explanation', 'Explanation')}
                    </h4>
                    <p className="text-sm text-muted-foreground">{explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('questions.question.navigation', 'Navigation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={skipQuestion}
                  className="flex-1"
                  disabled={currentIndex === shuffledQueue.length - 1}
                >
                  {t('review.skip', 'Skip')}
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  {currentIndex === shuffledQueue.length - 1 ? t('review.finish', 'Finish') : t('common.next', 'Next')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">{t('common.back', 'Back to Dashboard')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
