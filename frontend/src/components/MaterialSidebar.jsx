import React from 'react';

export default function MaterialSidebar({ filters, setFilters, categories }) {
  const toggleCategory = (cat) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    setFilters({ ...filters, categories: newCats });
  };

  return (
    <aside className="materials-sidebar">
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Szukaj..." 
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <div className="filter-group">
        <h4>Kategorie</h4>
        {categories.map(cat => (
          <label key={cat} className="filter-label">
            <input 
              type="checkbox" 
              checked={filters.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <button 
        className="reset-button"
        onClick={() => setFilters({ search: '', categories: [], price: 'All' })}
      >
        Resetuj filtry
      </button>
    </aside>
  );
}
