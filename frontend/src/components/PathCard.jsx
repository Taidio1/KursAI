import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { courseService } from '../services/courseService'
import { pathCache } from '../lib/pathCache'

export default function PathCard({ path }) {
  const navigate = useNavigate()
  const isStarted = path.progress > 0
  const isComplete = path.progress === 100

  function handleMouseEnter() {
    if (path.slug && !pathCache.get(path.slug)) {
      courseService.getPathDetails(path.slug)
        .then(data => pathCache.set(path.slug, data))
        .catch(() => {})
    }
  }

  return (
    <motion.div
      onClick={() => path.slug && navigate(`/kurs/${path.slug}`)}
      onMouseEnter={handleMouseEnter}
      className="glass card-hover group relative overflow-hidden"
      style={{
        borderRadius: '24px',
        padding: '28px',
        cursor: 'pointer',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: `radial-gradient(circle at top right, hsla(var(--primary) / 0.08), transparent), hsla(var(--glass))`
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Ikona w tle */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        fontSize: '120px',
        opacity: 0.07,
        transform: 'rotate(-15deg)',
        pointerEvents: 'none',
        transition: 'all 0.5s ease',
      }} className="group-hover:scale-110 group-hover:rotate-0">
        {path.icon}
      </div>

      {/* Góra karty */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ 
            width: '44px', height: '44px', 
            background: isStarted ? 'hsla(var(--primary) / 0.2)' : 'hsla(var(--foreground) / 0.05)', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '22px',
            border: '1px solid hsla(var(--glass-border))'
          }}>{path.icon}</div>
          
          {isComplete ? (
            <div style={{ 
              background: 'hsla(var(--muted) / 0.5)', 
              color: 'var(--text-secondary)', 
              fontSize: '10px', 
              fontWeight: '800', 
              padding: '4px 10px', 
              borderRadius: '20px',
              border: '1px solid hsla(var(--glass-border))',
              letterSpacing: '0.05em'
            }}>UKOŃCZONO</div>
          ) : isStarted ? (
            <div style={{ 
              background: 'linear-gradient(135deg, hsla(var(--primary)), #3b82f6)', 
              color: 'white', 
              fontSize: '10px', 
              fontWeight: '800', 
              padding: '4px 10px', 
              borderRadius: '20px',
              boxShadow: '0 4px 12px hsla(var(--primary) / 0.3)'
            }}>W TOKU</div>
          ) : null}
        </div>

        <h5 style={{ 
          fontSize: '18px', 
          fontWeight: '800', 
          marginBottom: '8px', 
          color: 'hsl(var(--foreground))',
          letterSpacing: '-0.01em'
        }}>{path.title}</h5>
        
        {!isStarted && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5', maxWidth: '90%' }}>
            {path.subtitle}
          </p>
        )}
      </div>

      {/* Dół karty */}
      <div>
        {isStarted && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Twój postęp</span>
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: '800' }}>{path.progress}%</span>
            </div>
            <div style={{ height: '8px', background: 'hsla(var(--foreground) / 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${path.progress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, hsla(var(--primary)), #60a5fa)', 
                borderRadius: '4px',
                boxShadow: '0 0 10px hsla(var(--primary) / 0.5)'
              }} />
            </div>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px', 
          color: 'var(--text-secondary)', 
          paddingTop: '16px', 
          borderTop: '1px solid hsla(var(--glass-border))' 
        }}>
          {isStarted ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🔥 {path.streak || 0} dni</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>📚 {path.lessonsDone}/{path.lessonsTotal} lekcji</span>
            </div>
          ) : (
            <span style={{ 
              color: 'hsla(var(--primary))', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px' 
            }}>Rozpocznij naukę <span style={{ fontSize: '14px' }}>→</span></span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
