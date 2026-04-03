import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function useDashboardData() {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', user?.id],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/dashboard/user-stats?user_id=${user.id}`)
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.detail || 'Błąd serwera')
      }
      return response.json()
    },
    enabled: !!user?.id,
  })

  return {
    paths: data?.paths || [],
    lastLesson: data?.lastLesson || null,
    streak: data?.streak || 0,
    loading: isLoading,
    error: error?.message || null
  }
}
