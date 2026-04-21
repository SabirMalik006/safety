import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty page-content">
        <FiHeart size={64} strokeWidth={1} />
        <h2>Your wishlist is empty</h2>
        <p>Save your favourite bags for later!</p>
        <Link to="/collections/all-bags" className="btn-shop">
          Browse Collection <FiArrowRight />
        </Link>
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
