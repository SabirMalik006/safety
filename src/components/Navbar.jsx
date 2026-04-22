import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/#shop' },
  { label: 'Reviews', path: '/#reviews' },
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
  const location = useLocation();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleNavClick = (e, path) => {
    if (path === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMenuOpen(false);
      }
    } else if (path.startsWith('/#')) {
      const id = path.substring(2);
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  const handleSearchSelect = (slug) => {
    navigate(`/products/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="ann-bar">
        <div className="ann-track">
          {[...Array(6)].map((_, i) => (
            <span key={i}>
              🎉 Season End Sale | Limited Stock | Shop Now! 🎉 &nbsp;&nbsp;&nbsp;
              🚚 Free Delivery on orders above Rs.3,999 &nbsp;&nbsp;&nbsp;
              ✨ Up to 20% Off on All Intruments ✨
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container nb-container">

          {/* Logo */}
          <Link
            to="/"
            className="nb-logo"
            onClick={(e) => handleNavClick(e, '/')}
          >
            SafetyMe
          </Link>

          {/* Hamburger (mobil) */}
          <button
            className="nb-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <ul className="nb-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side icons */}
          <div className="nb-actions">
            {/* Search */}
            <div className="nb-search-wrap" ref={searchRef}>
              <button
                className="nb-icon"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {searchOpen && (
                <div className="nb-search-box">
                  <input
                    type="text"
                    placeholder="Search for bags, wallets..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <ul className="nb-results">
                      {searchResults.map(p => (
                        <li key={p.id} onClick={() => handleSearchSelect(p.slug)}>
                          <img src={p.images[0]} alt={p.name} />
                          <div>
                            <span className="r-name">{p.name}</span>
                            <span className="r-price">Rs.{p.price.toLocaleString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/pages/wishlist" className="nb-icon">
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="nb-badge">{wishlist.length}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nb-icon">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </Link>

            {/* Account */}
            <button className="nb-icon nb-user">
              <FiUser size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`nb-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="container">
            <ul>
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}