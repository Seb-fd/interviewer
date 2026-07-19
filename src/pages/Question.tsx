import { useEffect, useState, useCallback, useRef } from 'react'
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
import { ArrowLeft, ArrowRight, Lightbulb, CheckCircle, XCircle, MessageSquare, Eye, Timer, Zap } from 'lucide-react'
import { cn, formatTime, getGuestId } from '@/lib/utils'
import { useSubmitAnswer, useQuestions } from '@/hooks'
import { useQuestionStore } from '@/stores'
import { toast } from 'sonner'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function QuestionPage() {
  const { slug, questionId } = useParams<{ slug: string; questionId: string }>()
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
    startTimer,
    tickTimer,
    revealHint,
    setUserAnswer,
    setIsSubmitted,
    setIsSubmitting,
    setShowSolution,
    resetQuestion,
  } = useQuestionStore()

  const submitAnswer = useSubmitAnswer()

  const [resultDialogOpen, setResultDialogOpen] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ isCorrect: boolean; scoreEarned: number } | null>(null)

  const { data: questions = [], isLoading } = useQuestions(slug || undefined)
  const currentQuestion = questions.find(q => q.id === questionId)
  const currentIndex = questions.findIndex(q => q.id === questionId)
  const prevQuestion = currentIndex > 0 ? questions[currentIndex - 1] : null
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null

  const hints = isSpanish ? currentQuestion?.hintsEs || [] : currentQuestion?.hintsEn || []
  const solution = isSpanish ? currentQuestion?.solutionEs || '' : currentQuestion?.solutionEn || ''

  const timerStartedRef = useRef(false)

  useEffect(() => {
    if (currentQuestion && !isSubmitted && !timerStartedRef.current) {
      timerStartedRef.current = true
      startTimer()
    }
    if (isSubmitted) {
      timerStartedRef.current = false
    }
  }, [currentQuestion, isSubmitted, startTimer])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        tickTimer()
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, isSubmitted, tickTimer])

  useEffect(() => {
    return () => {
      resetQuestion()
    }
  }, [resetQuestion])

  const handleSubmit = useCallback(async () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const isCorrect = userAnswer.trim().toLowerCase() === solution.trim().toLowerCase()
    const pointsEarned = isCorrect ? Math.max(0, currentQuestion.points - (hintsRevealed * 10) - Math.floor(timeSpent / 10)) : 0

    setIsSubmitting(true)
    try {
      const result = await submitAnswer.mutateAsync({
        userId: getGuestId(),
        questionId: currentQuestion.id,
        categoryId: slug || '',
        answer: userAnswer,
        timeSpent,
        hintsUsed: hintsRevealed,
        isCorrect,
        points: pointsEarned,
      })
      setSubmitResult(result)
      setResultDialogOpen(true)
      setIsSubmitted(true)
    } catch {
      toast.error(t('errors.generic', 'Something went wrong. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }, [currentQuestion, userAnswer, timeSpent, hintsRevealed, submitAnswer, setIsSubmitting, setIsSubmitted, t, solution, slug])

  const handleShowSolution = () => {
    setShowSolution(true)
    setResultDialogOpen(true)
  }

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
            <div className="flex items-center gap-2 mt-1">
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
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border',
            timeSpent > 300 && 'border-red-500/50 bg-red-500/10'
          )}>
            <Timer className={cn('h-4 w-4', timeSpent > 300 && 'text-red-500')} />
            <span className={cn('font-mono', timeSpent > 300 && 'text-red-500')}>
              {formatTime(timeSpent)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">+{currentQuestion.points}</span>
          </div>
        </div>
      </div>

      <Progress value={(timeSpent / 600) * 100} className="h-1" />

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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="answer" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t('questions.question.yourAnswer', 'Your Answer')}
              </TabsTrigger>
              <TabsTrigger value="hints" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                {t('questions.question.hints', 'Hints')}
                {hintsRevealed > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                    {hintsRevealed}
                  </Badge>
                )}
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
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                disabled={isSubmitted}
              />
              <div className="flex gap-3">
                {!isSubmitted ? (
                  <>
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
                    <Button variant="outline" onClick={handleShowSolution}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('questions.question.showSolution', 'Show Solution')}
                    </Button>
                  </>
                ) : (
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
              </div>
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
                      {t('questions.question.revealHint', `Reveal hint (${hints.length - hintsRevealed} remaining)`)}
                    </Button>
                  )}
                </>
              )}
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

          {showSolution && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                  {solution}
                </pre>
              </CardContent>
            </Card>
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
