import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useSessionSync } from '../hooks/useSessionSync'

export const AuthContext = createContext(null)

const ROLE_CACHE_KEY = 'kursai-role'

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
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_CACHE_KEY))
  const [loading, setLoading] = useState(true)

  useSessionSync(user)

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      const u = s?.user ?? null
      if (mounted) {
        setUser(u)
        setSession(s ?? null)
      }

      if (event === 'INITIAL_SESSION') {
        if (mounted) setLoading(false)
        if (u) {
          fetchRole(u.id)
            .then(r => {
              if (mounted) {
                localStorage.setItem(ROLE_CACHE_KEY, r)
                setRole(r)
              }
            })
            .catch(() => {})
        } else {
          if (mounted) {
            localStorage.removeItem(ROLE_CACHE_KEY)
            setRole(null)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem(ROLE_CACHE_KEY)
        if (mounted) {
          setRole(null)
          setLoading(false)
        }
      } else if (event === 'SIGNED_IN') {
        if (mounted) setLoading(false)
        if (u) {
          fetchRole(u.id)
            .then(r => {
              if (mounted) {
                localStorage.setItem(ROLE_CACHE_KEY, r)
                setRole(r)
              }
            })
            .catch(() => {})
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => ({ user, session, role, loading }), [user, session, role, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
