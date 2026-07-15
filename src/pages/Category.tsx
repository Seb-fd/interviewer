import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { Progress } from '@components/ui/progress'
import { QuestionCard } from '@components/dashboard/question-card'
import { DifficultyFilter } from '@components/dashboard/difficulty-filter'
import { ModeSelector } from '@components/dashboard/mode-selector'
import { ProgressRing } from '@components/dashboard/progress-ring'
import { ArrowLeft, Target, Zap, BookOpen } from 'lucide-react'
import { useCategory, useQuestions } from '@/hooks'

const iconMap: Record<string, string> = {
  Shield: '🛡️',
  Users: '👥',
  Zap: '⚡',
  ShoppingCart: '🛒',
  Glass: '🍺',
  BookOpen: '📖',
  Code: '💻',
  Database: '🗄️',
  Lock: '🔒',
  Wifi: '📡',
  Layers: '📚',
  TestTube: '🧪',
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<'study' | 'exam'>('study')

  const { data: category, isLoading: categoryLoading } = useCategory(slug || '')
  const { data: questions = [], isLoading: questionsLoading } = useQuestions(slug || '', selectedDifficulty)

  const completedCount = questions.filter(q => q.completed).length
  const correctCount = questions.filter(q => q.completed && q.correct).length
  const progress = questions.length > 0 ? (completedCount / questions.length) * 100 : 0

  if (categoryLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-96 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">{t('questions.categoryNotFound', 'Category not found')}</h1>
        <Link to="/dashboard" className="text-primary hover:underline mt-4 block">
          {t('questions.backToDashboard', 'Back to Dashboard')}
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {iconMap[category.icon] || '📦'}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isSpanish ? category.nameEs : category.nameEn}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isSpanish ? category.descriptionEs : category.descriptionEn}
              </p>
            </div>
          </div>
        </div>
        <ProgressRing progress={progress} size={60} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('questions.totalQuestions', 'Total Questions')}
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('questions.completed', 'Completed')}
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <Progress value={progress} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.accuracy', 'Accuracy')}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedCount > 0 ? Math.round((correctCount / completedCount) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {correctCount} / {completedCount} {t('dashboard.correct', 'correct')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <DifficultyFilter
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
        />
        <ModeSelector
          mode={selectedMode}
          onModeChange={setSelectedMode}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t('questions.title', 'Questions')}
          </h2>
          <Badge variant="outline">
            {questions.length} {t('questions.results', 'results')}
          </Badge>
        </div>

        {questionsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {t('questions.noQuestions', 'No questions for selected filters')}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                slug={question.slug}
                titleEn={question.titleEn}
                titleEs={question.titleEs}
                difficulty={question.difficulty}
                type={question.type}
                points={question.points}
                completed={question.completed}
                correct={question.correct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
