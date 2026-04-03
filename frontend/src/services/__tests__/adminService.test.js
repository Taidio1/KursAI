import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncNotionContent } from '../adminService'

global.fetch = vi.fn()

describe('adminService', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('syncNotionContent sends POST request with correct headers', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'success', lessons_synced: 5, slides_created: 20 }),
    })

    const result = await syncNotionContent()

    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/sync/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': 'dev_secret',
      },
    })
    expect(result).toEqual({ lessons_synced: 5, slides_created: 20 })
  })

  it('throws error on failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Unauthorized' }),
    })

    await expect(syncNotionContent()).rejects.toThrow('Unauthorized')
  })
})
