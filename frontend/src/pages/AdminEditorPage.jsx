import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchLessonData, saveLessonData } from '../services/adminService'
import SlideSidebar from '../components/admin/SlideSidebar'
import ContentEditor from '../components/admin/ContentEditor'
import LivePreview from '../components/admin/LivePreview'

import { ArrowLeft } from 'lucide-react'

export default function AdminEditorPage() {
  const { user } = useAuth()
  const { lessonId } = useParams()
  const navigate = useNavigate()
  
  const [lesson, setLesson] = useState(null)
  const [slides, setSlides] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (lessonId) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [lessonId])

  async function loadData() {
    try {
      const data = await fetchLessonData(lessonId)
      setLesson(data.lesson)
      setSlides(data.slides)
    } catch (err) {
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveLessonData(lessonId, { title: lesson.title }, slides)
      alert('Zapisano pomyślnie!')
    } catch (err) {
      alert('Błąd zapisu: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-primary">Ładowanie...</div>

  return (
    <div className="h-screen flex bg-background overflow-hidden text-foreground">
      <SlideSidebar 
        slides={slides} 
        activeIndex={activeIndex} 
        setActiveIndex={setActiveIndex}
        setSlides={setSlides}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-[1px] bg-border"></div>
             <input 
               className="bg-transparent text-xl font-bold text-cyan-400 border-none focus:ring-0 w-96"
               value={lesson?.title || ''}
               onChange={(e) => setLesson({...lesson, title: e.target.value})}
               placeholder="Tytuł lekcji..."
             />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-semibold transition-all disabled:opacity-50"
            >
              {saving ? 'Zapisywanie...' : 'Zapisz w Supabase'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <ContentEditor 
            slide={slides[activeIndex]} 
            updateSlide={(updated) => {
              const newSlides = [...slides]
              newSlides[activeIndex] = updated
              setSlides(newSlides)
            }}
          />
          <LivePreview slide={slides[activeIndex]} />
        </div>
      </main>
    </div>
  )
}
