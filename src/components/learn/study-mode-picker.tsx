import { useTranslation } from 'react-i18next'
import { BookOpen, Dumbbell, RefreshCw, Timer } from 'lucide-react'
import { StudyModeCard } from './study-mode-card'

export function StudyModePicker() {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StudyModeCard
        icon={BookOpen}
        title={t('learning.studyModes.learn.title', 'Learn')}
        description={t(
          'learning.studyModes.learn.description',
          'Guided learning with hints and feedback'
        )}
        to="/dashboard"
        cta={t('learning.studyModes.learn.cta', 'Start Learning')}
        iconClassName="bg-blue-500/10 text-blue-500"
        variant="primary"
      />
      <StudyModeCard
        icon={Dumbbell}
        title={t('learning.studyModes.practice.title', 'Practice')}
        description={t(
          'learning.studyModes.practice.description',
          'Free practice with spaced repetition'
        )}
        to="/dashboard"
        cta={t('learning.studyModes.practice.cta', 'Practice Now')}
        iconClassName="bg-green-500/10 text-green-500"
      />
      <StudyModeCard
        icon={RefreshCw}
        title={t('learning.studyModes.review.title', 'Review')}
        description={t(
          'learning.studyModes.review.description',
          'Spaced repetition review session'
        )}
        to="/review"
        cta={t('learning.studyModes.review.cta', 'Start Review')}
        iconClassName="bg-purple-500/10 text-purple-500"
      />
      <StudyModeCard
        icon={Timer}
        title={t('learning.studyModes.exam.title', 'Exam')}
        description={t(
          'learning.studyModes.exam.description',
          'Timed exam simulation'
        )}
        to="/dashboard"
        cta={t('learning.studyModes.exam.cta', 'Take Exam')}
        iconClassName="bg-orange-500/10 text-orange-500"
      />
    </div>
  )
}
