import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEn from './locales/en/common.json'
import commonEs from './locales/es/common.json'
import homeEn from './locales/en/home.json'
import homeEs from './locales/es/home.json'
import dashboardEn from './locales/en/dashboard.json'
import dashboardEs from './locales/es/dashboard.json'
import profileEn from './locales/en/profile.json'
import profileEs from './locales/es/profile.json'
import leaderboardEn from './locales/en/leaderboard.json'
import leaderboardEs from './locales/es/leaderboard.json'
import questionsEn from './locales/en/questions.json'
import questionsEs from './locales/es/questions.json'
import gamificationEn from './locales/en/gamification.json'
import gamificationEs from './locales/es/gamification.json'
import errorsEn from './locales/en/errors.json'
import errorsEs from './locales/es/errors.json'
import learningEn from './locales/en/learning.json'
import learningEs from './locales/es/learning.json'

export const defaultNS = 'common'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        home: homeEn,
        dashboard: dashboardEn,
        profile: profileEn,
        leaderboard: leaderboardEn,
        questions: questionsEn,
        gamification: gamificationEn,
        errors: errorsEn,
        learning: learningEn,
      },
      es: {
        common: commonEs,
        home: homeEs,
        dashboard: dashboardEs,
        profile: profileEs,
        leaderboard: leaderboardEs,
        questions: questionsEs,
        gamification: gamificationEs,
        errors: errorsEs,
        learning: learningEs,
      },
    },
    fallbackLng: 'en',
    defaultNS,
    ns: ['common', 'home', 'dashboard', 'profile', 'leaderboard', 'questions', 'gamification', 'errors', 'learning'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
