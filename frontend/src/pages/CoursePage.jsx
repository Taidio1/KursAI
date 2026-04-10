import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { courseService } from '../services/courseService'
import { pathCache } from '../services/pathCache'
import SceneProgressBar from '../components/SceneProgressBar'
import SceneViewer from '../components/SceneViewer'
import SceneControls from '../components/SceneControls'
import { useSceneTimer } from '../hooks/useSceneTimer'
import PageTransition from '../components/PageTransition'
import { useIsMobile } from '../hooks/useIsMobile'
import BottomSheet from '../components/BottomSheet'

export default function CoursePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathSlug } = useParams() // Expecting /kurs/:pathSlug
  
  const [path, setPath] = useState(null)
  const [lessons, setLessons] = useState([])
  const [activeLessonIdx, setActiveLessonIdx] = useState(0)
  const [slides, setSlides] = useState([])
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [slidesLoading, setSlidesLoading] = useState(false)
  
  const [error, setError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarPinned, setSidebarPinned] = useState(false)
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const isMobile = useIsMobile()
  const [lessonSheetOpen, setLessonSheetOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) setLessonSheetOpen(false)
  }, [isMobile])

  const currentSlug = pathSlug || 'wspolna'

  // 1. Fetch path and lessons list (parallel: path details + user progress)
  useEffect(() => {
    async function loadPathData() {
      if (!user?.id) return;

      try {
        const cached = pathCache.get(currentSlug)

        if (cached) {
          // Instant render from prefetch cache – no loading spinner
          const allLessons = cached.courses.flatMap(c => c.lessons)
          setPath(cached)
          setLessons(allLessons)
          setLoading(false)

          // Fetch progress in background
          const { data: progress, error: progressErr } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .not('completed_at', 'is', null)

          if (!progressErr && progress) {
            const completedSet = new Set(progress.map(p => p.lesson_id))
            setCompletedLessons(completedSet)
            const firstIncompleteIdx = allLessons.findIndex(l => !completedSet.has(l.id))
            if (firstIncompleteIdx > 0) setActiveLessonIdx(firstIncompleteIdx)
          }
          return
        }

        // No cache: fetch path details and user progress in parallel
        setLoading(true)
        const [data, { data: progress, error: progressErr }] = await Promise.all([
          courseService.getPathDetails(currentSlug),
          supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .not('completed_at', 'is', null)
        ])

        pathCache.set(currentSlug, data)
        const allLessons = data.courses.flatMap(c => c.lessons)
        setPath(data)
        setLessons(allLessons)
        setLoading(false)

        if (!progressErr && progress) {
          const completedSet = new Set(progress.map(p => p.lesson_id))
          setCompletedLessons(completedSet)
          const firstIncompleteIdx = allLessons.findIndex(l => !completedSet.has(l.id))
          if (firstIncompleteIdx > 0) setActiveLessonIdx(firstIncompleteIdx)
        }
      } catch (err) {
        console.error('Error loading path:', err)
        setError(err.message || 'Nie udało się załadować ścieżki')
        setLoading(false)
      }
    }

    loadPathData()
  }, [currentSlug, user?.id])

  // 2. Fetch slides when active lesson changes
  useEffect(() => {
    async function loadSlides() {
      if (!lessons[activeLessonIdx]) return
      
      try {
        setSlidesLoading(true)
        setIsPaused(true)
        const data = await courseService.getLessonSlides(lessons[activeLessonIdx].id)
        setSlides(data.slides || [])
      } catch (err) {
        console.error('Error loading slides:', err)
      } finally {
        setSlidesLoading(false)
        setIsPaused(false)
      }
    }
    
    loadSlides()
  }, [activeLessonIdx, lessons])

  // Reset sceny przy zmianie lekcji
  useEffect(() => {
    setActiveSlideIdx(0)
    setIsPaused(false)
  }, [activeLessonIdx])

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        setIsPaused(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const completedInPath = lessons.filter(l => completedLessons.has(l.id)).length
  const progress = lessons.length > 0
    ? Math.round((completedInPath / lessons.length) * 100)
    : 0

  const lesson = lessons[activeLessonIdx]

  const currentSlide = slides[activeSlideIdx] || null

  function handleAdvance() {
    if (activeSlideIdx < slides.length - 1) {
      setActiveSlideIdx(prev => prev + 1)
    } else {
      markComplete()
    }
  }

  const { elapsedMs } = useSceneTimer({
    slideKey: activeSlideIdx,
    durationSeconds: currentSlide?.duration_seconds || 180,
    isPaused,
    onAdvance: handleAdvance,
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  async function markComplete() {
    if (!lesson) return

    const alreadyDone = completedLessons.has(lesson.id)

    if (!alreadyDone) {
      try {
        const { error } = await supabase.from('user_progress').upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          mode: 'technical',
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id,lesson_id,mode' })

        if (error) throw error
        setCompletedLessons(prev => new Set([...prev, lesson.id]))
      } catch (err) {
        console.error('Error marking complete:', err)
        return
      }
    }

    if (activeLessonIdx < lessons.length - 1) {
      setActiveLessonIdx(activeLessonIdx + 1)
    } else {
      setCourseCompleted(true)
    }
  }

  function goToScene(idx) {
    setActiveSlideIdx(idx)
    setIsPaused(false)
  }

  function prevScene() {
    if (activeSlideIdx > 0) goToScene(activeSlideIdx - 1)
  }

  function nextScene() {
    if (activeSlideIdx < slides.length - 1) {
      goToScene(activeSlideIdx + 1)
    } else {
      markComplete()
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="font-bold tracking-widest text-xs uppercase opacity-50">Ładowanie ścieżki...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-5 bg-background text-foreground">
        <div className="text-xl font-extrabold text-red-500">Nie udało się załadować ścieżki</div>
        <div className="text-sm opacity-80">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl border border-border bg-secondary px-6 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  if (courseCompleted) {
    return (
      <div style={{
        height: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}>
        <div style={{ fontSize: '48px' }}>🎉</div>
        <h1 style={{ color: 'var(--cyan-light)', fontSize: '28px', fontWeight: '800', textAlign: 'center' }}>
          Ścieżka ukończona!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', textAlign: 'center', maxWidth: '400px' }}>
          Ukończyłeś wszystkie lekcje w ścieżce <strong>{path?.title}</strong>. Świetna robota!
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'var(--cyan)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 28px',
              color: 'white',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Wróć do Dashboard
          </button>
          <button
            onClick={() => { setCourseCompleted(false); setActiveLessonIdx(0) }}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '12px 28px',
              color: 'var(--text-muted)',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Powtórz ścieżkę
          </button>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
    <div style={{ height: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <header style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Dashboard
          </button>
          {!isMobile && (
            <>
              <span style={{ color: 'var(--border-subtle)' }}>/</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {path?.title || 'Ścieżka'}
              </span>
            </>
          )}
          {lesson && (
            <>
              <span style={{ color: 'var(--border-subtle)', flexShrink: 0 }}>/</span>
              <span style={{
                color: 'var(--cyan-light)',
                fontWeight: '700',
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}>
                {lesson.title}
              </span>
              <span style={{
                background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan-border)',
                borderRadius: '999px',
                padding: '2px 10px',
                color: 'var(--cyan-light)',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                flexShrink: 0,
              }}>
                {activeLessonIdx + 1} / {lessons.length}
              </span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '100px', height: '4px', background: 'var(--bg-surface-hover)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--cyan-gradient)',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>{progress}% ukończono</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Wyloguj
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Sidebar */}
        {!isMobile && (
        <aside
          onMouseEnter={() => { if (!sidebarPinned) setSidebarOpen(true) }}
          onMouseLeave={() => { if (!sidebarPinned) setSidebarOpen(false) }}
          style={{
            width: sidebarPinned || sidebarOpen ? '280px' : '56px',
            flexShrink: 0,
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.22s ease',
          }}
        >
          <div style={{
            padding: (sidebarPinned || sidebarOpen) ? '20px 16px 12px' : '20px 0 12px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
            display: 'flex',
            justifyContent: (sidebarPinned || sidebarOpen) ? 'flex-start' : 'center',
            overflow: 'hidden',
            transition: 'padding 0.22s ease',
          }}>
            {(sidebarPinned || sidebarOpen) ? (
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px', whiteSpace: 'nowrap' }}>
                  Lekcje
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {completedInPath} / {lessons.length} ukończone
                </div>
              </div>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px' }}>
            {lessons.map((l, idx) => {
              const isActive = idx === activeLessonIdx
              const isDone = completedLessons.has(l.id)
              const expanded = sidebarPinned || sidebarOpen
              return (
                <button
                  key={l.id}
                  onClick={() => setActiveLessonIdx(idx)}
                  title={!expanded ? l.title : undefined}
                  style={{
                    width: '100%',
                    background: isActive ? 'var(--cyan-dim)' : 'transparent',
                    border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                    borderRadius: '10px',
                    padding: expanded ? '12px 14px' : '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    gap: expanded ? '12px' : '0',
                    alignItems: 'center',
                    justifyContent: expanded ? 'flex-start' : 'center',
                    marginBottom: '4px',
                    transition: 'background 0.15s, border-color 0.15s, padding 0.22s ease',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDone
                      ? 'var(--cyan)'
                      : isActive
                        ? 'var(--cyan-dim)'
                        : 'var(--bg-surface)',
                    border: `1.5px solid ${isDone ? 'var(--cyan)' : isActive ? 'var(--cyan-border)' : 'var(--border-subtle)'}`,
                  }}>
                    {isDone ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <span style={{ color: isActive ? 'var(--cyan-light)' : 'var(--text-muted)', fontSize: '10px', fontWeight: '700' }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    opacity: expanded ? 1 : 0,
                    transition: 'opacity 0.15s ease',
                    pointerEvents: expanded ? 'auto' : 'none',
                  }}>
                    <div style={{
                      color: isActive ? 'var(--cyan-light)' : isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '400',
                      lineHeight: '1.4',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {l.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}>{l.duration}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
        )}

        {/* Pin button */}
        {!isMobile && (
        <button
          onClick={() => {
            setSidebarPinned(p => !p)
            setSidebarOpen(false)
          }}
          title={sidebarPinned ? 'Zwiń sidebar' : 'Przypnij sidebar'}
          style={{
            position: 'absolute',
            left: (sidebarPinned || sidebarOpen) ? '268px' : '44px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: sidebarPinned ? 'var(--cyan)' : 'var(--bg-secondary)',
            border: `1px solid ${sidebarPinned ? 'var(--cyan)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'left 0.22s ease, background 0.15s, border-color 0.15s',
            padding: 0,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={sidebarPinned ? 'white' : 'var(--text-muted)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: sidebarPinned ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        )}

        {/* Main Content */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Scene Progress Bar */}
          {slides.length > 0 && !slidesLoading && (
            <SceneProgressBar
              slides={slides}
              activeSlideIdx={activeSlideIdx}
              elapsedMs={elapsedMs}
              onSceneSelect={goToScene}
            />
          )}

          {/* Scene Viewer (scrollable) */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
            {slidesLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Ładowanie treści...</span>
              </div>
            ) : slides.length > 0 ? (
              <SceneViewer slide={currentSlide} slideKey={activeSlideIdx} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground italic">
                Brak treści dla tej lekcji.
              </div>
            )}
          </div>

          {/* Scene Controls */}
          {isMobile && (
            <button
              onClick={() => setLessonSheetOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 16px',
                background: 'var(--bg-surface)',
                border: 'none',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Lekcje ({activeLessonIdx + 1}/{lessons.length})
            </button>
          )}
          {slides.length > 0 && !slidesLoading && (
            <SceneControls
              isPaused={isPaused}
              onPause={() => setIsPaused(true)}
              onPlay={() => setIsPaused(false)}
              onPrev={prevScene}
              onNext={nextScene}
              hasPrev={activeSlideIdx > 0}
              hasNext={activeSlideIdx < slides.length - 1}
              currentIdx={activeSlideIdx}
              totalSlides={slides.length}
            />
          )}
        </main>
      </div>
    </div>
    {isMobile && (
      <BottomSheet
        isOpen={lessonSheetOpen}
        onClose={() => setLessonSheetOpen(false)}
        title={`Lekcje – ${path?.title || 'Ścieżka'}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {lessons.map((l, idx) => {
            const isActive = idx === activeLessonIdx
            const isDone = completedLessons.has(l.id)
            return (
              <button
                key={l.id}
                onClick={() => {
                  setActiveLessonIdx(idx)
                  setLessonSheetOpen(false)
                }}
                style={{
                  width: '100%',
                  background: isActive ? 'var(--cyan-dim)' : 'transparent',
                  border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone ? 'var(--cyan)' : isActive ? 'var(--cyan-dim)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isDone ? 'var(--cyan)' : isActive ? 'var(--cyan-border)' : 'var(--border-subtle)'}`,
                }}>
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{ color: isActive ? 'var(--cyan-light)' : 'var(--text-muted)', fontSize: '10px', fontWeight: '700' }}>
                      {idx + 1}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: isActive ? 'var(--cyan-light)' : isDone ? 'var(--text-secondary)' : 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '400',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {l.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{l.duration}</div>
                </div>
              </button>
            )
          })}
        </div>
      </BottomSheet>
    )}
    </PageTransition>
  )
}
