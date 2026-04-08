import { useEffect, useRef, useState } from 'react'

/**
 * Timer per scena. Odlicza elapsedMs do durationSeconds * 1000,
 * potem wywołuje onAdvance i resetuje się.
 * Reset następuje też przy zmianie slideKey (zmiana sceny).
 */
export function useSceneTimer({ slideKey, durationSeconds, isPaused, onAdvance }) {
  const [elapsedMs, setElapsedMs] = useState(0)
  const intervalRef = useRef(null)
  const onAdvanceRef = useRef(onAdvance)

  // Zawsze aktualny onAdvance bez restartowania timera
  useEffect(() => {
    onAdvanceRef.current = onAdvance
  }, [onAdvance])

  // Reset przy zmianie sceny
  useEffect(() => {
    setElapsedMs(0)
  }, [slideKey])

  // Start/stop interwału
  useEffect(() => {
    clearInterval(intervalRef.current)

    if (isPaused || durationSeconds <= 0) return

    intervalRef.current = setInterval(() => {
      setElapsedMs(prev => {
        const next = prev + 100
        if (next >= durationSeconds * 1000) {
          clearInterval(intervalRef.current)
          setTimeout(() => onAdvanceRef.current(), 0)
          return 0
        }
        return next
      })
    }, 100)

    return () => clearInterval(intervalRef.current)
  }, [isPaused, durationSeconds, slideKey])

  return { elapsedMs }
}
