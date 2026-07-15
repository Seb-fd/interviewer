import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n/config'

export function useLanguage() {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language as SupportedLanguage
  const isSpanish = currentLanguage === 'es'

  const changeLanguage = (lang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang)
    }
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'es' : 'en'
    changeLanguage(newLang)
  }

  return {
    currentLanguage,
    isSpanish,
    changeLanguage,
    toggleLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }
}
