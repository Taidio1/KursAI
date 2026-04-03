import React, { useState, useEffect, useMemo } from 'react';
import { materialsService } from '../services/materialsService';
import MaterialCard from '../components/MaterialCard';
import MaterialSidebar from '../components/MaterialSidebar';
import Navbar from '../components/Navbar';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', categories: [], price: 'All' });
  const [gridCols, setGridCols] = useState(4); // Default to 4 as requested

  useEffect(() => {
    materialsService.getMaterials()
      .then(data => {
        setMaterials(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category));
    return Array.from(cats);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = 
        m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(filters.search.toLowerCase())));
      
      const matchesCat = filters.categories.length === 0 || filters.categories.includes(m.category);
      
      return matchesSearch && matchesCat;
    });
  }, [materials, filters]);

  const handleTagClick = (tag) => {
    setFilters(prev => ({ ...prev, search: tag }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="materials-container">
        <MaterialSidebar 
          filters={filters} 
          setFilters={setFilters} 
          categories={categories} 
        />
        
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="grid-controls">
            <span>Siatka:</span>
            {[2, 3, 4].map(num => (
              <button 
                key={num} 
                className={`grid-btn ${gridCols === num ? 'active' : ''}`}
                onClick={() => setGridCols(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div className={`materials-grid cols-${gridCols}`}>
            {loading ? (
              <div className="loading-state">Ładowanie materiałów...</div>
            ) : filteredMaterials.length > 0 ? (
              filteredMaterials.map(m => (
                <MaterialCard 
                  key={m.id} 
                  material={m} 
                  onTagClick={handleTagClick} 
                />
              ))
            ) : (
              <div className="empty-state">Nie znaleziono materiałów spełniających kryteria.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
