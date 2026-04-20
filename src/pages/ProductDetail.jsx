import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiStar, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="not-found container">
        <h2>Product not found</h2>
        <Link to="/collections/all-bags">Back to All Bags</Link>
      </div>
    );
  }

  const colorMap = {
    'Black': '#1a1a1a', 'Brown': '#6B4226', 'Dark Brown': '#3E2C1C',
    'Green': '#2E5E3E', 'Beige': '#C8AD8F', 'Pink': '#E8A4B0',
    'White': '#F5F5F5', 'Off-White': '#EDE8E0', 'Natural': '#D4C4A0',
    'Navy': '#1B2A4A', 'Olive': '#6B6E3E',
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    const color = selectedColor || product.colors[0];
    addToCart({ ...product, selectedColor: color, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to={`/collections/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link>
          <FiChevronRight />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container product-detail-body">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="thumbnails">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`thumb ${i === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(i)}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="main-image">
            <img src={product.images[activeImage]} alt={product.name} />
            {product.discount > 0 && (
              <span className="detail-badge">-{product.discount}% OFF</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-detail">
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-ratings">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < 4 ? 'star filled' : 'star'} />
            ))}
            <span>(128 reviews)</span>
          </div>

          <div className="detail-pricing">
            <span className="detail-price">Rs.{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="detail-original">Rs.{product.originalPrice.toLocaleString()}</span>
                <span className="detail-saving">Save Rs.{(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          <div className="detail-divider" />

          {/* Color Selection */}
          <div className="detail-section">
            <label className="detail-label">
              Color: <strong>{selectedColor || product.colors[0]}</strong>
            </label>
            <div className="detail-colors">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`color-btn ${(selectedColor || product.colors[0]) === color ? 'active' : ''}`}
                  style={{ background: colorMap[color] || '#ccc' }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="detail-section">
            <label className="detail-label">Quantity</label>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}><FiPlus /></button>
            </div>
          </div>

          {/* Buttons */}
          <div className="detail-actions">
            <button
              className={`btn-primary-full ${added ? 'added' : ''} ${!product.inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FiShoppingCart />
              {!product.inStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className={`btn-wishlist ${isWishlisted(product.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              <FiHeart />
            </button>
            <button className="btn-share">
              <FiShare2 />
            </button>
          </div>

          {/* Guarantees */}
          <div className="guarantees">
            <div className="guarantee-item">
              <FiTruck />
              <div>
                <strong>Free Delivery</strong>
                <span>On orders above Rs.3,999</span>
              </div>
            </div>
            <div className="guarantee-item">
              <FiRefreshCw />
              <div>
                <strong>Easy Returns</strong>
                <span>7-day return policy</span>
              </div>
            </div>
            <div className="guarantee-item">
              <FiShield />
              <div>
                <strong>Quality Assured</strong>
                <span>Premium materials only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container detail-tabs-section">
        <div className="tabs-nav">
          {['description', 'reviews', 'shipping'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>Product Description</h3>
              <p>
                The {product.name} is a premium quality bag crafted with attention to detail and superior materials.
                Designed for the modern Pakistani woman, it combines style with practicality for everyday use.
              </p>
              <ul>
                <li>Premium quality materials</li>
                <li>Multiple color options available</li>
                <li>Spacious main compartment</li>
                <li>Inner pockets for organization</li>
                <li>Adjustable strap (where applicable)</li>
                <li>Durable zipper closures</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <h3>Customer Reviews</h3>
              <div className="review-summary">
                <span className="big-rating">4.8</span>
                <div>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className="star filled" />)}
                  </div>
                  <span>Based on 128 reviews</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="tab-pane">
              <h3>Shipping & Returns</h3>
              <p><strong>Delivery:</strong> 2-4 business days across Pakistan</p>
              <p><strong>Free shipping:</strong> On orders above Rs.3,999</p>
              <p><strong>COD:</strong> Available nationwide</p>
              <p><strong>Returns:</strong> 7-day easy return policy if product is unused and in original packaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="container related-section">
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-subtitle">More styles from our collection.</p>
          <div className="related-grid">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
