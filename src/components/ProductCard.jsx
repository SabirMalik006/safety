import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { isAuthenticated } from '../services/authService';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product.inStock !== false && (product.stock > 0 || product.countInStock > 0 || product.stock === undefined)) {
      addToCart(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    toggleWishlist(product);
  };

  const inStock = product.inStock !== false && (product.stock > 0 || product.countInStock > 0 || product.stock === undefined || product.countInStock === undefined);
  const productImage = product.images?.[0]?.url || product.image || '/images/placeholder.jpg';
  const discount = product.comparePrice > product.price || (product.originalPrice > product.price);

  return (
    <div className={`product-card ${viewMode}`}>
      <div className="card-image-wrap">
        <Link to={`/products/${product.slug}`}>
          <img src={productImage} alt={product.name} />
        </Link>
        {discount && (
          <span className="sale-badge">SALE</span>
        )}
        {!inStock && (
          <span className="badge-out">Out of Stock</span>
        )}
        <div className="card-actions">
          <button
            className={`action-btn ${isWishlisted(product._id) ? 'active' : ''}`}
            onClick={handleWishlistClick}
            title="Add to Wishlist"
          >
            <FiHeart />
          </button>
          <Link to={`/products/${product.slug}`} className="action-btn" title="View Product">
            <FiEye />
          </Link>
          <button 
            className="action-btn" 
            onClick={handleAddToCart} 
            title={inStock ? 'Quick Add' : 'Out of Stock'}
            disabled={!inStock}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>

      <div className="card-info">
        <div className="card-category">{product.category?.name || 'Safety Equipment'}</div>
        <h3 className="card-title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="card-price">
          <span className="current-price"><span className="currency">Rs.</span>{product.price?.toLocaleString()}</span>
          {discount && (
            <span className="old-price">
              <span className="currency">Rs.</span>
              {(product.comparePrice || product.originalPrice)?.toLocaleString()}
            </span>
          )}
        </div>

        {viewMode === 'grid' && (
          <button 
            className={`btn-add-cart-grid ${!inStock ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        )}

        {viewMode === 'list' && (
          <div className="list-description">
            <p>{product.description?.substring(0, 150)}...</p>
            <button 
              className={`btn-add-cart ${!inStock ? 'disabled' : ''}`} 
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'} <FiShoppingCart />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
