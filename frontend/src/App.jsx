import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminEditorPage from './pages/AdminEditorPage'
import AdminBlogPage from './pages/AdminBlogPage'
import MaterialsPage from './pages/MaterialsPage'
import LandingPage from './pages/LandingPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import './styles/globals.css'

const CoursePage = lazy(() => import('./pages/CoursePage'))

const CoursePageFallback = () => (
  <div className="h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
)

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        {/* Publiczne */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Chronione */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/materials" element={<ProtectedRoute><MaterialsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route
          path="/kurs/:pathSlug"
          element={
            <ProtectedRoute>
              <Suspense fallback={<CoursePageFallback />}>
                <CoursePage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/edit/:lessonId" element={<ProtectedRoute requiredRole="admin"><AdminEditorPage /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute requiredRole="admin"><AdminBlogPage /></ProtectedRoute>} />

        {/* Wildcard — landing page zamiast dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}