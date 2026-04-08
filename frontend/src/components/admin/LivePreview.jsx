export default function LivePreview({ slide }) {
  return (
    <div className="w-[450px] border-l border-border bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Podgląd na żywo</div>
      
      <div className="w-[320px] h-[640px] bg-background border-[8px] border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Status Bar Mockup */}
        <div className="h-10 px-6 flex justify-between items-center text-[10px] text-muted-foreground font-medium">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
            <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {slide?.content_json?.map((block, i) => (
            <div key={i} className="mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {block.type === 'heading' && (
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">{block.value || 'Nagłówek'}</h2>
              )}
              
              {(block.type === 'text' || block.type === 'paragraph') && (
                <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                  {block.value || 'Zacznij pisać...'}
                </div>
              )}

              {block.type === 'code' && (
                <div className="mt-4 rounded-lg bg-slate-900 border border-slate-800 p-3 font-mono text-[11px]">
                  <div className="flex justify-between mb-2 border-b border-slate-800 pb-1">
                    <span className="text-blue-400">{block.language}</span>
                  </div>
                  <pre className="text-slate-400 overflow-x-auto">{block.value || '# Kod'}</pre>
                </div>
              )}

              {block.type === 'image' && (
                <div className="mt-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                  {block.url ? (
                    <img src={block.url} alt={block.alt} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Podgląd obrazu</span>
                  )}
                </div>
              )}
            </div>
          ))}
          {!slide?.content_json?.length && (
            <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
              Pusty slajd
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
