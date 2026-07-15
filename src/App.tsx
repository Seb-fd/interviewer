import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { PageLayout } from '@components/layout'
import { ProtectedRoute } from '@components/auth'
import { Suspense, lazy } from 'react'

const Home = lazy(() => import('@pages/Home'))
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Category = lazy(() => import('@pages/Category'))
const Question = lazy(() => import('@pages/Question'))
const Profile = lazy(() => import('@pages/Profile'))
const Leaderboard = lazy(() => import('@pages/Leaderboard'))
const NotFound = lazy(() => import('@pages/NotFound'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

function App() {
  return (
    <>
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
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  )
}

export default App
