import { useState, useEffect } from 'react'
import RenderBlocks from './RenderBlocks'

/**
 * Wyświetla treść pojedynczej sceny z efektem fade-in przy zmianie.
 * slideKey zmienia się przy każdej nowej scenie – triggeruje animację.
 */
export default function SceneViewer({ slide, slideKey }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [slideKey])

  if (!slide) return null

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        padding: '28px 32px 40px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <RenderBlocks blocks={slide.content_json} />
    </div>
  )
}
