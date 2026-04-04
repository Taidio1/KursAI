import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import DashboardPage from '../DashboardPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
    },
  },
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

it('shows skeleton instead of loading text while fetching data', () => {
  global.fetch = vi.fn(() => new Promise(() => {})) // nigdy nie resolve'uje
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <AuthContext.Provider value={{ user: { id: 'abc', user_metadata: { name: 'Jan' } }, loading: false }}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
  expect(screen.queryByText(/Ładowanie Twoich postępów/)).not.toBeInTheDocument()
  expect(document.querySelector('[data-testid="skeleton-card"]')).toBeInTheDocument()
})

function renderDashboard(user = { id: 'abc', user_metadata: { name: 'Jan' } }) {
  // Mock fetch for useDashboardData
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      paths: [
        { id: '1', title: 'Ścieżka Wspólna', progress: 0 },
        { id: '2', title: 'No-Code', progress: 0 },
        { id: '3', title: 'Kod', progress: 0 }
      ],
      lastLesson: null,
      streak: 0
    })
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, loading: false }}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

it('renders three course paths', async () => {
  renderDashboard()
  await waitFor(() => {
    expect(screen.getByText('Ścieżka Wspólna')).toBeInTheDocument()
    expect(screen.getByText(/No-Code/)).toBeInTheDocument()
    expect(screen.getByText(/Kod/)).toBeInTheDocument()
  })
})

it('shows user initial in header', async () => {
  renderDashboard()
  await waitFor(() => {
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})

it('calls signOut on logout button click', async () => {
  const { supabase } = await import('../../lib/supabase')
  renderDashboard()
  
  await waitFor(() => {
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  // Open dropdown
  await userEvent.click(screen.getByText('J'))
  
  // Click logout
  await userEvent.click(screen.getByText(/wyloguj/i))
  expect(supabase.auth.signOut).toHaveBeenCalled()
})
