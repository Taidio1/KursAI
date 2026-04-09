import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PageTransition from '../components/PageTransition'

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-primary)',
  },
  card: {
    width: '360px',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  logo: {
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--cyan-light)',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  title: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'var(--cyan-gradient)',
    borderRadius: 'var(--radius-md)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  success: {
    color: '#34d399',
    fontSize: '13px',
    textAlign: 'center',
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: 'https://kapi.tojest.dev/login',
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <PageTransition>
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div>
          <div style={styles.logo}>KursAI 2026</div>
          <div style={styles.title}>Utwórz konto</div>
        </div>
        <input
          style={styles.input}
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {error && <div style={styles.error}>{error}</div>}
        {success && (
          <div style={styles.success}>
            Konto utworzone! Sprawdź email. Przekierowuję...
          </div>
        )}
        <button style={styles.button} type="submit" disabled={loading || success}>
          {loading ? 'Rejestracja...' : 'Zarejestruj się'}
        </button>
        <div style={styles.footer}>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </div>
      </form>
    </div>
    </PageTransition>
  )
}
