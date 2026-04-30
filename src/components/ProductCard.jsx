import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const [hovering, setHovering] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const colorMap = {
    'Black': '#1a1a1a',
    'Brown': '#6B4226',
    'Dark Brown': '#3E2C1C',
    'Green': '#2E5E3E',
    'Beige': '#C8AD8F',
    'Pink': '#E8A4B0',
    'White': '#F5F5F5',
    'Off-White': '#EDE8E0',
    'Natural': '#D4C4A0',
    'Navy': '#1B2A4A',
    'Olive': '#6B6E3E',
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart({ ...product, selectedColor });
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/products/${product.slug}`;
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        <img
          src={hovering && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="product-img"
        />

        {product.discount > 0 && (
          <span className="badge-discount">-{product.discount}%</span>
        )}
        {!product.inStock && (
          <span className="badge-out">Out of Stock</span>
        )}

        <div className={`product-actions ${hovering ? 'visible' : ''}`}>
          <button
            className={`action-btn wishlist-btn ${isWishlisted(product.id) ? 'active' : ''}`}
            onClick={handleWishlistClick}
            title="Add to Wishlist"
          >
            <FiHeart />
          </button>
          <button
            className="action-btn cart-btn"
            onClick={handleAddToCart}
            title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
            disabled={!product.inStock}
          >
            <FiShoppingCart />
          </button>
          <button
            className="action-btn view-btn"
            onClick={handleViewClick}
            title="Quick View"
          >
            <FiEye />
          </button>
        </div>
      </Link>

      <div className="product-info">
        <div className="color-swatches">
          {product.colors.slice(0, 5).map(color => (
            <button
              key={color}
              className={`swatch ${selectedColor === color ? 'active' : ''}`}
              style={{ background: colorMap[color] || '#ccc' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedColor(color);
              }}
              title={color}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="swatch-more">+{product.colors.length - 5}</span>
          )}
        </div>

        <h3 className="product-name">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className="product-pricing">
          <span className="price-sale">Rs.{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">Rs.{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <button
          className={`btn-add-cart ${!product.inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}