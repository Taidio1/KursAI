import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useDashboardData() {
  const { user } = useAuth()
  const [paths, setPaths] = useState([])
  const [lastLesson, setLastLesson] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Mocking delay for now
        setTimeout(() => {
          setLoading(false)
        }, 0)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return { paths, lastLesson, streak, loading, error }
}
