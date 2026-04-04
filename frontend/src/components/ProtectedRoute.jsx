import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Spinner() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255,255,255,0.15)',
        borderTopColor: '#ffffff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && role === null) return <Spinner />
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}
