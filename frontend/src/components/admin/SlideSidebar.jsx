import { Plus, Trash2 } from 'lucide-react'

export default function SlideSidebar({ slides, activeIndex, setActiveIndex, setSlides }) {
  const addSlide = () => {
    const newSlide = {
      content_json: [{ type: 'heading', value: 'Nowy Slajd' }],
      mode: 'technical',
      duration_seconds: 180,
    }
    setSlides([...slides, newSlide])
    setActiveIndex(slides.length)
  }

  const deleteSlide = (index, e) => {
    e.stopPropagation()
    if (!confirm('Czy na pewno chcesz usunąć ten slajd?')) return
    const newSlides = slides.filter((_, i) => i !== index)
    setSlides(newSlides)
    if (activeIndex >= newSlides.length) setActiveIndex(Math.max(0, newSlides.length - 1))
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border font-semibold text-cyan-400 uppercase tracking-wider text-sm">
        Slajdy ({slides.length})
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {slides.map((slide, index) => (
          <div 
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`group p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
              activeIndex === index 
                ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                : 'bg-secondary/50 border-border hover:border-primary/50'
            }`}
          >
            <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
            <span className="flex-1 truncate text-sm">
              {slide.content_json?.[0]?.value || 'Pusty slajd'}
            </span>
            <button 
              onClick={(e) => deleteSlide(index, e)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <button 
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Dodaj Slajd
        </button>
      </div>
    </aside>
  )
}
