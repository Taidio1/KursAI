import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Copy, 
  Globe, 
  Terminal, 
  Cloud, 
  Database, 
  Cpu, 
  Box, 
  Layers, 
  Code, 
  FileText 
} from 'lucide-react';

const getIcon = (category, title) => {
  const text = `${category || ''} ${title || ''}`.toLowerCase();
  const size = 24;

  if (text.includes('react') || text.includes('frontend') || text.includes('ui') || text.includes('ux')) return <Globe size={size} />;
  if (text.includes('python') || text.includes('backend') || text.includes('node') || text.includes('script')) return <Terminal size={size} />;
  if (text.includes('aws') || text.includes('cloud') || text.includes('azure') || text.includes('gcp')) return <Cloud size={size} />;
  if (text.includes('db') || text.includes('sql') || text.includes('database') || text.includes('mongo') || text.includes('supabase')) return <Database size={size} />;
  if (text.includes('ai') || text.includes('machine') || text.includes('gpt') || text.includes('llm') || text.includes('gemini')) return <Cpu size={size} />;
  if (text.includes('docker') || text.includes('container') || text.includes('kubernetes') || text.includes('k8s')) return <Box size={size} />;
  if (text.includes('arch') || text.includes('design') || text.includes('pattern')) return <Layers size={size} />;
  if (text.includes('api') || text.includes('rest') || text.includes('graphql')) return <Code size={size} />;
  return <FileText size={size} />;
};

export default function MaterialDetailsCard({ material, onClose, onTagClick }) {
  // Blokowanie scrollowania tła po otwarciu modala
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!material) return null;

  const type = material.price?.toUpperCase() || 'FREE';
  const hasImage = !!material.image_url;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(material.url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto custom-scrollbar flex justify-center items-start py-16 sm:py-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`w-full max-w-4xl glass rounded-3xl border border-primary/20 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col z-10`}>
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all z-20 border border-primary/5 hover:border-primary/20"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 md:p-8 lg:p-10">
          <div className={`flex flex-col ${hasImage ? 'lg:flex-row' : ''} gap-8 lg:gap-12`}>
            
            {/* Column: Content */}
            <div className={`flex-1 flex flex-col gap-5 ${!hasImage ? 'max-w-3xl mx-auto w-full' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    {getIcon(material.category, material.title)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight">{material.title}</h2>
                    <div className="flex items-center flex-wrap gap-2 text-sm mt-1">
                      <span className="font-medium text-foreground/70">{material.author || 'KursAI'}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30 hidden sm:block"></span>
                      <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary/80 font-medium">{material.category}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full border font-bold shrink-0 mt-2 ${
                  type === 'FREE' 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}>
                  {type}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 border-b border-primary/10 pb-1.5 w-fit">O materiale</h3>
                <p className="text-foreground/90 leading-relaxed text-base sm:text-lg font-medium">
                  {material.description || 'Brak szczegółowego opisu dla tego materiału.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {material.tags && material.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    className="px-3 py-1 rounded-xl bg-primary/5 border border-primary/10 text-[11px] font-semibold text-primary/80 hover:bg-primary/10 transition-all"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-6 border-t border-primary/10">
                <a 
                  href={material.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:translate-y-[-2px] transition-all"
                >
                  Otwórz narzędzie <ExternalLink size={18} />
                </a>
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/20 transition-all border border-primary/10"
                >
                  Kopiuj link <Copy size={18} />
                </button>
              </div>
            </div>
            
            {/* Column: Preview & Voting */}
            {hasImage && (
              <div className="lg:w-[40%] shrink-0 flex flex-col gap-6">
                <div className="aspect-video w-full rounded-2xl bg-slate-900/50 border border-primary/10 overflow-hidden relative shadow-xl">
                  <img 
                    src={material.image_url} 
                    alt={material.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Voting System UI */}
                <div className="glass rounded-2xl p-5 flex flex-col gap-4 border border-primary/10 shadow-inner">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Feedback</span>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-foreground/80">Przydatne?</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/10 group active:scale-95">
                        <ThumbsUp size={16} /> 
                        <span className="font-bold">24</span>
                      </button>
                      <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/10 group active:scale-95">
                        <ThumbsDown size={16} /> 
                        <span className="font-bold">2</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!hasImage && (
              <div className="max-w-3xl mx-auto w-full mt-2">
                <div className="glass rounded-2xl p-5 flex items-center justify-between border border-primary/10 shadow-inner">
                  <span className="text-sm font-semibold">Czy to narzędzie jest przydatne?</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all border border-emerald-500/10 group">
                      <ThumbsUp size={18} /> 
                      <span className="font-bold">24</span>
                    </button>
                    <button className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all border border-rose-500/10 group">
                      <ThumbsDown size={18} /> 
                      <span className="font-bold">2</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
