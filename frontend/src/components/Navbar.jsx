import { Link } from 'react-router-dom'
import UserDropdown from './UserDropdown'

export default function Navbar({ user }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      padding: '12px 32px', position: 'sticky', top: '0', zIndex: 100,
      margin: '8px'
    }}>
      <Link to="/dashboard" style={{ color: 'var(--cyan-light)', fontWeight: '800', fontSize: '18px', letterSpacing: '1px', textDecoration: 'none' }}>
        KURSAI
      </Link>
      
      <div style={{ display: 'flex', gap: '32px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}>
        <Link to="/kurs/wspolna" style={{ color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'none' }}>Kurs</Link>
        <Link to="/materials" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>Materiały</Link>
      </div>

      <UserDropdown user={user} />
    </nav>
  )
}

