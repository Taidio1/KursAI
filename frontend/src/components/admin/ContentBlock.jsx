import { Trash2 } from 'lucide-react'

export default function ContentBlock({ block, onUpdate, onRemove }) {
  return (
    <div className="group relative bg-card/80 backdrop-blur-sm border border-border p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">{block.kind}</span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {block.kind === 'markdown' && (
        <textarea
          className="w-full bg-secondary/50 border border-border rounded-md p-3 min-h-[150px] focus:ring-1 focus:ring-primary outline-none text-sm"
          value={block.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Wpisz treść (Markdown)..."
        />
      )}

      {block.kind === 'code' && (
        <div className="space-y-3">
          <input
            className="w-full bg-secondary/50 border border-border rounded-md p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            value={block.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Etykieta (opcjonalna)..."
          />
          <select
            className="bg-secondary/50 border border-border rounded-md p-1 text-xs outline-none"
            value={block.language || 'python'}
            onChange={(e) => onUpdate({ language: e.target.value })}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="bash">Bash</option>
            <option value="markdown">Markdown</option>
            <option value="prompt">Prompt</option>
          </select>
          <textarea
            className="w-full bg-slate-950 border border-border rounded-md p-3 min-h-[150px] font-mono text-xs focus:ring-1 focus:ring-primary outline-none text-blue-300"
            value={block.code || ''}
            onChange={(e) => onUpdate({ code: e.target.value })}
            placeholder="Wpisz kod..."
          />
        </div>
      )}

      {block.kind === 'table' && (
        <div className="space-y-3">
          <input
            className="w-full bg-secondary/50 border border-border rounded-md p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
            value={(block.headers || []).join(', ')}
            onChange={(e) => onUpdate({ headers: e.target.value.split(',').map(h => h.trim()) })}
            placeholder="Nagłówki oddzielone przecinkami, np. Kol1, Kol2"
          />
          <textarea
            className="w-full bg-secondary/50 border border-border rounded-md p-3 min-h-[100px] font-mono text-xs focus:ring-1 focus:ring-primary outline-none"
            value={(block.rows || []).map(row => row.join(' | ')).join('\n')}
            onChange={(e) => {
              const rows = e.target.value
                .split('\n')
                .map(line => line.split('|').map(cell => cell.trim()))
              onUpdate({ rows })
            }}
            placeholder={"Wiersze, każdy w osobnej linii, np:\nOpis | 0.5\nInny | 1.0"}
          />
        </div>
      )}

      {block.kind === 'hero' && (
        <textarea
          className="w-full bg-secondary/50 border border-border rounded-md p-3 min-h-[100px] focus:ring-1 focus:ring-primary outline-none text-sm"
          value={block.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          placeholder="Tekst hero (cel lekcji)..."
        />
      )}

      {block.kind === 'tip' && (
        <div className="space-y-3">
          <input
            className="w-full bg-secondary/50 border border-border rounded-md p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
            value={block.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Tytuł, np. 💡 Rada"
          />
          <textarea
            className="w-full bg-secondary/50 border border-border rounded-md p-3 min-h-[100px] focus:ring-1 focus:ring-primary outline-none text-sm"
            value={block.desc || ''}
            onChange={(e) => onUpdate({ desc: e.target.value })}
            placeholder="Treść porady..."
          />
        </div>
      )}
    </div>
  )
}
