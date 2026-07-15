import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">
            {t('errors.pageNotFound.title', 'Page Not Found')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('errors.pageNotFound.description', 'The page you are looking for does not exist or has been moved.')}
          </p>
        </div>
        <Link to="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            {t('errors.pageNotFound.backHome', 'Back to Home')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
