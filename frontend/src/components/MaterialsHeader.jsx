import React from 'react';
import { Search, LayoutGrid, Grid3X3, Grid2X2 } from "lucide-react";

export default function MaterialsHeader({
  search,
  onSearchChange,
  gridCols,
  onGridChange,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Materiały</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredCount === totalCount
            ? `${totalCount} materiałów`
            : `${filteredCount} z ${totalCount} materiałów`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative group min-w-[300px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Szukaj materiałów..."
            className="w-full glass rounded-xl py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all border-none"
          />
        </div>

        {/* Grid toggle */}
        <div className="hidden md:flex items-center glass rounded-xl p-1 gap-1">
          <button
            onClick={() => onGridChange(2)}
            className={`p-1.5 rounded-lg transition-all ${
              gridCols === 2 ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid2X2 size={16} />
          </button>
          <button
            onClick={() => onGridChange(3)}
            className={`p-1.5 rounded-lg transition-all ${
              gridCols === 3 ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => onGridChange(4)}
            className={`p-1.5 rounded-lg transition-all ${
              gridCols === 4 ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
