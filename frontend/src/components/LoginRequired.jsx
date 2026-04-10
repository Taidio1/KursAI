import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import PageTransition from './PageTransition'
import { Lock, ArrowRight, Mail, KeyRound } from 'lucide-react'

export default function LoginRequired() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // Admini idą na /admin, zwykli userzy zostają — AuthContext zmieni `user`
    // i ProtectedRoute wyrenderuje children automatycznie
    if (profile?.role === 'admin') {
      navigate('/admin', { replace: true })
    }
    setLoading(false)
  }

  // Jeśli user zalogowany (race condition lub SSR), nic nie renderuj —
  // ProtectedRoute i tak pokaże właściwą stronę
  if (user) return null

  return (
    <PageTransition>
      <div className="flex h-screen flex-col bg-background text-foreground font-sans antialiased">
        <Navbar />

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Nagłówek z ikoną */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Lock size={24} className="text-primary" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Wymagane logowanie
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ta sekcja dostępna jest tylko dla zalogowanych użytkowników.
                <br />
                Zaloguj się, aby kontynuować.
              </p>
            </div>

            {/* Formularz */}
            <div className="rounded-2xl border border-border bg-card/60 p-8 shadow-xl shadow-black/5 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    placeholder="Adres email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Hasło */}
                <div className="relative">
                  <KeyRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Błąd */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-center text-[13px] text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  ) : (
                    <>
                      Zaloguj się
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Stopka */}
              <p className="mt-5 text-center text-[13px] text-muted-foreground">
                Nie masz konta?{' '}
                <a
                  href="/register"
                  className="font-semibold text-primary hover:underline"
                >
                  Zarejestruj się
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
