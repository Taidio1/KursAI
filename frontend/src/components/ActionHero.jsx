export default function ActionHero({ lastLesson, streak = 7 }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(13, 13, 42, 0) 100%)',
      border: '1px solid var(--cyan-border)', borderRadius: '24px',
      padding: '48px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          background: 'var(--cyan-dim)', padding: '4px 12px', 
          borderRadius: '20px', border: '1px solid var(--cyan-border)', 
          marginBottom: '20px' 
        }}>
          <span style={{ width: '6px', height: '6px', background: 'var(--cyan)', borderRadius: '50%', boxShadow: '0 0 8px var(--cyan)' }} />
          <span style={{ color: 'var(--cyan-light)', fontWeight: '700', fontSize: '10px', letterSpacing: '1px' }}>WZNÓW NAUKĘ</span>
        </div>
        <h3 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
          {lastLesson?.title ?? 'Zacznij od podstaw'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
          Twoja ostatnia lekcja • {lastLesson?.pathName ?? 'Wprowadzenie'}
        </p>
        
        <button style={{
          background: 'var(--cyan-gradient)', color: 'white', padding: '14px 36px',
          borderRadius: '12px', fontWeight: '700', fontSize: '16px', border: 'none',
          cursor: 'pointer', boxShadow: '0 10px 30px rgba(6, 182, 212, 0.3)',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          Kontynuuj naukę <span style={{ fontSize: '20px' }}>→</span>
        </button>
      </div>
      
      <div style={{ textAlign: 'right', zIndex: 1 }}>
         <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔥 {streak}</div>
         <div style={{ color: 'var(--cyan-light)', fontWeight: '700', fontSize: '12px', letterSpacing: '1px' }}>DNI STREAKU</div>
      </div>
      
      <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '140px', opacity: 0.1, transform: 'rotate(15deg)' }}>
        {lastLesson?.icon ?? '💻'}
      </div>
    </div>
  )
}
