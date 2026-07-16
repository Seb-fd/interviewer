import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { Select } from '@components/ui/select'
import { Flame, Trophy, Target, Zap, BookOpen, Settings, User, Award, Check } from 'lucide-react'
import { BadgeItem } from '@components/dashboard/badge-item'
import { useCategories, useBadges } from '@/hooks'
import { useUIStore, useProgressStore } from '@/stores'
import { t } from 'i18next'

export default function Profile() {
  const { i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'

  const { data: categories = [] } = useCategories()
  const { data: badges = [] } = useBadges()

  const { language, theme, setLanguage, setTheme } = useUIStore()
  const { totalScore, totalQuestions, correctAnswers, currentStreak, categoryProgress, resetProgress } = useProgressStore()

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const totalQuestionsInSystem = categories.reduce((sum, c) => sum + c.totalQuestions, 0)
  const earnedBadges = badges.filter(b => b.earned)

  return (
    <div className="container py-8 space-y-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t('profile.title', 'Profile')}
          </TabsTrigger>
          <TabsTrigger value="badges" className="gap-2">
            <Award className="h-4 w-4" />
            {t('profile.badges', 'Badges')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            {t('profile.settings', 'Settings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="flex items-center gap-6">
            <Avatar fallback="G" className="h-24 w-24 text-xl" />
            <div>
              <h1 className="text-2xl font-bold">Guest</h1>
              <p className="text-muted-foreground">Local session</p>
              <div className="flex items-center gap-2 mt-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  {t('dashboard.streakDays', { count: currentStreak })} {t('gamification.streak.keepGoing', 'Keep it going!')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.totalScore', 'Total Score')}
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalScore}</div>
                <p className="text-xs text-muted-foreground">
                  {totalQuestions} {t('dashboard.answered', 'questions answered')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.accuracy', 'Accuracy')}
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accuracy}%</div>
                <p className="text-xs text-muted-foreground">
                  {correctAnswers} / {totalQuestions} {t('dashboard.correct', 'correct')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.questions', 'Questions')}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalQuestions}/{totalQuestionsInSystem}</div>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.completed', 'completed')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.badges', 'Badges')}
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{earnedBadges.length}/{badges.length}</div>
                <p className="text-xs text-muted-foreground">
                  {earnedBadges.length} {t('profile.earned', 'earned')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('profile.progressByCategory', 'Progress by Category')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {categories.slice(0, 6).map((cat) => {
                const progress = categoryProgress[cat.slug]
                const questionsCompleted = progress?.questionsCompleted?.length || 0
                const progressPercent = cat.totalQuestions > 0
                  ? (questionsCompleted / cat.totalQuestions) * 100
                  : 0

                return (
                  <Card key={cat.slug}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isSpanish ? cat.nameEs : cat.nameEn}
                      </CardTitle>
                      <CardDescription>
                        {questionsCompleted} / {cat.totalQuestions} {t('dashboard.questions', 'questions')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progressPercent} className="h-2" />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{Math.round(progressPercent)}%</span>
                        {progress?.accuracy !== undefined && (
                          <span>{t('dashboard.accuracy', 'Accuracy')}: {Math.round(progress.accuracy)}%</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('profile.earnedBadges', 'Earned Badges')}
            </h2>
            {earnedBadges.length === 0 ? (
              <Card className="p-8 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t('profile.noBadgesEarned', "You haven't earned any badges yet")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('profile.completeToUnlock', 'Complete questions to unlock badges')}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map((badge) => (
                  <BadgeItem
                    key={badge.slug}
                    name={isSpanish ? badge.nameEs : badge.nameEn}
                    tier={badge.tier}
                    earned={badge.earned}
                    progress={badge.progress}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t('profile.availableBadges', 'Available Badges')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badges.filter(b => !b.earned).map((badge) => (
                <BadgeItem
                  key={badge.slug}
                  name={isSpanish ? badge.nameEs : badge.nameEn}
                  tier={badge.tier}
                  earned={false}
                  progress={badge.progress}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.language', 'Language')}</CardTitle>
              <CardDescription>
                {t('profile.selectLanguage', 'Select your preferred language')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="gap-2"
                >
                  {language === 'en' && <Check className="h-4 w-4" />}
                  {t('profile.english', 'English')}
                </Button>
                <Button
                  variant={language === 'es' ? 'default' : 'outline'}
                  onClick={() => setLanguage('es')}
                  className="gap-2"
                >
                  {language === 'es' && <Check className="h-4 w-4" />}
                  {t('profile.spanish', 'Español')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.theme', 'Theme')}</CardTitle>
              <CardDescription>
                {t('profile.selectTheme', 'Choose your preferred color theme')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              >
                <option value="light">{t('profile.light', 'Light')}</option>
                <option value="dark">{t('profile.dark', 'Dark')}</option>
                <option value="system">{t('profile.system', 'System')}</option>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.dangerZone', 'Danger Zone')}</CardTitle>
              <CardDescription>
                {t('profile.dangerZoneWarning', 'Irreversible actions. Proceed with caution.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm(t('profile.resetConfirm', 'Are you sure? This cannot be undone.'))) {
                    resetProgress()
                  }
                }}
              >
                {t('profile.resetProgress', 'Reset Progress')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
