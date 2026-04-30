import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiStar, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductBySlug, getProducts } from '../services/productService';
import { getProductReviews, createReview } from '../services/reviewService';
import { isAuthenticated } from '../services/authService';
import './ProductDetail.css';

const colorMap = {
  'Black': '#1a1a1a', 'Brown': '#6B4226', 'Dark Brown': '#3E2C1C',
  'Green': '#2E5E3E', 'Beige': '#C8AD8F', 'Pink': '#E8A4B0',
  'White': '#F5F5F5', 'Off-White': '#EDE8E0', 'Natural': '#D4C4A0',
  'Navy': '#1B2A4A', 'Olive': '#6B6E3E', 'Red': '#C41E3A',
  'Blue': '#1E3A8A', 'Yellow': '#EAB308', 'Gray': '#6B7280'
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Fetch product by slug
        const productRes = await getProductBySlug(slug);
        if (productRes.success && productRes.data) {
          const fetchedProduct = productRes.data;
          setProduct(fetchedProduct);
          
          // Set default selected color
          if (fetchedProduct.colors && fetchedProduct.colors.length > 0) {
            setSelectedColor(fetchedProduct.colors[0].name);
          }
          
          // Fetch reviews
          const reviewsRes = await getProductReviews(fetchedProduct._id);
          if (reviewsRes.success) {
            setReviews(reviewsRes.data || []);
          }
          
          // Fetch related products (same category)
          if (fetchedProduct.category?._id) {
            const relatedRes = await getProducts({ category: fetchedProduct.category._id });
            if (relatedRes.success) {
              const filtered = (relatedRes.data || []).filter(p => p._id !== fetchedProduct._id).slice(0, 4);
              setRelated(filtered);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProductData();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const color = selectedColor || product.colors?.[0]?.name || '';
    addToCart(product, quantity, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert('Please login to submit a review');
      return;
    }
    setReviewSubmitting(true);
    try {
      await createReview({
        product: product._id,
        ...reviewForm
      });
      alert('Review submitted! Awaiting approval.');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      // Refresh reviews
      const reviewsRes = await getProductReviews(product._id);
      if (reviewsRes.success) {
        setReviews(reviewsRes.data || []);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Helper functions
  const getProductImage = (img) => {
    if (typeof img === 'string') return img;
    return img?.url || '/images/placeholder.jpg';
  };

  const getProductImages = () => {
    if (!product) return [];
    if (product.images?.length) {
      return product.images.map(img => getProductImage(img));
    }
    return ['/images/placeholder.jpg'];
  };

  const getProductColors = () => {
    return product?.colors?.map(c => c.name) || [];
  };

  const inStock = product?.stock > 0;
  const discount = product?.comparePrice && product.comparePrice > product.price 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="product-detail-page page-content">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found container page-content">
        <h2>Product not found</h2>
        <Link to="/collections/all-products">Back to All Equipment</Link>
      </div>
    );
  }

  const productImages = getProductImages();
  const productColors = getProductColors();

  // Format related products for ProductCard
  const formattedRelated = related.map(p => ({
    ...p,
    id: p._id,
    image: p.images?.[0]?.url || '/images/placeholder.jpg',
    originalPrice: p.comparePrice,
    discount: p.comparePrice && p.comparePrice > p.price 
      ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) 
      : 0
  }));

  return (
    <div className="product-detail-page page-content">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to={`/collections/${product.category?.slug || 'all-products'}`}>
            {product.category?.name || 'Collection'}
          </Link>
          <FiChevronRight />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container product-detail-body">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="thumbnails">
            {productImages.map((img, i) => (
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
            <img src={productImages[activeImage]} alt={product.name} />
            {discount > 0 && (
              <span className="detail-badge">-{discount}% OFF</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-detail">
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-ratings">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.floor(product.rating || 0) ? 'star filled' : 'star'} />
            ))}
            <span>({product.numReviews || 0} reviews)</span>
          </div>

          <div className="detail-pricing">
            <span className="detail-price">Rs.{product.price.toLocaleString()}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="detail-original">Rs.{product.comparePrice.toLocaleString()}</span>
                <span className="detail-saving">Save Rs.{(product.comparePrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          <div className="detail-divider" />

          {/* Color Selection */}
          {productColors.length > 0 && (
            <div className="detail-section">
              <label className="detail-label">
                Color: <strong>{selectedColor}</strong>
              </label>
              <div className="detail-colors">
                {productColors.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    style={{ background: colorMap[color] || '#ccc' }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="detail-section">
            <label className="detail-label">Quantity</label>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FiMinus /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><FiPlus /></button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="stock-status" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            {inStock ? (
              <span style={{ color: '#2E5E3E' }}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span style={{ color: '#C41E3A' }}>✗ Out of Stock</span>
            )}
          </div>

          {/* Buttons */}
          <div className="detail-actions">
            <button
              className={`btn-primary-full ${added ? 'added' : ''} ${!inStock ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              <FiShoppingCart />
              {!inStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className={`btn-wishlist ${isWishlisted(product._id) ? 'active' : ''}`}
              onClick={() => toggleWishlist({ ...product, id: product._id })}
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
                <strong>Fast Logistics</strong>
                <span>On orders above Rs.10,000</span>
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
              <p>{product.description || `The ${product.name} is a professional-grade solution crafted for durability and performance in demanding environments. Built to international safety standards, it ensures maximum protection and efficiency for your workplace.`}</p>
              <ul>
                <li>Certified safety standards (CE/ANSI)</li>
                <li>Durable, industrial-grade construction</li>
                <li>Ergonomic design for comfortable usage</li>
                <li>High-performance specifications</li>
                <li>Standard warranty included</li>
                <li>Tested for extreme conditions</li>
              </ul>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3>Customer Reviews</h3>
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Write a Review
                </button>
              </div>
              
              <div className="review-summary">
                <span className="big-rating">{product.rating || 0}</span>
                <div>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < Math.floor(product.rating || 0) ? 'star filled' : 'star'} />
                    ))}
                  </div>
                  <span>Based on {product.numReviews || 0} reviews</span>
                </div>
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
                  <h4>Write Your Review</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Rating: </label>
                    <select 
                      value={reviewForm.rating} 
                      onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                      style={{ marginLeft: '1rem', padding: '5px' }}
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Review Title" 
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    required
                  />
                  <textarea 
                    placeholder="Your Review" 
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    required
                  />
                  <button type="submit" disabled={reviewSubmitting} style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div style={{ marginTop: '2rem' }}>
                {reviews.filter(r => r.isApproved).length === 0 && <p>No reviews yet. Be the first to review!</p>}
                {reviews.filter(r => r.isApproved).map(review => (
                  <div key={review._id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < review.rating ? 'star filled' : 'star'} style={{ fontSize: '12px' }} />
                        ))}
                      </div>
                    </div>
                    <h5 style={{ margin: '0.5rem 0' }}>{review.title}</h5>
                    <p>{review.comment}</p>
                    <small style={{ color: '#888' }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="tab-pane">
              <h3>Shipping & Returns</h3>
              <p><strong>Delivery:</strong> 2-4 business days across Pakistan</p>
              <p><strong>Free shipping:</strong> On orders above Rs.10,000</p>
              <p><strong>COD:</strong> Available nationwide</p>
              <p><strong>Returns:</strong> 7-day easy return policy if product is unused and in original packaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {formattedRelated.length > 0 && (
        <div className="container related-section">
          <h2 className="section-title">You May Also Like</h2>
          <p className="section-subtitle">More styles from our collection.</p>
          <div className="related-grid">
            {formattedRelated.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}