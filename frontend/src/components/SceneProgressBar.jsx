/**
 * Pasek postępu w stylu Instagram Stories.
 * Każdy segment ma szerokość proporcjonalną do duration_seconds sceny.
 * Klik w segment = jump do tej sceny.
 */
export default function SceneProgressBar({ slides, activeSlideIdx, elapsedMs, onSceneSelect }) {
  if (!slides || slides.length === 0) return null

  const totalDuration = slides.reduce((sum, s) => sum + (s.duration_seconds || 180), 0)

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '10px 24px',
      flexShrink: 0,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {slides.map((slide, idx) => {
        const duration = slide.duration_seconds || 180
        const widthPct = (duration / totalDuration) * 100

        let fillPct = 0
        if (idx < activeSlideIdx) {
          fillPct = 100
        } else if (idx === activeSlideIdx) {
          fillPct = Math.min((elapsedMs / (duration * 1000)) * 100, 100)
        }

        return (
          <div
            key={idx}
            onClick={() => onSceneSelect(idx)}
            title={`Scena ${idx + 1}`}
            style={{
              flex: `${widthPct} 0 0`,
              height: '3px',
              background: 'var(--border-subtle)',
              borderRadius: '2px',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${fillPct}%`,
                background: 'var(--cyan)',
                borderRadius: '2px',
                transition: idx === activeSlideIdx ? 'width 0.1s linear' : 'none',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
