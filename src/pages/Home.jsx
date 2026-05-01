import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiStar, FiTruck, FiRefreshCw,
  FiShield, FiHeadphones, FiChevronDown
} from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getHeroes } from '../services/heroService';
import { getProducts } from '../services/productService';
import { products as mockProducts, categories, reviews } from '../data/products';
import './Home.css';

// Features array - same rahega
const features = [
  { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders above Rs.3,999' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: <FiShield />, title: 'Secure Payment', desc: 'COD & digital payments' },
  { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always here to help you' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch heroes from backend
        const heroRes = await getHeroes();
        if (heroRes.success && heroRes.data.length > 0) {
          // Convert backend hero format to frontend format (design ke hisaab se)
          const formattedHeroes = heroRes.data.map((hero, index) => ({
            id: hero._id,
            tag: hero.subtitle || 'Featured',
            title: hero.title,
            subtitle: hero.description || 'Premium safety equipment',
            cta: hero.buttonText || 'Shop Now',
            ctaPath: hero.buttonLink || '/collections/all-products',
            image: hero.imageUrl,
          }));
          setHeroSlides(formattedHeroes);
        } else {
          // Fallback to mock data if no heroes in DB
          setHeroSlides([
            {
              id: 1,
              tag: 'Season End Sale',
              title: 'Protective Goggles',
              subtitle: 'Close-up Photo of Pliers and Protective Goggles',
              cta: 'Shop Now',
              ctaPath: '/collections/all-products',
              image: 'https://images.pexels.com/photos/9242909/pexels-photo-9242909.jpeg',
            },
            {
              id: 2,
              tag: 'New Arrivals',
              title: 'Construction Helmet',
              subtitle: 'Yellow Construction Helmet on Industrial Site',
              cta: 'Explore Collection',
              ctaPath: '/collections/all-products',
              image: 'https://images.pexels.com/photos/34965713/pexels-photo-34965713.jpeg',
            },
            {
              id: 3,
              tag: "Men's Collection",
              title: 'Hand Tools',
              subtitle: 'Flat Lay Photography of Hand Tools',
              cta: 'Shop Wallets',
              ctaPath: '/collections/all-products',
              image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
            },
          ]);
        }

        // Fetch featured products from backend
        const productsRes = await getProducts({ featured: 'true' });
        if (productsRes.success && productsRes.data.length > 0) {
          // Convert backend product format to frontend ProductCard expected format
          const formattedProducts = productsRes.data.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            comparePrice: product.comparePrice,
            image: product.images?.[0]?.url || '/images/placeholder.jpg',
            slug: product.slug,
            rating: product.rating,
            reviewCount: product.numReviews,
            colors: product.colors || [],
          }));
          setBestSellers(formattedProducts);
        } else {
          // Fallback to mock products
          setBestSellers(mockProducts.slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback to mock data on error
        setHeroSlides([
          {
            id: 1,
            tag: 'Season End Sale',
            title: 'Protective Goggles',
            subtitle: 'Close-up Photo of Pliers and Protective Goggles',
            cta: 'Shop Now',
            ctaPath: '/collections/best-selling',
            image: 'https://images.pexels.com/photos/9242909/pexels-photo-9242909.jpeg',
          },
          {
            id: 2,
            tag: 'New Arrivals',
            title: 'Construction Helmet',
            subtitle: 'Yellow Construction Helmet on Industrial Site',
            cta: 'Explore Collection',
            ctaPath: '/collections/best-selling',
            image: 'https://images.pexels.com/photos/34965713/pexels-photo-34965713.jpeg',
          },
          {
            id: 3,
            tag: "Men's Collection",
            title: 'Hand Tools',
            subtitle: 'Flat Lay Photography of Hand Tools',
            cta: 'Shop Wallets',
            ctaPath: '/collections/best-selling',
            image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg',
          },
        ]);
        setBestSellers(mockProducts.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  if (loading) {
    return (
      <div className="home">
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--steel)',
          color: 'white'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="home page-ready">

        {/* ── CINEMATIC HERO ── */}
        <section className="hero-wrap">
          <div
            className="hero-track"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`hero-slide ${idx === activeSlide ? 'active' : ''}`}
                data-index={idx + 1}
              >
                <img src={slide.image} alt={slide.title} className="hero-img" />
                <div className="hero-scrim" />
                <span className="hero-tag-badge">{slide.tag}</span>

                <div className="hero-body">
                  <h1 className="hero-title">
                    {slide.title.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </h1>
                  <p className="hero-sub">{slide.subtitle}</p>
                  <Link to={slide.ctaPath} className="hero-cta-btn">
                    {slide.cta} <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`hdot${i === activeSlide ? ' active' : ''}`}
                onClick={() => setActiveSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="hero-bar">
            <Link to="/collections/all-products" className="hero-bar-btn">
              Best Selling Items
            </Link>
            <Link to="/collections/all-products" className="hero-bar-btn">
              Popular Items
            </Link>
          </div>
        </section>

        {/* ── FEATURES BAR ── */}
        <section className="feat-bar">
          <div className="container feat-grid">
            {features.map((f, i) => (
              <div key={i} className="feat-item">
                <span className="feat-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHOP BY STYLE ── */}
        <section id="shop" className="section-pad">
          <div className="container">
            <p className="section-tag">Explore</p>
            <h2 className="section-title">Shop By Category</h2>
            <p className="section-subtitle">Your safety, our priority — explore our premium protection gear</p>
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

        {/* ── BEST SELLERS ── */}
        <section className="section-pad bg-cream-section">
          <div className="container">
            <p className="section-tag">Popular</p>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Our most-loved pieces, loved by 5,000+ customers.</p>
            <div className="products-grid">
              {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/collections/all-products" className="btn-outline-large">
                View All Products <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <section className="promo-banner">
          <div className="container promo-inner">
            <div className="promo-text">
              <span className="promo-tag">Limited Time Offer</span>
              <h2>Season End Sale — Up to 20% Off!</h2>
              <p>Grab your favourite styles before they're gone. Free delivery on orders above Rs.3,999.</p>
              <Link to="/collections/all-products" className="hero-btn">Shop the Sale <FiArrowRight /></Link>
            </div>
            <div className="promo-image">
              <img src="https://images.pexels.com/photos/5357150/pexels-photo-5357150.jpeg" alt="Sale" />
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="reviews" className="section-pad reveal">
          <div className="container">
            <p className="section-tag">Testimonials</p>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real CarryMe customers across Pakistan.</p>
            <div className="reviews-marquee">
              <div className="reviews-track">
                {[...reviews, ...reviews].map((r, idx) => (
                  <div key={`${r.id}-${idx}`} className="review-card">
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
          </div>
        </section>

        {/* ── INSTAGRAM ── */}
        <section className="instagram-section">
          <div className="container" style={{ textAlign: 'center' }}>
            <p className="section-tag">Follow Us</p>
            <h2 className="section-title">@Horizon.pk</h2>
            <p className="section-subtitle">Tag us in your photos for a chance to be featured!</p>
            <div className="instagram-grid">
              {[
                'https://images.pexels.com/photos/14528645/pexels-photo-14528645.jpeg',
                'https://images.pexels.com/photos/5466150/pexels-photo-5466150.jpeg',
                'https://images.pexels.com/photos/7723358/pexels-photo-7723358.jpeg',
                'https://images.pexels.com/photos/18510503/pexels-photo-18510503.jpeg',
                'https://images.pexels.com/photos/20844818/pexels-photo-20844818.jpeg',
                'https://images.pexels.com/photos/34965713/pexels-photo-34965713.jpeg',
              ].map((img, i) => (
                <div key={i} className="ig-item">
                  <img src={img} alt={`Instagram ${i + 1}`} />
                  <div className="ig-overlay"><FiArrowRight /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}