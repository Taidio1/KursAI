import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { syncNotionContent } from '../services/adminService'

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function handleSync() {
    if (!secret) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = await syncNotionContent(secret)
      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Panel Administratora</h1>
        <p className="admin-user">Zalogowany jako: {user?.email}</p>

        <div className="sync-box">
          <input
            type="password"
            className="admin-input"
            placeholder="Sekret administracyjny..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            disabled={status === 'loading'}
          />
          <button 
            className={`admin-button ${status === 'loading' ? 'loading' : ''}`}
            onClick={handleSync}
            disabled={status === 'loading' || !secret}
          >
            {status === 'loading' ? 'Synchronizowanie...' : 'Synchronizuj z Notion'}
          </button>
        </div>

        {status === 'success' && result && (
          <div className="status-box success">
            <h3>✅ Sukces!</h3>
            <p>Lekcje: {result.lessons_synced}</p>
            <p>Slajdy: {result.slides_created}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-box error">
            <h3>❌ Błąd</h3>
            <p>{errorMsg}</p>
          </div>
        )}

        <button className="logout-btn" onClick={handleLogout}>
          Wyloguj się
        </button>
      </div>

      <style jsx>{`
        .admin-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          padding: 20px;
        }
        .admin-container {
          width: 100%;
          max-width: 400px;
          background: var(--bg-secondary);
          padding: 32px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .admin-title {
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--cyan-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .admin-user {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .sync-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .admin-input {
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          border-color: var(--cyan-light);
        }
        .admin-button {
          padding: 14px;
          background: var(--cyan-gradient);
          color: white;
          font-weight: bold;
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          transition: transform 0.1s, opacity 0.2s;
        }
        .admin-button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.1);
        }
        .admin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .status-box {
          margin-top: 24px;
          padding: 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
        }
        .status-box.success {
          background: var(--cyan-dim);
          border: 1px solid var(--cyan-border);
          color: var(--cyan-light);
        }
        .status-box.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }
        .logout-btn {
          margin-top: 32px;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
          border: none;
        }
        .logout-btn:hover {
          color: white;
        }
      `}</style>
    </div>
  )
}
