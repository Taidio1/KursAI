import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import ProtectedRoute from '../ProtectedRoute'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

function wrap(user, loading = false, role = null, requiredRole = undefined) {
  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      <MemoryRouter initialEntries={['/target']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route
            path="/target"
            element={
              <ProtectedRoute requiredRole={requiredRole}>
                <div>Protected</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

it('redirects to /login when user is null and not loading', () => {
  render(wrap(null, false))
  expect(screen.getByText('Login Page')).toBeInTheDocument()
  expect(screen.queryByText('Protected')).not.toBeInTheDocument()
})

it('renders children when user is authenticated and no requiredRole', () => {
  render(wrap({ id: 'abc' }, false, 'user'))
  expect(screen.getByText('Protected')).toBeInTheDocument()
})

it('shows spinner while auth is loading', () => {
  render(wrap(null, true))
  expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  expect(screen.queryByText('Protected')).not.toBeInTheDocument()
})

it('renders children for user route even when role is null', () => {
  render(wrap({ id: 'abc' }, false, null))
  expect(screen.getByText('Protected')).toBeInTheDocument()
})

it('shows spinner for admin route when role is null (still loading from server)', () => {
  render(wrap({ id: 'abc' }, false, null, 'admin'))
  expect(screen.queryByText('Protected')).not.toBeInTheDocument()
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
})

it('redirects to /dashboard when role does not match requiredRole', () => {
  render(wrap({ id: 'abc' }, false, 'user', 'admin'))
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
  expect(screen.queryByText('Protected')).not.toBeInTheDocument()
})

it('renders children when role matches requiredRole', () => {
  render(wrap({ id: 'abc' }, false, 'admin', 'admin'))
  expect(screen.getByText('Protected')).toBeInTheDocument()
})
