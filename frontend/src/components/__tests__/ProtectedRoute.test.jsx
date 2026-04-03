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

function wrap(user, loading = false) {
  return (
    <AuthContext.Provider value={{ user, loading }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
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

it('renders children when user is authenticated', () => {
  render(wrap({ id: 'abc' }, false))
  expect(screen.getByText('Protected')).toBeInTheDocument()
})

it('shows nothing while loading', () => {
  render(wrap(null, true))
  expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  expect(screen.queryByText('Protected')).not.toBeInTheDocument()
})
