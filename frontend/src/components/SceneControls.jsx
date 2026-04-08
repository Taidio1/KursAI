import { Play, Pause, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'

/**
 * Pasek kontrolny: Pause/Play, Prev/Next, licznik scen.
 * Umieszczony na dole obszaru treści lekcji.
 */
export default function SceneControls({
  isPaused,
  onPause,
  onPlay,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIdx,
  totalSlides,
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '12px 24px',
      borderTop: '1px solid var(--border-subtle)',
      flexShrink: 0,
    }}>
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        style={{
          background: 'none',
          border: 'none',
          color: hasPrev ? 'var(--text-secondary)' : 'var(--text-disabled)',
          cursor: hasPrev ? 'pointer' : 'default',
          opacity: hasPrev ? 1 : 0.3,
          display: 'flex',
          alignItems: 'center',
          padding: '6px',
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={isPaused ? onPlay : onPause}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          flexShrink: 0,
        }}
      >
        {isPaused ? <Play size={18} /> : <Pause size={18} />}
      </button>

      {hasNext ? (
        <button
          onClick={onNext}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
          }}
        >
          <ChevronRight size={22} />
        </button>
      ) : (
        <button
          onClick={onNext}
          style={{
            background: 'var(--cyan-dim)',
            border: '1px solid var(--cyan-border)',
            borderRadius: '8px',
            color: 'var(--cyan-light)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: '600',
          }}
        >
          <CheckCircle size={16} />
          Zakończ
        </button>
      )}

      <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px' }}>
        {currentIdx + 1} / {totalSlides}
      </span>
    </div>
  )
}
