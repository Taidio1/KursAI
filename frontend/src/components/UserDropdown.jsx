import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const initial = user?.user_metadata?.name?.[0].toUpperCase() ?? user?.email?.[0].toUpperCase() ?? 'U'

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/50 transition-all group"
      >
        <div className="flex flex-col items-end mr-1 hidden sm:flex">
          <span className="text-[11px] font-bold text-foreground leading-tight uppercase tracking-wide">
            {user?.user_metadata?.name || user?.email?.split('@')[0]}
          </span>
          <span className="text-[9px] font-medium text-muted-foreground leading-tight uppercase tracking-widest">
            {user?.role || 'Uczeń'}
          </span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
          {initial}
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[99] bg-transparent"
          />
          <div className="absolute right-0 top-[calc(100%+12px)] w-56 p-1.5 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/10 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2.5 mb-1.5 border-b border-border/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Twoje konto</p>
              <p className="text-xs font-semibold text-foreground truncate">{user?.email}</p>
            </div>
            
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all group">
              <User size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              Profil
            </button>
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all group">
              <Settings size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
              Ustawienia
            </button>
            
            <div className="h-px bg-border/50 my-1.5" />
            
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-all group"
            >
              <LogOut size={15} className="text-red-500" />
              Wyloguj
            </button>
          </div>
        </>
      )}
    </div>
  )
}
