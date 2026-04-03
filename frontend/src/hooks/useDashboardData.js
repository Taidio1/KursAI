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
    if (!user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Fetch paths
        const { data: rawPaths, error: pErr } = await supabase.from('paths').select('*')
        if (pErr) throw pErr

        // 2. Fetch all lessons and their path associations
        const { data: lessonsData, error: lErr } = await supabase
          .from('lessons')
          .select('id, course:courses(path_id)')
        
        if (lErr) throw lErr

        // 3. Fetch user progress
        const { data: progressData, error: prErr } = await supabase
          .from('user_progress')
          .select('lesson_id, completed_at, updated_at')
          .eq('user_id', user.id)
        if (prErr) throw prErr

        // 4. Aggregate Path Progress
        const aggregatedPaths = rawPaths.map(path => {
          const pathLessons = (lessonsData || []).filter(l => l.course?.path_id === path.id)
          const lessonsTotal = pathLessons.length
          const completedLessonIds = new Set(
            (progressData || [])
              .filter(p => p.completed_at)
              .map(p => p.lesson_id)
          )
          const lessonsDone = pathLessons.filter(l => completedLessonIds.has(l.id)).length
          const progress = lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0
          
          return {
            ...path,
            progress,
            lessonsDone,
            lessonsTotal,
            // Fallback icons based on slug
            icon: path.slug === 'wspolna' ? '🏁' : path.slug === 'no_code' ? '🛠' : '💻'
          }
        })

        // 5. Calculate Last Lesson (ActionHero)
        const sortedProgress = [...(progressData || [])].sort(
          (a, b) => new Date(b.updated_at || b.completed_at) - new Date(a.updated_at || a.completed_at)
        )

        if (sortedProgress.length > 0) {
          const { data: lastLessonData, error: lastErr } = await supabase
            .from('lessons')
            .select('title, course:courses(title, path_id)')
            .eq('id', sortedProgress[0].lesson_id)
            .single()
          
          if (!lastErr && lastLessonData) {
            setLastLesson({
              title: lastLessonData.title,
              pathName: lastLessonData.course?.title || 'Wprowadzenie',
              icon: aggregatedPaths.find(p => p.id === lastLessonData.course?.path_id)?.icon || '💻'
            })
          }
        }

        // 6. Calculate Streak
        const completionDates = new Set(
          (progressData || [])
            .filter(p => p.completed_at)
            .map(p => new Date(p.completed_at).toDateString())
        )
        
        let currentStreak = 0
        let checkDate = new Date()
        // Start from today or yesterday (if today is not completed yet)
        if (!completionDates.has(checkDate.toDateString())) {
          checkDate.setDate(checkDate.getDate() - 1)
        }

        while (completionDates.has(checkDate.toDateString())) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
        setStreak(currentStreak)

        setPaths(aggregatedPaths)
        setLoading(false)
      } catch (err) {
        console.error('Dashboard Fetch Error:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return { paths, lastLesson, streak, loading, error }
}
