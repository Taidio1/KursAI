import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserDropdown from './UserDropdown'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Library, ShieldCheck, BookOpen } from 'lucide-react'

export default function Navbar() {
  const { user, role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isMaterials = location.pathname === '/materials'
  const isDashboard = location.pathname === '/dashboard'
  const isAdmin = location.pathname.startsWith('/admin')
  const isBlog = location.pathname.startsWith('/blog')

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <span className="font-black text-lg italic tracking-tighter text-primary-foreground">AH</span>
            </div>
            <span className="text-xl font-black uppercase tracking-tighter transition-all hover:text-primary">
              Agentic Hub
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                isDashboard ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard size={15} className={isDashboard ? 'text-primary' : ''} />
              Kursy
            </Link>
            <Link
              to="/materials"
              className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                isMaterials ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Library size={15} className={isMaterials ? 'text-primary' : ''} />
              Materiały
            </Link>
            <Link
              to="/blog"
              className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                isBlog ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={15} className={isBlog ? 'text-primary' : ''} />
              Blog
            </Link>
            {role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-all ${
                  isAdmin ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldCheck size={15} className={isAdmin ? 'text-primary' : ''} />
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground lg:flex">
                Beta Access
              </div>
              <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
              <ThemeToggle />
              <UserDropdown user={user} />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link
                to="/login"
                className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all border border-border rounded-full px-4 py-1.5"
              >
                Zaloguj się
              </Link>
              <Link
                to="/register"
                className="text-[12px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-4 py-1.5 hover:opacity-90 transition-all"
              >
                Zarejestruj
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}