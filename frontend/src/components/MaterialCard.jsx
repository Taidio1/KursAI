import React from 'react';

export default function MaterialCard({ material, onTagClick }) {
  return (
    <div className="material-card" onClick={() => window.open(material.url, '_blank')}>
      <div className="card-header">
        <span className="material-icon">{material.icon_url || '🔗'}</span>
        {material.price && (
          <span className={`price-badge ${material.price.toLowerCase()}`}>
            {material.price}
          </span>
        )}
      </div>
      <h3>{material.title}</h3>
      <p>{material.description}</p>
      <div className="card-tags">
        {material.tags && material.tags.map(tag => (
          <span 
            key={tag} 
            className="tag-pill"
            onClick={(e) => { 
              e.stopPropagation(); 
              onTagClick(tag); 
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
