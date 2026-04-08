import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

import { supabase } from '../../lib/supabase'
import {
  fetchAdminStats,
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  createPath,
  updatePath,
  deletePath,
  createCourse,
  updateCourse,
  deleteCourse,
  updateLesson,
  deleteLesson,
} from '../adminService'

describe('fetchAdminStats', () => {
  it('zwraca statystyki platformy', async () => {
    const sessions = [{ user_id: 'abc', session_key: 'key1', updated_at: '2026-04-04' }]

    supabase.from.mockImplementation((table) => {
      if (table === 'active_sessions') {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: sessions, count: 2, error: null }),
          }),
        }
      }
      if (table === 'materials') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, count: 3, error: null }),
          }),
        }
      }
      // profiles, lessons
      const counts = { profiles: 5, lessons: 10 }
      return {
        select: vi.fn().mockResolvedValue({ data: null, count: counts[table] ?? 0, error: null }),
      }
    })

    const result = await fetchAdminStats()

    expect(result).toHaveProperty('usersCount', 5)
    expect(result).toHaveProperty('sessionsCount', 2)
    expect(result).toHaveProperty('lessonsCount', 10)
    expect(result).toHaveProperty('publishedMaterialsCount', 3)
    expect(result).toHaveProperty('sessions')
    expect(result.sessions).toEqual(sessions)
  })
})

describe('fetchMaterials', () => {
  beforeEach(() => {
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: '1', title: 'Test', is_published: true }],
        error: null,
      }),
    }
    supabase.from.mockReturnValue(chain)
  })

  it('pobiera materiały posortowane po created_at', async () => {
    const result = await fetchMaterials()
    expect(supabase.from).toHaveBeenCalledWith('materials')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Test')
  })
})

describe('createMaterial', () => {
  it('insertuje nowy materiał i zwraca go', async () => {
    const newMaterial = { title: 'Cursor', url: 'https://cursor.sh', category: 'Narzędzie', tags: [], is_published: false }
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'new-id', ...newMaterial }, error: null }),
    }
    supabase.from.mockReturnValue(chain)

    const result = await createMaterial(newMaterial)
    expect(supabase.from).toHaveBeenCalledWith('materials')
    expect(result.id).toBe('new-id')
  })
})

describe('updateMaterial', () => {
  it('aktualizuje materiał po id', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await updateMaterial('mat-id', { is_published: true })
    expect(chain.update).toHaveBeenCalledWith({ is_published: true })
    expect(chain.eq).toHaveBeenCalledWith('id', 'mat-id')
  })
})

describe('deleteMaterial', () => {
  it('usuwa materiał po id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await deleteMaterial('mat-id')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'mat-id')
  })
})

describe('createPath', () => {
  it('tworzy nową ścieżkę', async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'path-id', title: 'Nowa', slug: 'nowa' }, error: null }),
    }
    supabase.from.mockReturnValue(chain)

    const result = await createPath('Nowa', 'nowa', false)
    expect(result.slug).toBe('nowa')
  })
})

describe('updatePath', () => {
  it('aktualizuje ścieżkę po id', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await updatePath('path-id', { title: 'Zmieniona' })
    expect(chain.update).toHaveBeenCalledWith({ title: 'Zmieniona' })
  })
})

describe('deletePath', () => {
  it('usuwa ścieżkę po id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await deletePath('path-id')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'path-id')
  })
})

describe('createCourse', () => {
  it('tworzy kurs przypisany do ścieżki', async () => {
    const chain = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'course-id', title: 'Kurs', path_id: 'p1' }, error: null }),
    }
    supabase.from.mockReturnValue(chain)

    const result = await createCourse('Kurs', 'p1')
    expect(result.path_id).toBe('p1')
  })
})

describe('updateCourse', () => {
  it('aktualizuje kurs po id', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await updateCourse('c-id', { title: 'Nowy tytuł' })
    expect(chain.update).toHaveBeenCalledWith({ title: 'Nowy tytuł' })
  })
})

describe('deleteCourse', () => {
  it('usuwa kurs po id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await deleteCourse('c-id')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'c-id')
  })
})

describe('updateLesson', () => {
  it('aktualizuje lekcję po id', async () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await updateLesson('l-id', { title: 'Nowy tytuł' })
    expect(chain.update).toHaveBeenCalledWith({ title: 'Nowy tytuł' })
  })
})

describe('deleteLesson', () => {
  it('usuwa lekcję po id', async () => {
    const chain = {
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    }
    supabase.from.mockReturnValue(chain)

    await deleteLesson('l-id')
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'l-id')
  })
})
