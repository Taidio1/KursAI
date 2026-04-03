import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const initial = user?.user_metadata?.name?.[0].toUpperCase() ?? user?.email?.[0].toUpperCase() ?? 'U'

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--cyan-gradient)', border: '2px solid var(--cyan-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', color: 'white'
        }}>{initial}</div>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
      </div>

      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          />
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 12px)',
            background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', width: '180px', padding: '6px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)', zIndex: 1000
          }}>
            <div style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>👤 Profil</div>
            <div style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>⚙️ Ustawienia</div>
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
            <div 
              onClick={handleLogout}
              style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#f87171' }}
            >🚪 Wyloguj</div>
          </div>
        </>
      )}
    </div>
  )
}
