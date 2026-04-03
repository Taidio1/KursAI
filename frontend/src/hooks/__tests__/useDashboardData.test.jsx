import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboardData } from '../useDashboardData'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    global.fetch = vi.fn()
  })

  it('should start in loading state', () => {
    global.fetch.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useDashboardData(), { wrapper })
    expect(result.current.loading).toBe(true)
  })

  it('should fetch and return data from API', async () => {
    const mockStats = {
      paths: [{ id: 'p1', title: 'Path 1', progress: 50 }],
      lastLesson: { id: 'l1', title: 'Lesson 1' },
      streak: 5
    }

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStats)
    })

    const { result } = renderHook(() => useDashboardData(), { wrapper })
    
    await waitFor(() => expect(result.current.loading).toBe(false))
    
    expect(result.current.paths).toHaveLength(1)
    expect(result.current.paths[0].progress).toBe(50)
    expect(result.current.streak).toBe(5)
    expect(result.current.lastLesson.title).toBe('Lesson 1')
  })

  it('should handle API errors', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: 'Błąd serwera' })
    })

    const { result } = renderHook(() => useDashboardData(), { wrapper })
    
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Błąd serwera')
  })
})
