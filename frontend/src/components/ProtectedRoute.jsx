import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginRequired from './LoginRequired'

export default function ProtectedRoute({ children, requiredRole, showLoginRequired }) {
  const { user, role, loading } = useAuth()
  if (loading) return null
  if (!user) return showLoginRequired ? <LoginRequired /> : <Navigate to="/login" replace />
  if (requiredRole && role === null) return null
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}
