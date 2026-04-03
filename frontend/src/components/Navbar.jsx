import UserDropdown from './UserDropdown'

export default function Navbar({ user }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      padding: '12px 32px', position: 'sticky', top: '0', zIndex: 100
    }}>
      <div style={{ color: 'var(--cyan-light)', fontWeight: '800', fontSize: '18px', letterSpacing: '1px' }}>
        KURSAI
      </div>
      
      <div style={{ display: 'flex', gap: '32px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>
        <span style={{ color: 'var(--text-primary)', cursor: 'pointer' }}>Kurs</span>
        <span style={{ cursor: 'pointer' }}>Materiały</span>
      </div>

      <UserDropdown user={user} />
    </nav>
  )
}
