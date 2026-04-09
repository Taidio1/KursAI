import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { materialsService } from '../services/materialsService';
import MaterialCard from '../components/MaterialCard';
import MaterialDetailsCard from '../components/MaterialDetailsCard';
import MaterialSidebar from '../components/MaterialSidebar';
import MaterialsHeader from '../components/MaterialsHeader';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/PageTransition';

export default function MaterialsPage() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    search: '', 
    categories: [], 
    tags: [], 
    price: 'All' 
  });
  const [gridCols, setGridCols] = useState(3);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    materialsService.getMaterials()
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setFetchError('Nie udało się załadować materiałów. Sprawdź połączenie i spróbuj ponownie.');
        setLoading(false);
      });
  }, []);

  const handleMaterialSelect = useCallback((id) => {
    setSelectedMaterialId(prev => prev === id ? null : id);
  }, []);

  const selectedMaterial = useMemo(() => {
    if (!selectedMaterialId) return null;
    return materials.find(m => m.id === selectedMaterialId);
  }, [materials, selectedMaterialId]);

  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [materials]);

  const allTags = useMemo(() => {
    const tags = new Set();
    materials.forEach(m => {
      if (m.tags) m.tags.forEach(t => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = 
        !filters.search ||
        m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase()))) ||
        (m.description && m.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCat = filters.categories.length === 0 || filters.categories.includes(m.category);
      
      const matchesTags = filters.tags.length === 0 || 
        (m.tags && filters.tags.some(t => m.tags.includes(t)));

      const materialPrice = m.price?.toLowerCase() || 'free';
      const filterPrice = filters.price.toLowerCase();
      const matchesPrice = filterPrice === 'all' || materialPrice === filterPrice;
      
      return matchesSearch && matchesCat && matchesTags && matchesPrice;
    });
  }, [materials, filters]);

  const handleTagClick = useCallback((tag) => {
    setFilters(prev => ({ 
      ...prev, 
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag] 
    }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const gridClass = useMemo(() => {
    switch (gridCols) {
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  }, [gridCols]);

  return (
    <PageTransition>
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans antialiased">
      <Navbar user={user} />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <MaterialsHeader 
            search={filters.search}
            onSearchChange={handleSearchChange}
            gridCols={gridCols}
            onGridChange={setGridCols}
            totalCount={materials.length}
            filteredCount={filteredMaterials.length}
          />

          <div className="flex flex-col md:flex-row gap-8 mt-4">
            <MaterialSidebar 
              filters={filters} 
              setFilters={setFilters} 
              categories={categories} 
              allTags={allTags}
            />
            
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className={`grid ${gridClass} gap-4`}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div key={n} className="h-48 glass rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : fetchError ? (
                <div className="glass rounded-xl p-12 text-center flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold text-red-500 mb-2">Błąd ładowania</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-xs">{fetchError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-primary/10 text-primary text-sm font-semibold rounded-xl border border-primary/20 hover:bg-primary/20 transition-all"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              ) : filteredMaterials.length > 0 ? (
                <div className={`grid ${gridClass} gap-4`}>
                  {filteredMaterials.map(m => (
                    <MaterialCard 
                      key={m.id} 
                      material={m} 
                      onTagClick={handleTagClick}
                      onSelect={() => handleMaterialSelect(m.id)}
                      isSelected={selectedMaterialId === m.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Search className="text-primary/60" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Brak wyników</h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                    Nie znaleźliśmy materiałów spełniających Twoje kryteria wyszukiwania. Spróbuj zmienić filtry.
                  </p>
                  <button 
                    onClick={() => setFilters({ search: '', categories: [], tags: [], price: 'All' })}
                    className="px-6 py-2.5 bg-primary/10 text-primary text-sm font-semibold rounded-xl border border-primary/20 hover:bg-primary/20 transition-all"
                  >
                    Wyczyść wszystkie filtry
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal - Rendered at the end of root to stay on top */}
      {selectedMaterial && (
        <MaterialDetailsCard
          material={selectedMaterial}
          onClose={() => handleMaterialSelect(null)}
          onTagClick={handleTagClick}
        />
      )}
    </div>
    </PageTransition>
  );
}
