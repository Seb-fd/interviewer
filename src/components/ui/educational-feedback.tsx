import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { CheckCircle, AlertCircle, Lightbulb, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/db/types'

interface EducationalFeedbackProps {
  question: Question
  isCorrect: boolean
  userAnswer: string
  solution: string
  explanation: string
  className?: string
}

type Tone = 'correct' | 'partial' | 'incorrect'

function getTone(isCorrect: boolean, userAnswer: string, solution: string): Tone {
  if (isCorrect) return 'correct'

  const normalizedUser = userAnswer.toLowerCase().trim()
  const normalizedSolution = solution.toLowerCase().trim()

  if (normalizedUser.length === 0) return 'incorrect'

  const solutionWords = normalizedSolution.split(/\s+/).filter(w => w.length > 3)
  const userWords = new Set(normalizedUser.split(/\s+/))
  const matchCount = solutionWords.filter(w => userWords.has(w)).length
  const matchRatio = solutionWords.length > 0 ? matchCount / solutionWords.length : 0

  if (matchRatio >= 0.5) return 'partial'
  return 'incorrect'
}

function getEncouragingHeaderKey(tone: Tone): string {
  switch (tone) {
    case 'correct':
      return 'feedback.headers.correct'
    case 'partial':
      return 'feedback.headers.partial'
    case 'incorrect':
      return 'feedback.headers.incorrect'
  }
}

function getEncouragingMessageKey(tone: Tone): string {
  switch (tone) {
    case 'correct':
      return 'feedback.messages.correct'
    case 'partial':
      return 'feedback.messages.partial'
    case 'incorrect':
      return 'feedback.messages.incorrect'
  }
}

export function EducationalFeedback({
  question,
  isCorrect,
  userAnswer,
  solution,
  explanation,
  className,
}: EducationalFeedbackProps) {
  const { t } = useTranslation()
  const [showComparison, setShowComparison] = useState(false)
  const [showExplanation, setShowExplanation] = useState(true)

  const tone = getTone(isCorrect, userAnswer, solution)
  const headerKey = getEncouragingHeaderKey(tone)
  const messageKey = getEncouragingMessageKey(tone)

  const toneStyles = {
    correct: {
      bgClass: 'bg-green-500/10 border-green-500/30',
      iconClass: 'text-green-600 dark:text-green-400',
      Icon: CheckCircle,
    },
    partial: {
      bgClass: 'bg-amber-500/10 border-amber-500/30',
      iconClass: 'text-amber-600 dark:text-amber-400',
      Icon: AlertCircle,
    },
    incorrect: {
      bgClass: 'bg-orange-500/10 border-orange-500/30',
      iconClass: 'text-orange-600 dark:text-orange-400',
      Icon: AlertCircle,
    },
  } as const

  const styles = toneStyles[tone]

  return (
    <Card
      role="status"
      aria-live="polite"
      className={cn('border-2', styles.bgClass, className)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <styles.Icon
            className={cn('h-6 w-6 flex-shrink-0 mt-0.5', styles.iconClass)}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={cn('font-semibold text-base', styles.iconClass)}
              id={`feedback-header-${question.id}`}
            >
              {t(headerKey, tone === 'correct' ? 'Nice work!' : tone === 'partial' ? 'Almost there!' : 'Not quite')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t(messageKey, tone === 'correct'
                ? 'You got it right. Let\'s explore why this works.'
                : tone === 'partial'
                ? 'You\'re on the right track. Let\'s review the key details.'
                : 'Good try! This is a tricky concept. Let\'s walk through it.'
              )}
            </p>
          </div>
        </div>

        {!isCorrect && solution && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="h-8 px-2 -ml-2 text-xs"
              aria-expanded={showComparison}
              aria-controls={`comparison-${question.id}`}
            >
              {showComparison ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
              {t('feedback.viewComparison', 'Compare your answer')}
            </Button>

            {showComparison && (
              <div
                id={`comparison-${question.id}`}
                className="grid gap-2 p-3 bg-background/50 rounded-md border text-sm"
              >
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('feedback.yourAnswer', 'Your answer')}
                  </span>
                  <p className="font-mono mt-1 break-words">
                    {userAnswer || <em className="text-muted-foreground">{t('feedback.noAnswer', 'No answer provided')}</em>}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {t('feedback.expectedAnswer', 'Expected answer')}
                  </span>
                  <p className="font-mono mt-1 break-words">{solution}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {explanation && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="h-8 px-2 -ml-2 text-xs"
              aria-expanded={showExplanation}
              aria-controls={`explanation-${question.id}`}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {showExplanation ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
              {showExplanation
                ? t('feedback.hideExplanation', 'Hide explanation')
                : t('feedback.showExplanation', 'Show explanation')
              }
            </Button>

            {showExplanation && (
              <div
                id={`explanation-${question.id}`}
                className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20 text-sm"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm leading-relaxed">{explanation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            {tone === 'correct'
              ? t('feedback.tips.correct', 'This concept is solid. Keep building on it!')
              : tone === 'partial'
              ? t('feedback.tips.partial', 'Review the key differences above and try a similar problem.')
              : t('feedback.tips.incorrect', 'No worries - check the resources tab for deeper explanations.')
            }
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
