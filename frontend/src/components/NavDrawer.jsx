import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Library, BookOpen, ShieldCheck, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function NavDrawer({ isOpen, onClose, user, role }) {
  const location = useLocation()

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const links = [
    { to: '/dashboard', label: 'Kursy', icon: LayoutDashboard },
    { to: '/materials', label: 'Materiały', icon: Library },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    ...(role === 'admin' ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[110]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Drawer panel */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-72 z-[120] bg-background border-r border-border flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-black text-sm italic tracking-tighter text-primary-foreground">AH</span>
                </div>
                <span className="text-lg font-black uppercase tracking-tighter">Agentic Hub</span>
              </Link>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
              {links.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon size={17} className={isActive ? 'text-primary' : ''} />
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border flex items-center justify-between flex-shrink-0">
              {user && (
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</span>
              )}
              <ThemeToggle />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
