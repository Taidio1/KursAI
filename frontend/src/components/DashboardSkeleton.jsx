const shimmerStyle = (overrides) => ({
  background: 'linear-gradient(90deg, var(--bg-secondary) 25%, rgba(255,255,255,0.05) 50%, var(--bg-secondary) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
  borderRadius: '6px',
  ...overrides,
})

export default function DashboardSkeleton() {
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
    }}>
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Navbar skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={shimmerStyle({ width: '120px', height: '24px' })} />
        <div style={shimmerStyle({ width: '36px', height: '36px', borderRadius: '50%' })} />
      </div>

      {/* ActionHero skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={shimmerStyle({ width: '60%', height: '36px' })} />
        <div style={shimmerStyle({ width: '40%', height: '20px' })} />
      </div>

      {/* PathCards section skeleton */}
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          <div style={shimmerStyle({ width: '200px', height: '22px' })} />
          <div style={shimmerStyle({ width: '260px', height: '16px' })} />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {[1, 2].map(i => (
            <div
              key={i}
              data-testid="skeleton-card"
              style={shimmerStyle({ height: '140px', borderRadius: '12px' })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
