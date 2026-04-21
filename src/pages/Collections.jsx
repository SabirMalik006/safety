import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Collections.css';

const collectionMeta = {
  'all-bags': { title: 'All Bags', desc: 'Browse our complete collection of premium bags.' },
  'best-selling': { title: 'Best Sellers', desc: 'Our most-loved styles, chosen by thousands.' },
  'canvas-bags': { title: 'Canvas Bags', desc: 'Durable, stylish canvas bags for everyday use.' },
  'men-wallets': { title: 'Men Wallets', desc: 'Slim and classic wallets for the modern man.' },
  'tote-bag': { title: 'Tote Bags', desc: 'Spacious and elegant tote bags for every occasion.' },
  'shoulder-bag': { title: 'Shoulder Bags', desc: 'Versatile shoulder bags that go with everything.' },
};

const sortOptions = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Best Discount' },
];

export default function Collections() {
  const { slug } = useParams();
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('default');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const meta = collectionMeta[slug] || { title: 'Collection', desc: '' };

  const allColors = [...new Set(products.flatMap(p => p.colors))];

  let filtered = products.filter(p => {
    if (slug === 'all-bags') return p.category !== 'men-wallets';
    if (slug === 'best-selling') return p.id <= 7;
    return p.category === slug;
  });

  if (selectedColors.length > 0) {
    filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c)));
  }

  filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  if (sort === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'discount') filtered = [...filtered].sort((a, b) => b.discount - a.discount);

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const colorMap = {
    'Black': '#1a1a1a', 'Brown': '#6B4226', 'Dark Brown': '#3E2C1C',
    'Green': '#2E5E3E', 'Beige': '#C8AD8F', 'Pink': '#E8A4B0',
    'White': '#F5F5F5', 'Off-White': '#EDE8E0', 'Natural': '#D4C4A0',
    'Navy': '#1B2A4A', 'Olive': '#6B6E3E',
  };

  return (
    <div className="collections-page page-content">
      {/* Header */}
      <div className="collection-header">
        <div className="container">
          <h1>{meta.title}</h1>
          <p>{meta.desc}</p>
        </div>
      </div>

      <div className="container collections-body">
        {/* Sidebar Filter */}
        <aside className={`filter-sidebar ${filterOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="close-filter" onClick={() => setFilterOpen(false)}>
              <FiX />
            </button>
          </div>

          <div className="filter-group">
            <h4>Price Range <FiChevronDown /></h4>
            <div className="price-display">
              <span>Rs.{priceRange[0].toLocaleString()}</span>
              <span>Rs.{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0" max="10000" step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="price-slider"
            />
          </div>

          <div className="filter-group">
            <h4>Colors <FiChevronDown /></h4>
            <div className="color-filter-list">
              {allColors.map(color => (
                <label key={color} className="color-filter-item">
                  <div
                    className={`color-dot ${selectedColors.includes(color) ? 'selected' : ''}`}
                    style={{ background: colorMap[color] || '#ccc' }}
                    onClick={() => toggleColor(color)}
                  />
                  <span>{color}</span>
                </label>
              ))}
            </div>
          </div>

          {(selectedColors.length > 0) && (
            <button className="clear-filters" onClick={() => { setSelectedColors([]); setPriceRange([0, 10000]); }}>
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Main Content */}
        <div className="collections-main">
          {/* Toolbar */}
          <div className="collections-toolbar">
            <button className="filter-toggle" onClick={() => setFilterOpen(true)}>
              <FiFilter /> Filters
              {selectedColors.length > 0 && <span className="filter-count">{selectedColors.length}</span>}
            </button>

            <span className="result-count">{filtered.length} products</span>

            <div className="toolbar-right">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <div className="view-toggle">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                  <FiGrid />
                </button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                  <FiList />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your filters.</p>
              <button onClick={() => { setSelectedColors([]); setPriceRange([0, 10000]); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`collection-grid ${view === 'list' ? 'list-view' : ''}`}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {filterOpen && <div className="filter-overlay" onClick={() => setFilterOpen(false)} />}
    </div>
  );
}
