import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

const SESSION_KEY_STORAGE = 'kursai-session-key'

async function registerSession(userId) {
  let key = sessionStorage.getItem(SESSION_KEY_STORAGE)
  if (!key) {
    key = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY_STORAGE, key)
  }

  await supabase
    .from('active_sessions')
    .upsert({ user_id: userId, session_key: key, updated_at: new Date().toISOString() })

  return key
}

export function useSessionSync(user) {
  const realtimeChannelRef = useRef(null)
  const wasAuthenticatedRef = useRef(false)

  const unsubscribe = () => {
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current)
      realtimeChannelRef.current = null
    }
  }

  const subscribe = (userId) => {
    unsubscribe()
    const channel = supabase
      .channel(`active_sessions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'active_sessions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const remoteKey = payload.new?.session_key
          const localKey = sessionStorage.getItem(SESSION_KEY_STORAGE)
          if (remoteKey && remoteKey !== localKey) {
            supabase.auth.signOut()
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_sessions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const remoteKey = payload.new?.session_key
          const localKey = sessionStorage.getItem(SESSION_KEY_STORAGE)
          if (remoteKey && remoteKey !== localKey) {
            supabase.auth.signOut()
          }
        }
      )
      .subscribe()
    realtimeChannelRef.current = channel
  }

  useEffect(() => {
    if (user) {
      wasAuthenticatedRef.current = true
      registerSession(user.id).then(() => subscribe(user.id))
    } else if (wasAuthenticatedRef.current) {
      // Only clear session key on actual signout, not during initial mount
      sessionStorage.removeItem(SESSION_KEY_STORAGE)
      unsubscribe()
    }
    return () => unsubscribe()
  }, [user?.id])
}
