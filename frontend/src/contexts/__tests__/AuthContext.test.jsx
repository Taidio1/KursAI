import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient()

vi.mock('../../lib/supabase', () => {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  }
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
        signOut: vi.fn().mockResolvedValue({}),
      },
      channel: vi.fn().mockReturnValue(mockChannel),
      removeChannel: vi.fn().mockResolvedValue({}),
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { role: 'user' } }),
        upsert: vi.fn().mockResolvedValue({}),
      }),
    },
  }
})

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

function TestConsumer() {
  const { user, role, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `user:${user.id}` : 'no-user'} role:{role ?? 'null'}</div>
}

function renderWithProviders() {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>
  )
}

it('resolves loading quickly when no session (INITIAL_SESSION with null)', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    cb('INITIAL_SESSION', null)
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })

  renderWithProviders()

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  }) // domyślny timeout 1000ms — fallback timeout już nie blokuje

  expect(screen.getByText('no-user role:null')).toBeInTheDocument()
})

it('provides user from session and fetches role', async () => {
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    cb('INITIAL_SESSION', { user: { id: 'user-123' } })
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })

  renderWithProviders()

  await waitFor(() => {
    expect(screen.getByText('user:user-123 role:user')).toBeInTheDocument()
  })

  expect(localStorage.getItem('kursai-role')).toBe('user')
})

it('initializes role from localStorage without waiting for fetchRole', async () => {
  localStorage.setItem('kursai-role', 'admin')
  const { supabase } = await import('../../lib/supabase')

  // fetchRole nigdy nie resolve'uje — sprawdzamy rolę z cache zanim serwer odpowie
  supabase.from.mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnValue(new Promise(() => {})),
    upsert: vi.fn().mockResolvedValue({}),
  })

  let resolveAuthChange
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    resolveAuthChange = () => cb('INITIAL_SESSION', { user: { id: 'user-123' } })
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })

  renderWithProviders()

  // Przed wywołaniem callbacka — loading=true
  expect(screen.getByText('Loading...')).toBeInTheDocument()

  // Wywołujemy callback — loading=false natychmiast, rola z cache
  resolveAuthChange()

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  // fetchRole wciąż pending — rola pochodzi z localStorage
  expect(screen.getByText('user:user-123 role:admin')).toBeInTheDocument()
})

it('clears role from localStorage on SIGNED_OUT', async () => {
  localStorage.setItem('kursai-role', 'user')
  const { supabase } = await import('../../lib/supabase')
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    cb('SIGNED_OUT', null)
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })

  renderWithProviders()

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  expect(localStorage.getItem('kursai-role')).toBeNull()
  expect(screen.getByText('no-user role:null')).toBeInTheDocument()
})
