import React from 'react';
import { 
  ExternalLink, 
  FileText,
  Terminal, 
  Globe, 
  Cloud, 
  Database, 
  Cpu, 
  Box, 
  Layers, 
  Code 
} from 'lucide-react';

// Simplified Dynamic Icon mapping since we don't have the full dynamic imports setup in the current project
const getIcon = (category, title) => {
  const text = `${category || ''} ${title || ''}`.toLowerCase();
  const size = 20;

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

export default function MaterialCard({ material, onTagClick, onSelect, isSelected }) {
  const type = material.price?.toUpperCase() || 'FREE';
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(material);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group glass rounded-xl p-5 flex flex-col gap-3 card-hover cursor-pointer relative overflow-hidden transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary border-transparent' : ''
      }`}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {getIcon(material.category, material.title)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors truncate">
              {material.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{material.author || 'Agentic Hub'}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
          type === 'FREE' 
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30" 
            : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
        }`}>
          {type}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 relative z-10">
        {material.description || 'Brak opisu dla tego materiału.'}
      </p>

      <div className="flex items-center justify-between mt-auto relative z-10 pt-2">
        <div className="flex flex-wrap gap-1.5">
          {material.tags && material.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 hover:bg-primary/20 hover:text-primary transition-colors border border-primary/10"
            >
              {tag}
            </button>
          ))}
        </div>
        <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </div>
  );
}
