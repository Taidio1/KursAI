import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function useDashboardData() {
  const { user, session } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: async () => {
      const token = session?.access_token
      if (!token) throw new Error('Brak sesji — zaloguj się ponownie')

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const response = await fetch(`${BACKEND_URL}/dashboard/user-stats`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.detail || 'Błąd serwera')
        }
        return response.json()
      } catch (err) {
        if (err.name === 'AbortError') throw new Error('Serwer nie odpowiada — sprawdź czy backend jest uruchomiony')
        throw err
      } finally {
        clearTimeout(timeoutId)
      }
    },
    enabled: !!user?.id,
  })

  return {
    paths: data?.paths || [],
    lastLesson: data?.lastLesson || null,
    streak: data?.streak || 0,
    loading: isLoading,
    error: error?.message || null,
  }
}
