import { Outlet } from "react-router-dom"
import { Header } from "./header"
import { useTranslation } from "react-i18next"

export function PageLayout() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            {t('common.footer.platform', 'Tech Interview Challenge Platform')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('common.footer.builtBy', { name: 'Sebastian Florez' })}
          </p>
        </div>
      </footer>
    </div>
  )
}
