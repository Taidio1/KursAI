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

function TestConsumer() {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `user:${user.id}` : 'no-user'}</div>
}

it('provides null user when no session', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>
  )
  // Increase timeout because of fallbackTimeout in AuthProvider
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  }, { timeout: 3000 })
  
  expect(screen.getByText('no-user')).toBeInTheDocument()
})

it('provides user from session', async () => {
  const { supabase } = await import('../../lib/supabase')
  
  // To satisfy onAuthStateChange which is called in useEffect
  supabase.auth.onAuthStateChange.mockImplementation((cb) => {
    cb('INITIAL_SESSION', { user: { id: 'user-123' } })
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })

  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    </QueryClientProvider>
  )
  
  await waitFor(() => {
    expect(screen.getByText('user:user-123')).toBeInTheDocument()
  })
})
