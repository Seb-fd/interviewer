import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PageLayout } from '@components/layout'
import { ProtectedRoute } from '@components/auth'
import { OfflineIndicator } from '@components/common/offline-indicator'
import { InstallPWA } from '@components/common/install-pwa'
import { useRegisterSW } from '@/hooks/useRegisterSW'
import { Suspense, lazy } from 'react'

const Home = lazy(() => import('@pages/Home'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Category = lazy(() => import('@pages/Category'))
const Question = lazy(() => import('@pages/Question'))
const Profile = lazy(() => import('@pages/Profile'))
const Leaderboard = lazy(() => import('@pages/Leaderboard'))
const ReviewSession = lazy(() => import('@pages/ReviewSession'))
const NotFound = lazy(() => import('@pages/NotFound'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

function App() {
  useRegisterSW()

  return (
    <>
      <OfflineIndicator />
      <Routes>
        <Route element={<PageLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:slug"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Category />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:slug/question/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Question />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Profile />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <Leaderboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <ReviewSession />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <InstallPWA />
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
