import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDashboardData } from '../useDashboardData'
import { supabase } from '../../lib/supabase'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}))

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start in loading state', () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue(new Promise(() => {}))
      })
    })
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.loading).toBe(true)
  })

  it('should fetch and aggregate path progress', async () => {
    const mockPaths = [{ id: 'p1', slug: 'wspolna', title: 'Path 1' }]
    const mockLessons = [
      { id: 'l1', course: { path_id: 'p1' } },
      { id: 'l2', course: { path_id: 'p1' } }
    ]
    const mockProgress = [
      { lesson_id: 'l1', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]

    supabase.from.mockImplementation((table) => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
      }

      // Add a then method to the chain to simulate the final promise
      mockChain.then = vi.fn().mockImplementation((onFulfilled) => {
        let response = { data: [], error: null }
        if (table === 'paths') response = { data: mockPaths, error: null }
        if (table === 'lessons') response = { data: mockLessons, error: null }
        if (table === 'user_progress') response = { data: mockProgress, error: null }
        return Promise.resolve(onFulfilled(response))
      })

      if (table === 'lessons') {
        mockChain.single = vi.fn().mockResolvedValue({ 
          data: { title: 'L1', course: { title: 'C1', path_id: 'p1' } }, 
          error: null 
        })
      }

      return mockChain
    })

    const { result } = renderHook(() => useDashboardData())
    
    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 3000 })
    
    expect(result.current.paths).toHaveLength(1)
    expect(result.current.paths[0].progress).toBe(50)
    expect(result.current.paths[0].lessonsDone).toBe(1)
    expect(result.current.paths[0].lessonsTotal).toBe(2)
    expect(result.current.streak).toBe(1)
    expect(result.current.lastLesson).not.toBeNull()
    expect(result.current.lastLesson.title).toBe('L1')
  })
})
