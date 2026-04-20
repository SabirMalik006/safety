import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'All Bags', path: '/collections/all-bags' },
  { label: 'Best Selling', path: '/collections/best-selling' },
  { label: 'Canvas Bags', path: '/collections/canvas-bags' },
  { label: 'Men Wallets', path: '/collections/men-wallets' },
  { label: 'Tote Bag', path: '/collections/tote-bag' },
  { label: 'Shoulder Bag', path: '/collections/shoulder-bag' },
  { label: 'Reviews', path: '/pages/reviews' },
  { label: 'Wholesale', path: '/pages/wholesale' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (slug) => {
    navigate(`/products/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-track">
          {[...Array(8)].map((_, i) => (
            <span key={i}>
              Season End Sale &nbsp;|&nbsp; Limited Stock &nbsp;|&nbsp; Shop Now! &nbsp;&nbsp;
              Free Delivery on orders above Rs.3,999 &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner container">
          {/* Mobile Menu Toggle */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            Carry Me
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <div className="search-wrapper" ref={searchRef}>
              <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
                <FiSearch size={20} />
              </button>
              {searchOpen && (
                <div className="search-dropdown">
                  <input
                    type="text"
                    placeholder="Search bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <ul className="search-results">
                      {searchResults.map(p => (
                        <li key={p.id} onClick={() => handleSearchSelect(p.slug)}>
                          <img src={p.images[0]} alt={p.name} />
                          <div>
                            <span className="result-name">{p.name}</span>
                            <span className="result-price">Rs.{p.price.toLocaleString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Link to="/pages/wishlist" className="icon-btn">
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="icon-btn">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            <button className="icon-btn">
              <FiUser size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <ul>
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} onClick={() => setMenuOpen(false)}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
