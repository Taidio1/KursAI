import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import ActionHero from '../components/ActionHero'
import PathCard from '../components/PathCard'

const paths = [
  { slug: 'wspolna', title: 'Ścieżka Wspólna', subtitle: 'Fundamenty dla każdego', icon: '🏁', progress: 100, lessonsDone: 20, lessonsTotal: 20 },
  { slug: 'no_code', title: 'Ścieżka A – No-Code', subtitle: 'Automatyzacja procesów z wykorzystaniem n8n oraz Make.', icon: '🛠', progress: 0, lessonsDone: 0, lessonsTotal: 15 },
  { slug: 'kod', title: 'Ścieżka B – Kod', subtitle: 'Inżynieria AI dla deweloperów', icon: '💻', progress: 45, lessonsDone: 9, lessonsTotal: 20, streak: 7 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      padding: '24px',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '40px',
      overflowY: 'auto'
    }}>
      <Navbar user={user} />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <ActionHero 
          lastLesson={{ title: '04. Architektura Multi-Agent', pathName: 'Ścieżka B', icon: '💻' }} 
          streak={7} 
        />
        
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Twoje ścieżki nauki</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Wybierz ścieżkę, aby zobaczyć szczegóły</p>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Suma postępów: 45%</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {paths.map(path => <PathCard key={path.slug} path={path} />)}
          </div>
        </section>
      </main>
    </div>
  )
}
