import { useAuth } from '../contexts/AuthContext'
import { useDashboardData } from '../hooks/useDashboardData'
import Navbar from '../components/Navbar'
import ActionHero from '../components/ActionHero'
import PathCard from '../components/PathCard'
import DashboardSkeleton from '../components/DashboardSkeleton'

export default function DashboardPage() {
  const { user } = useAuth()
  const { paths, lastLesson, streak, loading, error } = useDashboardData()
  
  if (loading) return <DashboardSkeleton />

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-5 bg-background text-foreground">
        <div className="text-xl font-extrabold text-red-500">Wystąpił błąd podczas ładowania danych</div>
        <div className="text-sm opacity-80">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="rounded-xl border border-border bg-secondary px-6 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  const totalProgress = paths.length > 0 
    ? Math.round(paths.reduce((acc, p) => acc + p.progress, 0) / paths.length) 
    : 0

  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden font-sans antialiased">
      <Navbar user={user} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
          <ActionHero 
            lastLesson={lastLesson} 
            streak={streak} 
          />
          
          <section>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h4 className="mb-1 text-xl font-extrabold tracking-tight text-foreground">Twoje ścieżki nauki</h4>
                <p className="text-sm text-muted-foreground">Kontynuuj swoją przygodę z AI</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
                Suma postępów: <span className="text-foreground">{totalProgress}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paths.map(path => <PathCard key={path.id} path={path} />)}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
