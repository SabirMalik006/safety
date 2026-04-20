import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiRefreshCw, FiShield, FiHeadphones, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { products, categories, reviews } from '../data/products';
import './Home.css';

const heroSlides = [
  {
    id: 1,
    tag: 'Season End Sale',
    title: 'Carry Your\nStory in Style',
    subtitle: 'Premium bags crafted for the modern Pakistani woman',
    cta: 'Shop Now',
    ctaPath: '/collections/all-bags',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=85',
    bg: '#f0ebe4',
  },
  {
    id: 2,
    tag: 'New Arrivals',
    title: 'Elegance\nMeets Function',
    subtitle: 'Discover our latest collection of shoulder bags and totes',
    cta: 'Explore Collection',
    ctaPath: '/collections/best-selling',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1400&q=85',
    bg: '#e8f0e4',
  },
  {
    id: 3,
    tag: 'Men\'s Collection',
    title: 'Classic Wallets\nFor Modern Men',
    subtitle: 'Slim, stylish, and built to last — wallets for every occasion',
    cta: 'Shop Wallets',
    ctaPath: '/collections/men-wallets',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1400&q=85',
    bg: '#e4e8f0',
  },
];

const features = [
  { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders above Rs.3,999' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: <FiShield />, title: 'Secure Payment', desc: 'COD & digital payments' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help you' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSkipLoader = () => {
    setFadeOut(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const bestSellers = products.slice(0, 8);

  if (loading) {
    return (
      <div className={`loader-screen ${fadeOut ? 'fade-out' : ''}`}>
        <div className="loader-content">
          <div className="loader-logo">
            <div className="bag-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path 
                  d="M20 25H60L56 65H24L20 25Z" 
                  stroke="#2F1810" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="bag-body"
                />
                <path 
                  d="M30 25V20C30 14.4772 34.4772 10 40 10C45.5228 10 50 14.4772 50 20V25" 
                  stroke="#2F1810" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  className="bag-handle"
                />
                <circle cx="35" cy="40" r="2" fill="#A88960" className="bag-dot dot-1" />
                <circle cx="45" cy="40" r="2" fill="#A88960" className="bag-dot dot-2" />
              </svg>
            </div>
            <h1 className="loader-brand">CarryMe</h1>
            <p className="loader-tagline">Premium Bags & Accessories</p>
          </div>
          
          <div className="loader-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
        </div>

        <button className="skip-loader-btn" onClick={handleSkipLoader}>
          <span>Enter Site</span>
          <FiChevronDown className="skip-icon" />
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Slider */}
      <section className="hero-section">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
            style={{ background: slide.bg }}
          >
            <div className="container hero-inner">
              <div className="hero-content">
                <span className="hero-tag">{slide.tag}</span>
                <h1 className="hero-title">
                  {slide.title.split('\n').map((line, i) => (
                    <span key={i}>{line}<br/></span>
                  ))}
                </h1>
                <p className="hero-sub">{slide.subtitle}</p>
                <Link to={slide.ctaPath} className="hero-btn">
                  {slide.cta} <FiArrowRight />
                </Link>
              </div>
              <div className="hero-image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          </div>
        ))}

        {/* Slide dots */}
        <div className="slide-dots">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>

        {/* Customer count badge */}
        <div className="hero-badge">
          <div className="badge-avatars">
            {['A', 'F', 'S', 'M'].map((l, i) => (
              <span key={i} className="avatar">{l}</span>
            ))}
          </div>
          <div>
            <strong>5,000+</strong>
            <span>Happy Customers</span>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop By Style */}
      <section className="section-pad">
        <div className="container">
          <p className="section-tag">Explore</p>
          <h2 className="section-title">Shop By Style</h2>
          <p className="section-subtitle">Express your style with our standout collection.</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/collections/${cat.slug}`} className="cat-card">
                <div className="cat-image">
                  <img src={cat.image} alt={cat.name} />
                  <div className="cat-overlay" />
                </div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <span>Shop Now <FiArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-pad bg-cream-section">
        <div className="container">
          <p className="section-tag">Popular</p>
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">Our most-loved pieces, loved by 5,000+ customers.</p>
          <div className="products-grid">
            {bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/collections/all-bags" className="btn-outline-large">
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <span className="promo-tag">Limited Time Offer</span>
            <h2>Season End Sale — Up to 20% Off!</h2>
            <p>Grab your favourite styles before they're gone. Free delivery on orders above Rs.3,999.</p>
            <Link to="/collections/all-bags" className="hero-btn">Shop the Sale <FiArrowRight /></Link>
          </div>
          <div className="promo-image">
            <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" alt="Sale" />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-pad">
        <div className="container">
          <p className="section-tag">Testimonials</p>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real CarryMe customers across Pakistan.</p>
          <div className="reviews-grid">
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-stars">
                  {[...Array(r.rating)].map((_, i) => (
                    <FiStar key={i} className="star filled" />
                  ))}
                </div>
                <p className="review-text">"{r.comment}"</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">{r.name[0]}</div>
                  <div>
                    <strong>{r.name}</strong>
                    <span>{r.location} · {r.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="instagram-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-tag">Follow Us</p>
          <h2 className="section-title">@CarryMe.pk</h2>
          <p className="section-subtitle">Tag us in your photos for a chance to be featured!</p>
          <div className="instagram-grid">
            {[
              'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
              'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80',
              'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
              'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80',
              'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
              'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400&q=80',
            ].map((img, i) => (
              <div key={i} className="ig-item">
                <img src={img} alt={`Instagram ${i + 1}`} />
                <div className="ig-overlay">
                  <FiArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}