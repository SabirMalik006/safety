import { useState } from 'react';
import { FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import './CategorySidebar.css';

const CategorySidebar = ({ categories, activeCategory, onCategoryChange, priceRange, onPriceChange, activeColor, onColorChange, isOpen, onClose }) => {
  const colors = ['Black', 'White', 'Yellow', 'Red', 'Blue', 'Orange', 'Green', 'Grey'];

  return (
    <aside className={`category-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3><FiFilter /> Filters</h3>
        <button className="close-sidebar" onClick={onClose}><FiX /></button>
      </div>

      <div className="filter-section">
        <h4>Categories</h4>
        <ul className="category-list">
          <li 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => { onCategoryChange('all'); onClose(); }}
          >
            All Products
          </li>
          {categories.map(cat => (
            <li 
              key={cat._id} 
              className={activeCategory === cat._id ? 'active' : ''}
              onClick={() => { onCategoryChange(cat._id); onClose(); }}
            >
              {cat.name}
              <span className="cat-count">{cat.productCount || 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-slider">
          <input 
            type="range" 
            min="0" 
            max="100000" 
            step="1000"
            value={priceRange[1]} 
            onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
          />
          <div className="price-labels">
            <span>Rs.0</span>
            <span>Rs.{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Color Filter</h4>
        <div className="color-grid">
          {colors.map(color => (
            <button 
              key={color} 
              className={`color-btn ${activeColor === color ? 'active' : ''}`}
              onClick={() => onColorChange(color === activeColor ? null : color)}
              title={color}
            >
              <span className={`color-swatch ${color.toLowerCase()}`}></span>
              <span className="color-name">{color}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="clear-filters" onClick={() => {
        onCategoryChange('all');
        onPriceChange([0, 100000]);
        onColorChange(null);
      }}>
        Clear All Filters
      </button>
    </aside>
  );
};

export default CategorySidebar;
