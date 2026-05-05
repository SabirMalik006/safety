import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiUser, FiPackage, FiChevronDown, FiShield, FiTruck, FiTool, FiZap, FiBox, FiActivity, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProducts, getCategories } from '../services/productService';
import { getCurrentUser } from '../services/authService';
import horizonHubLogo from '../assets/helo.jpeg';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/collections/all-products' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  
  const searchRef = useRef(null);
  const catRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const user = getCurrentUser();

  const cartCount = (cartItems && Array.isArray(cartItems)) 
    ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0) 
    : 0;
  const wishlistCount = (wishlist && Array.isArray(wishlist)) ? wishlist.length : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    fetchCats();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchCats = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setSearching(true);
        try {
          const res = await getProducts({ search: searchQuery });
          if (res.success) {
            setSearchResults(res.data.slice(0, 5));
          }
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen]);

  const handleNavClick = () => {
    setMenuOpen(false);
    setCatDropdownOpen(false);
    setMobileCatOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSearchSelect = (slug) => {
    navigate(`/products/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <div className="ann-bar">
        <div className="ann-track">
          {[...Array(6)].map((_, i) => (
            <span key={i}>
              🛡️ Premium Safety Equipment | Certified Standards | Shop Now! &nbsp;&nbsp;&nbsp;
              🚚 Free Delivery on orders above Rs.10,000 &nbsp;&nbsp;&nbsp;
              ⚡ Industrial Grade Protection for Professionals &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="container nb-container">
          <Link to="/" className="nb-logo" onClick={handleNavClick}>
            <span className="nb-brand">
              <span className="nb-brand-mark" aria-hidden="true">
                <img src={horizonHubLogo} alt="" />
              </span>
              <span className="nb-brand-byline">by Horizon-Integrated Solutions</span>
              <span className="sr-only">The Horizon Hub</span>
            </span>
          </Link>

          <button className="nb-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <ul className="nb-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path} onClick={handleNavClick}>{link.label}</Link>
              </li>
            ))}
            <li className="nav-item-dropdown" ref={catRef}>
              <button 
                className={`nav-drop-btn ${catDropdownOpen ? 'active' : ''}`}
                onMouseEnter={() => setCatDropdownOpen(true)}
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
              >
                Categories <FiChevronDown />
              </button>
              {catDropdownOpen && (
                <div className="nb-dropdown-card" onMouseLeave={() => setCatDropdownOpen(false)}>
                  <div className="dropdown-grid">
                    {categories.length > 0 ? categories.map(cat => (
                      <Link 
                        key={cat._id} 
                        to={`/collections/${cat.slug}`} 
                        className="dropdown-item"
                        onClick={handleNavClick}
                      >
                        <span className="item-accent"></span>
                        {cat.name}
                      </Link>
                    )) : (
                      <span className="no-cats">No categories found</span>
                    )}
                  </div>
                </div>
              )}
            </li>
          </ul>

          <div className="nb-actions">
            <div className="desktop-only-actions">
              <div className="nb-search-wrap" ref={searchRef}>
                <button className="nb-icon" onClick={() => setSearchOpen(!searchOpen)}>
                  <FiSearch size={20} />
                </button>

                {searchOpen && (
                  <div className="nb-search-box">
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searching && <div className="search-loading">Searching...</div>}
                    {searchResults.length > 0 && (
                      <ul className="nb-results">
                        {searchResults.map(p => (
                          <li key={p._id} onClick={() => handleSearchSelect(p.slug)}>
                            <img src={p.images?.[0]?.url || p.image || '/images/placeholder.jpg'} alt={p.name} />
                            <div>
                              <span className="r-name">{p.name}</span>
                              <span className="r-price">Rs.{p.price?.toLocaleString()}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <Link to="/pages/wishlist" className="nb-icon">
                <FiHeart size={20} />
                {wishlistCount > 0 && <span className="nb-badge">{wishlistCount}</span>}
              </Link>

              <Link to="/cart" className="nb-icon">
                <FiShoppingCart size={20} />
                {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
              </Link>

              {user ? (
                <Link to="/dashboard" className="nb-icon user-logged" title="My Dashboard">
                  <FiUser size={20} />
                  <span className="user-dot"></span>
                </Link>
              ) : (
                <div className="nb-auth-buttons">
                  <Link to="/login" className="btn-login-ghost">Log In</Link>
                  <Link to="/register" className="btn-signup-solid">Sign Up</Link>
                </div>
              )}
              
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nb-icon admin-badge" title="Admin Panel">
                  <FiPackage size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU OVERLAY ── */}
        <div className={`nb-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <div className="mobile-search-bar">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="mobile-close" onClick={() => setMenuOpen(false)}>
              <FiX size={24} />
            </button>
          </div>

          <div className="mobile-menu-content">

            {searchQuery.length > 2 && (
              <div className="mobile-search-results">
                {searching ? (
                  <div className="mob-searching">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(p => (
                    <div key={p._id} className="mob-search-item" onClick={() => handleSearchSelect(p.slug)}>
                      <img src={p.images?.[0]?.url || p.image} alt="" />
                      <div>
                        <h6>{p.name}</h6>
                        <span>Rs.{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mob-no-results">No products found</div>
                )}
              </div>
            )}

            <ul className="mobile-nav-list">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link to={link.path} onClick={handleNavClick}>{link.label}</Link>
                </li>
              ))}
              
              <li className="mobile-dropdown">
                <button 
                  className={`mobile-drop-btn ${mobileCatOpen ? 'active' : ''}`}
                  onClick={() => setMobileCatOpen(!mobileCatOpen)}
                >
                  Categories <FiChevronDown className="arrow" />
                </button>
                <div className={`mobile-drop-content ${mobileCatOpen ? 'open' : ''}`}>
                  {categories.map(cat => (
                    <Link key={cat._id} to={`/collections/${cat.slug}`} onClick={handleNavClick}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </li>
              
              {/* Added Icons to Mobile Menu */}
              <li>
                <Link to="/pages/wishlist" onClick={handleNavClick} className="mobile-nav-icon-link">
                  <FiHeart /> Wishlist {wishlistCount > 0 && <span className="mob-badge">{wishlistCount}</span>}
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={handleNavClick} className="mobile-nav-icon-link">
                  <FiShoppingCart /> Cart {cartCount > 0 && <span className="mob-badge">{cartCount}</span>}
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-footer">
              <hr className="mobile-divider" />
              {user ? (
                <ul className="mobile-user-links">
                  <li><Link to="/dashboard" onClick={handleNavClick}><FiUser /> My Dashboard</Link></li>
                  {user.role === 'admin' && <li><Link to="/admin/dashboard" onClick={handleNavClick}><FiPackage /> Admin Panel</Link></li>}
                </ul>
              ) : (
                <div className="mobile-auth-stack">
                  <Link to="/login" className="btn-login-ghost" onClick={handleNavClick}>Log In</Link>
                  <Link to="/register" className="btn-signup-solid" onClick={handleNavClick}>Sign Up</Link>
                </div>
              )}
              
              <div className="mobile-contact-info">
                <p>Need Help? Call us:</p>
                <a href="tel:+923001234567">+92 300 1234567</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}