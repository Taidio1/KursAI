export default function PathCard({ path }) {
  const isStarted = path.progress > 0
  const isComplete = path.progress === 100

  return (
    <div style={{
      background: 'var(--bg-secondary)', 
      border: `1px solid ${isStarted ? (isComplete ? 'var(--border-subtle)' : 'var(--cyan-border)') : 'var(--border-subtle)'}`,
      borderRadius: '20px', padding: '24px', transition: 'transform 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ 
          width: '48px', height: '48px', 
          background: isStarted ? 'var(--cyan-dim)' : 'rgba(255,255,255,0.03)', 
          borderRadius: '12px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '24px' 
        }}>{path.icon}</div>
        
        {isComplete ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: '700', padding: '4px 8px', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>UKOŃCZONO</div>
        ) : isStarted && (
          <div style={{ background: 'var(--cyan)', color: 'white', fontSize: '10px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px' }}>W TOKU</div>
        )}
      </div>

      <h5 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>{path.title}</h5>
      
      {isStarted ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Postęp</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{path.progress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
            <div style={{ width: `${path.progress}%`, height: '100%', background: 'var(--cyan-gradient)', borderRadius: '3px' }} />
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px', lineHeight: '1.4' }}>{path.subtitle}</p>
      )}

      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        {isStarted ? (
          <><span>🔥 {path.streak || 0} dni</span><span>•</span><span>📍 {path.lessonsDone}/{path.lessonsTotal} lekcji</span></>
        ) : (
          <span style={{ color: 'var(--amber-light)', fontWeight: '700' }}>ZACZNIJ PRZYGODĘ →</span>
        )}
      </div>
    </div>
  )
}
