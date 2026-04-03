import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { syncNotionContent } from '../services/adminService'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function handleSync() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await syncNotionContent()
      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div style={styles.adminPage}>
      <div style={styles.adminContainer}>
        <h1 style={styles.adminTitle}>Panel Administratora</h1>
        <p style={styles.adminUser}>Zalogowany jako: {user?.email}</p>

        <div style={styles.syncBox}>
          <button 
            style={{
              ...styles.adminButton,
              ...(status === 'loading' ? styles.adminButtonLoading : {}),
              ...(status === 'loading' ? { opacity: 0.5, cursor: 'not-allowed' } : {})
            }}
            onClick={handleSync}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Synchronizowanie...' : 'Synchronizuj z Notion'}
          </button>
        </div>

        {status === 'success' && result && (
          <div style={{ ...styles.statusBox, ...styles.statusSuccess }}>
            <h3 style={{ marginBottom: '8px' }}>✅ Sukces!</h3>
            <p>Lekcje: {result.lessons_synced}</p>
            <p>Slajdy: {result.slides_created}</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ ...styles.statusBox, ...styles.statusError }}>
            <h3 style={{ marginBottom: '8px' }}>❌ Błąd</h3>
            <p>{errorMsg}</p>
          </div>
        )}

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Wyloguj się
        </button>
      </div>
    </div>
  )
}

const styles = {
  adminPage: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
    padding: '20px',
  },
  adminContainer: {
    width: '100%',
    maxWidth: '400px',
    background: 'var(--bg-secondary)',
    padding: '32px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  adminTitle: {
    fontSize: '24px',
    marginBottom: '8px',
    color: 'var(--cyan-light)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  adminUser: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginBottom: '32px',
  },
  syncBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  adminButton: {
    padding: '14px',
    background: 'var(--cyan-gradient)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.1s, opacity 0.2s',
  },
  statusBox: {
    marginTop: '24px',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
  },
  statusSuccess: {
    background: 'var(--cyan-dim)',
    border: '1px solid var(--cyan-border)',
    color: 'var(--cyan-light)',
  },
  statusError: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
  },
  logoutBtn: {
    marginTop: '32px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    textDecoration: 'underline',
    cursor: 'pointer',
    border: 'none',
  },
}
