import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useSessionSync } from '../hooks/useSessionSync'

export const AuthContext = createContext(null)

async function fetchRole(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role ?? 'user'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useSessionSync(user)

  useEffect(() => {
    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null
      if (mounted) setUser(u)
      
      try {
        const r = u ? await fetchRole(u.id) : null
        if (mounted) setRole(r)
      } catch {
        if (mounted) setRole('user')
      } finally {
        if (mounted && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT')) {
           setLoading(false)
        }
      }
    })

    const fallbackTimeout = setTimeout(() => {
      if (mounted && loading) setLoading(false)
    }, 1500)

    return () => {
      mounted = false
      clearTimeout(fallbackTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, role, loading }), [user, role, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
