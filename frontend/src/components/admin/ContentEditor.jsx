import { useState, useEffect } from 'react'
import ContentBlock from './ContentBlock'
import { FileText, Code, Table, Lightbulb, Star } from 'lucide-react'

export default function ContentEditor({ slide, updateSlide }) {
  const [duration, setDuration] = useState(slide?.duration_seconds || 180)

  useEffect(() => {
    setDuration(slide?.duration_seconds || 180)
  }, [slide?.id])

  if (!slide) return <div className="flex-1 flex items-center justify-center text-muted-foreground">Wybierz slajd, aby edytować</div>

  const addBlock = (kind) => {
    const defaults = {
      markdown: { kind: 'markdown', content: '' },
      code:     { kind: 'code', language: 'python', label: '', code: '' },
      table:    { kind: 'table', headers: ['Kolumna 1', 'Kolumna 2'], rows: [['', '']] },
      tip:      { kind: 'tip', title: '💡', desc: '' },
      hero:     { kind: 'hero', text: '' },
    }
    updateSlide({
      ...slide,
      content_json: [...(slide.content_json || []), defaults[kind]]
    })
  }

  const updateBlock = (index, updates) => {
    const newBlocks = [...slide.content_json]
    newBlocks[index] = { ...newBlocks[index], ...updates }
    updateSlide({ ...slide, content_json: newBlocks })
  }

  const removeBlock = (index) => {
    const newBlocks = slide.content_json.filter((_, i) => i !== index)
    updateSlide({ ...slide, content_json: newBlocks })
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background/50 custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Metadata sceny */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <label className="text-sm text-muted-foreground whitespace-nowrap">Czas sceny (sekundy):</label>
          <input
            type="number"
            min="30"
            max="3600"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onBlur={(e) => {
              const val = parseInt(e.target.value, 10)
              const safe = isNaN(val) || val < 1 ? 180 : val
              setDuration(safe)
              updateSlide({ ...slide, duration_seconds: safe })
            }}
            className="w-24 px-3 py-1.5 rounded-md border border-border bg-background text-sm text-foreground"
          />
          <span className="text-xs text-muted-foreground">
            ({Math.round((parseInt(duration, 10) || 180) / 60)} min)
          </span>
        </div>
        {slide.content_json?.map((block, index) => (
          <ContentBlock
            key={index}
            block={block}
            onUpdate={(updates) => updateBlock(index, updates)}
            onRemove={() => removeBlock(index)}
          />
        ))}

        <div className="flex gap-4 pt-8 border-t border-border">
          <button onClick={() => addBlock('markdown')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
            <FileText size={20} /> <span className="text-xs">Markdown</span>
          </button>
          <button onClick={() => addBlock('code')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
            <Code size={20} /> <span className="text-xs">Kod</span>
          </button>
          <button onClick={() => addBlock('table')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
            <Table size={20} /> <span className="text-xs">Tabela</span>
          </button>
          <button onClick={() => addBlock('tip')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
            <Lightbulb size={20} /> <span className="text-xs">Tip</span>
          </button>
          <button onClick={() => addBlock('hero')} className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
            <Star size={20} /> <span className="text-xs">Hero</span>
          </button>
        </div>
      </div>
    </div>
  )
}
