import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Hasła nie są identyczne' })
    }
    if (newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'Nowe hasło musi mieć co najmniej 6 znaków' })
    }

    setLoading(true)

    // 1. Weryfikacja starego hasła poprzez ponowne logowanie
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })

    if (authError) {
      setLoading(false)
      return setMessage({ type: 'error', text: 'Obecne hasło jest niepoprawne' })
    }

    // 2. Aktualizacja do nowego hasła
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    if (updateError) {
      setMessage({ type: 'error', text: updateError.message })
    } else {
      setMessage({ type: 'success', text: 'Hasło zostało pomyślnie zaktualizowane!' })
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setLoading(false)
  }

  return (
    <PageTransition>
      <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden font-sans antialiased">
        <Navbar user={user} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 rounded-xl border border-border bg-card/50 hover:bg-accent transition-all">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">Profil Użytkownika</h1>
                <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">Zarządzaj swoim kontem</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Informacje o koncie */}
              <div className="md:col-span-1 space-y-6">
                <div className="rounded-2xl border border-border bg-card/50 p-6 glass">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-4 uppercase tracking-tight text-foreground">Twoje dane</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-semibold truncate text-foreground">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rola</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                        {user?.user_metadata?.role || 'Uczeń'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formularz zmiany hasła */}
              <div className="md:col-span-2">
                <form onSubmit={handleUpdatePassword} className="rounded-2xl border border-border bg-card/50 p-8 glass space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <KeyRound size={20} />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Zmiana hasła</h3>
                  </div>

                  {message.text && (
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                      message.type === 'error' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                        : 'bg-green-500/10 border-green-500/20 text-green-500'
                    }`}>
                      {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                      <p className="text-sm font-semibold">{message.text}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Obecne hasło</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      placeholder="Wprowadź obecne hasło"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nowe hasło</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Powtórz nowe hasło</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                  >
                    {loading ? 'Aktualizowanie...' : 'Zaktualizuj hasło'}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  )
}
