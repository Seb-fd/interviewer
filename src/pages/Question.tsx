import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Textarea } from '@components/ui/textarea'
import { Progress } from '@components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, ArrowRight, Lightbulb, CheckCircle, XCircle, MessageSquare, Timer, Zap, Brain, HelpCircle, Zap as ZapConfused, AlertTriangle, BookOpen } from 'lucide-react'
import { cn, formatTime, normalizeAnswer } from '@/lib/utils'
import { useSubmitAnswer, useQuestions } from '@/hooks'
import { useQuestionStore, useProgressStore, useUIStore } from '@/stores'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ResourcesPanel } from '@/components/ui/resources-panel'
import { EducationalFeedback } from '@/components/ui/educational-feedback'
import { generateResources } from '@/lib/resources-generator'
import { useAutoHint } from '@/hooks/useAutoHint'

const TIME_LIMITS: Record<string, number> = {
  basic: 60,
  intermediate: 120,
  advanced: 180,
  senior: 300,
}

export default function QuestionPage() {
  const { slug, id: questionId } = useParams<{ slug: string; id: string }>()
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const {
    timeSpent,
    hintsRevealed,
    userAnswer,
    isSubmitted,
    showSolution,
    isSubmitting,
    isTimerRunning,
    selectedConfidence,
    startTimer,
    tickTimer,
    revealHint,
    setUserAnswer,
    setIsSubmitted,
    setIsSubmitting,
    setShowSolution,
    setSelectedConfidence,
    resetQuestion,
  } = useQuestionStore()

  const { currentStreak } = useProgressStore()
  const questionMode = useUIStore(state => state.questionMode)

  const submitAnswer = useSubmitAnswer()

  const [resultDialogOpen, setResultDialogOpen] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ isCorrect: boolean; scoreEarned: number } | null>(null)
  const [confidenceError, setConfidenceError] = useState(false)
  const [timeUpDialogOpen, setTimeUpDialogOpen] = useState(false)

  const { data: questions = [], isLoading } = useQuestions(slug || undefined)

  const currentQuestion = questions.find(q => q.id === questionId)
  const currentIndex = questions.findIndex(q => q.id === questionId)
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null

  const hints = isSpanish ? currentQuestion?.hintsEs || [] : currentQuestion?.hintsEn || []
  const solution = isSpanish ? currentQuestion?.solutionEs || '' : currentQuestion?.solutionEn || ''
  const explanation = isSpanish ? currentQuestion?.explanationEs || '' : currentQuestion?.explanationEn || ''

  const resources = useMemo(() => {
    if (!currentQuestion) return []
    return generateResources(currentQuestion)
  }, [currentQuestion])

  const isExamMode = questionMode === 'exam'
  const isLearnMode = questionMode === 'learn'
  const isPracticeMode = questionMode === 'practice'
  const isReviewMode = questionMode === 'review'
  const hasTimer = isExamMode || isPracticeMode
  const timeLimit = currentQuestion ? TIME_LIMITS[currentQuestion.difficulty] || 180 : 180
  const timeRemaining = timeLimit - timeSpent
  const isTimeWarning = isExamMode && timeRemaining <= 30 && timeRemaining > 0
  const isTimeCritical = isExamMode && timeRemaining <= 10 && timeRemaining > 0

  const { shouldPromptHint, dismissPrompt } = useAutoHint({
    isActive: isLearnMode && !isSubmitted,
    totalHints: hints.length,
    hintsRevealed,
  })

  const timerStartedRef = useRef(false)

  useEffect(() => {
    if (currentQuestion && !isSubmitted && !timerStartedRef.current && hasTimer) {
      timerStartedRef.current = true
      startTimer()
    }
    if (isSubmitted) {
      timerStartedRef.current = false
    }
  }, [currentQuestion, isSubmitted, startTimer, hasTimer])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && !isSubmitted && hasTimer) {
      interval = setInterval(() => {
        tickTimer()
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, isSubmitted, tickTimer, hasTimer])

  useEffect(() => {
    if (hasTimer && timeRemaining <= 0 && !isSubmitted && !isSubmitting) {
      setTimeUpDialogOpen(true)
    }
  }, [hasTimer, timeRemaining, isSubmitted, isSubmitting])

  useEffect(() => {
    return () => {
      resetQuestion()
    }
  }, [resetQuestion])

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || !userAnswer.trim()) {
      toast.error(t('questions.question.attemptRequired', 'Please write your answer first'))
      return
    }

    const needsConfidence = isPracticeMode || isReviewMode
    if (needsConfidence && !selectedConfidence) {
      setConfidenceError(true)
      toast.error(t('questions.question.confidenceRequired', 'Please select your confidence level'))
      return
    }

    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(solution)

    setIsSubmitting(true)
    setConfidenceError(false)
    try {
      const result = await submitAnswer.mutateAsync({
        questionId: currentQuestion.id,
        categorySlug: slug || '',
        answer: userAnswer,
        timeSpent: timeSpent,
        hintsUsed: hintsRevealed,
        isCorrect,
        difficulty: currentQuestion.difficulty,
        currentStreak,
        confidence: isExamMode ? 'uncertain' : selectedConfidence ?? undefined,
        mode: questionMode,
      })
      setSubmitResult(result)
      setResultDialogOpen(true)
      setShowSolution(true)
      setIsSubmitted(true)
    } catch {
      toast.error(t('errors.generic', 'Something went wrong. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }, [currentQuestion, userAnswer, timeSpent, hintsRevealed, submitAnswer, setIsSubmitting, setIsSubmitted, setShowSolution, t, solution, slug, currentStreak, selectedConfidence, isExamMode, isPracticeMode, isReviewMode, questionMode])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">
          {t('questions.categoryNotFound', 'Question not found')}
        </h1>
        <Link to={`/category/${slug}`} className="text-primary hover:underline mt-4 block">
          {t('questions.question.backToCategory', 'Back to category')}
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/category/${slug}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              {isSpanish ? currentQuestion.titleEs : currentQuestion.titleEn}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isLearnMode && (
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  aria-label={t('learnMode.badgeLabel', 'Learn mode active')}
                >
                  <BookOpen className="h-3 w-3 mr-1" aria-hidden="true" />
                  {t('learnMode.badge', 'Learn Mode')}
                </Badge>
              )}
              <Badge variant={
                currentQuestion.difficulty === 'basic' ? 'basic' :
                currentQuestion.difficulty === 'intermediate' ? 'intermediate' :
                currentQuestion.difficulty === 'advanced' ? 'advanced' : 'senior'
              }>
                {t(`questions.difficulty.${currentQuestion.difficulty}`)}
              </Badge>
              <Badge variant="outline">
                {t(`questions.types.${currentQuestion.type}`)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {hasTimer && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border',
              isTimeCritical && 'border-red-500 bg-red-500/20',
              isTimeWarning && !isTimeCritical && 'border-yellow-500 bg-yellow-500/10',
              timeSpent > 300 && 'border-red-500/50 bg-red-500/10'
            )}>
              {isTimeCritical && <AlertTriangle className="h-4 w-4 text-red-500" />}
              <Timer className={cn(
                'h-4 w-4',
                isTimeCritical && 'text-red-500',
                isTimeWarning && !isTimeCritical && 'text-yellow-500',
                timeSpent > 300 && 'text-red-500'
              )} />
              <span className={cn(
                'font-mono',
                isTimeCritical && 'text-red-500 font-bold',
                isTimeWarning && !isTimeCritical && 'text-yellow-500',
                timeSpent > 300 && 'text-red-500'
              )}>
                {formatTime(Math.max(0, timeRemaining))}
                <span className="text-xs ml-1">/ {formatTime(timeLimit)}</span>
              </span>
            </div>
          )}
          {!hasTimer && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-muted-foreground">{formatTime(timeSpent)}</span>
            </div>
          )}
          {(isPracticeMode || isExamMode) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">+{currentQuestion.points}</span>
            </div>
          )}
        </div>
      </div>

      <Progress value={hasTimer ? (timeRemaining / timeLimit) * 100 : (timeSpent / 600) * 100} className={cn("h-1", hasTimer && timeRemaining <= 30 && 'bg-red-500')} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('questions.question.description', 'Description')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {isSpanish ? currentQuestion.descriptionEs : currentQuestion.descriptionEn}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="answer" className="w-full">
            <TabsList className={cn("grid w-full", "grid-cols-3")}>
              <TabsTrigger value="answer" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('questions.question.yourAnswer', 'Your Answer')}
              </TabsTrigger>
              {(isPracticeMode || isReviewMode) && (
                <TabsTrigger value="hints" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  {t('questions.question.hints', 'Hints')}
                  {hintsRevealed > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                      {hintsRevealed}
                    </Badge>
                  )}
                </TabsTrigger>
              )}
              <TabsTrigger value="resources" className="gap-2" id="resources-tab">
                <BookOpen className="h-4 w-4" />
                {t('resources.title', 'Resources')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="answer" className="mt-4 space-y-4">
              <Textarea
                placeholder={
                  currentQuestion.type === 'coding'
                    ? t('questions.question.placeholderCoding')
                    : t('questions.question.placeholderConceptual')
                }
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value)
                  setConfidenceError(false)
                }}
                className="min-h-[200px] font-mono text-sm"
                disabled={isSubmitted}
              />
              {!isSubmitted && (
                <>
                  {(isPracticeMode || isReviewMode) && (
                    <div className="space-y-3">
                      <div className={cn(
                        "flex items-center gap-2 text-sm font-medium",
                        confidenceError ? "text-red-500" : "text-muted-foreground"
                      )}>
                        <Brain className="h-4 w-4" />
                        {t('questions.question.confidenceTitle', 'How confident are you?')}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={selectedConfidence === 'know' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setSelectedConfidence('know')
                            setConfidenceError(false)
                          }}
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
                          onClick={() => {
                            setSelectedConfidence('uncertain')
                            setConfidenceError(false)
                          }}
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
                          onClick={() => {
                            setSelectedConfidence('dont-know')
                            setConfidenceError(false)
                          }}
                          className={cn(
                            "h-auto py-3 flex-col gap-1",
                            selectedConfidence === 'dont-know' && "bg-red-600 hover:bg-red-700"
                          )}
                        >
                          <ZapConfused className="h-5 w-5" />
                          <span className="text-xs">{t('questions.question.confidenceDontKnow', 'No idea')}</span>
                        </Button>
                      </div>
                      {confidenceError && (
                        <p className="text-sm text-red-500">
                          {t('questions.question.confidenceRequired', 'Please select your confidence level')}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={handleSubmit} disabled={!userAnswer.trim() || isSubmitting}>
                      {isSubmitting ? (
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
                <>
                  {isLearnMode && submitResult && (
                    <EducationalFeedback
                      question={currentQuestion}
                      isCorrect={submitResult.isCorrect}
                      userAnswer={userAnswer}
                      solution={solution}
                      explanation={explanation}
                      className="mt-4"
                    />
                  )}
                  {!isLearnMode && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {submitResult?.isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{t('questions.question.correct', 'Correct!')}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span>{t('questions.question.incorrect', 'Incorrect')}</span>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="hints" className="mt-4 space-y-3">
              {hints.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t('questions.question.noHints', 'No hints available')}
                </p>
              ) : (
                <>
                  {hints.slice(0, hintsRevealed).map((hint, index) => (
                    <Card key={index} className="border-yellow-500/20 bg-yellow-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <p className="text-sm">{hint}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {hintsRevealed < hints.length && (
                    <Button
                      variant="outline"
                      onClick={revealHint}
                      className="w-full"
                    >
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {t('questions.question.revealHint', { remaining: hints.length - hintsRevealed })}
                    </Button>
                  )}

                  {isLearnMode && shouldPromptHint && hintsRevealed > 0 && hintsRevealed < hints.length && (
                    <Card className="border-blue-500/30 bg-blue-500/5 mt-3">
                      <CardContent className="p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-blue-500" aria-hidden="true" />
                          <span className="text-muted-foreground">
                            {t('learnMode.stuckPrompt', 'Stuck? A hint might help you forward.')}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={dismissPrompt}
                          aria-label={t('learnMode.dismissPrompt', 'Dismiss hint suggestion')}
                          className="h-7 w-7 p-0"
                        >
                          <XCircle className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <ResourcesPanel resources={resources} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('questions.question.navigation', 'Navigation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {t('questions.question.questionOf', { current: currentIndex + 1, total: questions.length, defaultValue: `Question ${currentIndex + 1} of ${questions.length}` })}
              </div>
              <div className="flex gap-2">
                {prevQuestion && (
                  <Link to={`/category/${slug}/question/${prevQuestion.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      {t('common.previous', 'Prev')}
                    </Button>
                  </Link>
                )}
                {nextQuestion && (
                  <Link to={`/category/${slug}/question/${nextQuestion.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-1">
                      {t('common.next', 'Next')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('questions.question.statistics', 'Statistics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('questions.question.timeSpent', 'Time spent')}
                </span>
                <span className="font-mono">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('questions.question.hintsUsed', 'Hints used')}
                </span>
                <span>{hintsRevealed} / {hints.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t('questions.question.answer', 'Answer')}
                </span>
                <span>{userAnswer.trim() ? userAnswer.split('\n').length + ' ' + t('questions.question.lines', 'lines') : t('questions.question.empty', 'Empty')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={timeUpDialogOpen} onOpenChange={setTimeUpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              {t('questions.timer.timeUp', "Time's Up!")}
            </DialogTitle>
            <DialogDescription>
              Your time for this question has run out. Your answer will be submitted now.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button onClick={() => {
              setTimeUpDialogOpen(false)
              handleSubmit()
            }}>
              Submit Answer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {showSolution
                ? t('questions.solution.title', 'Solution')
                : submitResult?.isCorrect
                  ? t('questions.question.correct', 'Correct!')
                  : t('questions.question.incorrect', 'Incorrect')
              }
            </DialogTitle>
            <DialogDescription>
              {showSolution
                ? t('questions.question.hereIsSolution', 'Here is the reference solution')
                : submitResult?.isCorrect
                  ? t('questions.question.youEarned', 'You earned') + ` ${submitResult.scoreEarned} ${t('questions.question.points', 'points')}`
                  : t('questions.question.keepPracticing', 'Keep practicing to improve')
              }
            </DialogDescription>
          </DialogHeader>

          {showSolution && (isPracticeMode || isReviewMode || isLearnMode) && (
            <>
              {explanation && (
                <Card className="border-blue-500/20 bg-blue-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      {t('questions.solution.explanation', 'Explanation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {explanation}
                    </p>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {t('questions.solution.title', 'Solution')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                    {solution}
                  </pre>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setResultDialogOpen(false)}>
              {t('common.close', 'Close')}
            </Button>
            {nextQuestion && (
              <Link to={`/category/${slug}/question/${nextQuestion.id}`}>
                <Button>
                  {t('questions.question.nextQuestion', 'Next Question')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
            {!nextQuestion && (
              <Link to={`/category/${slug}`}>
                <Button>
                  {t('questions.question.backToCategory', 'Back to Category')}
                </Button>
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
