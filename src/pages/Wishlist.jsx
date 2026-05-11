import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty-page">
        <div className="empty-wishlist-card">
          <div className="empty-icon-wrap">
            <FiHeart size={50} />
          </div>
          <h1>Your wishlist is empty</h1>
          <p>Save essential industrial gear for later!</p>
          <Link to="/collections/all-products" className="btn-primary">
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-content">
      <div className="container wishlist-header">
        <h1>My Wishlist</h1>
        <span>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="container">
        <div className="wishlist-grid">
          {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
