import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Flame, Trophy, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageToggle } from "@/components/common/language-toggle"
import { useProgressStore } from "@/stores"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { currentStreak } = useProgressStore()

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Trophy className="h-6 w-6 text-primary" />
          <Link to="/" className="font-semibold">
            {t('appName', 'Tech Interview')}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.home', 'Home')}
          </Link>
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.dashboard', 'Dashboard')}
          </Link>
          <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.leaderboard', 'Leaderboard')}
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{t('dashboard.streakDays', { count: currentStreak })}</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/profile">
              <User className="h-4 w-4 mr-1" />
              {t('nav.profile', 'Profile')}
            </Link>
          </Button>
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home', 'Home')}
            </Link>
            <Link
              to="/dashboard"
              className="text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.dashboard', 'Dashboard')}
            </Link>
            <Link
              to="/leaderboard"
              className="text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.leaderboard', 'Leaderboard')}
            </Link>
            <Link
              to="/profile"
              className="text-sm py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.profile', 'Profile')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
