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
      <div style={{ 
        height: '100vh', 
        background: 'var(--bg-primary)', 
        color: '#ef4444', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '20px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700' }}>Wystąpił błąd podczas ładowania danych</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-subtle)', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
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
    <div style={{ 
      height: '100vh', 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      padding: '24px',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '40px',
      overflowY: 'auto',
      scrollbarGutter: 'stable'
    }}>
      <Navbar user={user} />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <ActionHero 
          lastLesson={lastLesson} 
          streak={streak} 
        />
        
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Twoje ścieżki nauki</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Wybierz ścieżkę, aby zobaczyć szczegóły</p>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Suma postępów: {totalProgress}%</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {paths.map(path => <PathCard key={path.id} path={path} />)}
          </div>
        </section>
      </main>
    </div>
  )
}
