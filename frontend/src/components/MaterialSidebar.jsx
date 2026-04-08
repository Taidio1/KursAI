import React from 'react';
import { X, Filter, Tag as TagIcon, Check } from 'lucide-react';

export default function MaterialSidebar({ 
  filters, 
  setFilters, 
  categories, 
  allTags 
}) {
  const hasFilters = filters.categories.length > 0 || filters.tags.length > 0;

  const toggleCategory = (cat) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters({ ...filters, categories: newCats });
  };

  const toggleTag = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    setFilters({ ...filters, tags: newTags });
  };

  const onClearFilters = () => {
    setFilters({ ...filters, categories: [], tags: [], search: '' });
  };

  return (
    <aside className="w-64 shrink-0 glass rounded-xl p-5 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Filter size={14} className="text-primary" />
          Filtry
        </h2>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Wyczyść
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          Kategorie
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <div className="w-4 h-4 border border-border rounded-md transition-all peer-checked:bg-primary peer-checked:border-primary group-hover:border-primary/50"></div>
                <Check className="absolute w-2.5 h-2.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className={`text-sm transition-colors ${
                filters.categories.includes(cat) ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <TagIcon size={12} />
          Tagi
        </h3>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-[11px] px-2.5 py-1 rounded-full transition-all border ${
                filters.tags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active filters summary */}
      {hasFilters && (
        <div className="mt-5 pt-4 border-t border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Aktywne filtry:</p>
          <div className="flex flex-wrap gap-1">
            {filters.categories.map((cat) => (
              <span
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                {cat} ×
              </span>
            ))}
            {filters.tags.map((tag) => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/20 transition-all"
              >
                {tag} ×
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
