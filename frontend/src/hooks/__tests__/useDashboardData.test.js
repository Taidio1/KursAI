import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDashboardData } from '../useDashboardData'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    }))
  }
}))

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user-id' } })
}))

describe('useDashboardData', () => {
  it('should start in loading state', () => {
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.loading).toBe(true)
  })
})
