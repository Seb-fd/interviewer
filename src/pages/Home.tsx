import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { ArrowRight, BookOpen, Code, Trophy, Flame, Target } from 'lucide-react'
import { useCategories } from '@/hooks'

export default function Home() {
  const { t, i18n } = useTranslation()
  const isSpanish = i18n.language === 'es'
  const { data: categories = [] } = useCategories()

  const projectCategories = categories.filter(c => c.type === 'project')
  const techCategories = categories.filter(c => c.type === 'tech')

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 text-center border-b">
        <div className="container max-w-4xl mx-auto space-y-6">
          <Badge variant="outline" className="mb-4">
            <Flame className="h-3 w-3 mr-1 text-orange-500" />
            {t('home.subtitle', 'Master your technical skills with project-based challenges')}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {t('home.title', 'Tech Interview Challenge')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('home.subtitle', 'Master your technical skills with project-based challenges')}
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                {t('home.getStarted', 'Get Started')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="outline" size="lg" className="gap-2">
                <Trophy className="h-4 w-4" />
                {t('home.viewDashboard', 'View Dashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-b">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {t('home.modes.title', 'Choose Your Mode')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle>{t('home.modes.project.title', 'By Project')}</CardTitle>
                <CardDescription>
                  {t('home.modes.project.description', 'Practice questions based on your portfolio projects')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projectCategories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{isSpanish ? (cat.nameEs || cat.nameEn) : (cat.nameEn || cat.nameEs)}</span>
                      <Badge variant="secondary">{cat.totalQuestions}</Badge>
                    </Link>
                  ))}
                </div>
                <Link to="/dashboard" className="block mt-4">
                  <Button variant="ghost" className="w-full gap-2">
                    {t('home.modes.project.viewAll', 'View All Projects')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6" />
                </div>
                <CardTitle>{t('home.modes.tech.title', 'By Technology')}</CardTitle>
                <CardDescription>
                  {t('home.modes.tech.description', 'Practice questions organized by technology stack')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techCategories.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{isSpanish ? (cat.nameEs || cat.nameEn) : (cat.nameEn || cat.nameEs)}</span>
                      <Badge variant="secondary">{cat.totalQuestions}</Badge>
                    </Link>
                  ))}
                </div>
                <Link to="/dashboard" className="block mt-4">
                  <Button variant="ghost" className="w-full gap-2">
                    {t('home.modes.tech.viewAll', 'View All Technologies')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              {t('home.features.title', 'Why Practice With Us')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">
                {t('home.features.streaks.title', 'Daily Streaks')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('home.features.streaks.description', 'Build consistency with daily practice streaks and earn rewards')}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">
                {t('home.features.badges.title', 'Badges & Achievements')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('home.features.badges.description', 'Unlock badges as you complete challenges and master topics')}
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">
                {t('home.features.progress.title', 'Track Progress')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t('home.features.progress.description', 'Monitor your improvement with detailed statistics and analytics')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-semibold">{t('common.appName', 'Tech Interview')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('home.footer', { defaultValue: 'Built for developers, by developers' })}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">
              {t('common.nav.dashboard', 'Dashboard')}
            </Link>
            <Link to="/leaderboard" className="hover:text-foreground">
              {t('common.nav.leaderboard', 'Leaderboard')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
