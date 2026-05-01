import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiChevronDown, FiSearch, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { getProducts, getCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CategorySidebar from '../components/CategorySidebar';
import { SkeletonGrid } from '../components/ProductSkeleton';
import toast from 'react-hot-toast';
import './Collections.css';

const Collections = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  
  // Filter States
  const initialCategory = slug && slug !== 'all-products' && slug !== 'all' ? slug : (searchParams.get('category') || 'all');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [activeColor, setActiveColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    if (slug) {
      const newCat = slug === 'all-products' || slug === 'all' ? 'all' : slug;
      setActiveCategory(newCat);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [activeCategory, sortOption, priceRange, activeColor]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters = {
        category: activeCategory !== 'all' ? activeCategory : undefined,
        sort: sortOption,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        color: activeColor || undefined,
        search: searchTerm || undefined
      };
      
      const [prodRes, catRes] = await Promise.all([
        getProducts(filters),
        getCategories()
      ]);
      
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="collections-page page-content">
      <div className="container">
        {/* Top bar */}
        <div className="collections-top">
          <div className="top-left">
            <button className="mobile-filter-btn" onClick={() => setSidebarOpen(true)}>
              <FiFilter /> Filters
            </button>
            <div className="view-toggles">
              <button 
                className={viewMode === 'grid' ? 'active' : ''} 
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''} 
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>
            <span className="results-count">
              Showing <strong>{products.length}</strong> products
            </span>
          </div>

          <div className="top-right">
            <form className="search-form" onSubmit={handleSearch}>
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="sort-wrapper">
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="collections-main">
          <CategorySidebar 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            activeColor={activeColor}
            onColorChange={setActiveColor}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className={`products-container ${viewMode}`}>
            {loading ? (
              <SkeletonGrid count={8} />
            ) : products.length === 0 ? (
              <div className="no-results">
                <img src="/images/no-results.png" alt="No results" onError={(e) => e.target.style.display='none'} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn-primary" onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, 100000]);
                  setActiveColor(null);
                  setSearchTerm('');
                }}>Clear All Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    viewMode={viewMode}
                    onAddToCart={addToCart}
                    onWishlist={toggleWishlist}
                    isWishlisted={isWishlisted(product._id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, viewMode, onAddToCart, onWishlist, isWishlisted }) => {
  return (
    <div className={`product-card ${viewMode}`}>
      <div className="card-image-wrap">
        <img src={product.images?.[0]?.url || product.image || '/images/placeholder.jpg'} alt={product.name} />
        {product.comparePrice > product.price && (
          <span className="sale-badge">Sale</span>
        )}
        <div className="card-actions">
          <button 
            className={`action-btn ${isWishlisted ? 'active' : ''}`}
            onClick={() => onWishlist(product)}
            title="Add to Wishlist"
          >
            <FiHeart />
          </button>
          <button className="action-btn" onClick={() => onAddToCart(product)} title="Quick Add">
            <FiShoppingCart />
          </button>
        </div>
      </div>
      
      <div className="card-info">
        <div className="card-category">{product.category?.name}</div>
        <h3 className="card-title">
          <a href={`/products/${product.slug}`}>{product.name}</a>
        </h3>
        <div className="card-rating">
          {[...Array(5)].map((_, i) => (
            <FiStar key={i} className={i < Math.floor(product.rating || 0) ? 'filled' : ''} />
          ))}
          <span>({product.numReviews || 0})</span>
        </div>
        <div className="card-price">
          <span className="current-price">Rs.{product.price?.toLocaleString()}</span>
          {product.comparePrice > product.price && (
            <span className="old-price">Rs.{product.comparePrice?.toLocaleString()}</span>
          )}
        </div>
        
        {viewMode === 'list' && (
          <div className="list-description">
            <p>{product.description?.substring(0, 150)}...</p>
            <button className="btn-add-cart" onClick={() => onAddToCart(product)}>
              Add to Cart <FiShoppingCart />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
