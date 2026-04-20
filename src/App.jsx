import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Reviews from './pages/Reviews';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';

function ScrollToTop() {
  const { pathname } = window.location;
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections/:slug" element={<Collections />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/pages/wishlist" element={<Wishlist />} />
              <Route path="/pages/reviews" element={<Reviews />} />
              <Route path="/pages/wholesale" element={
                <div style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Wholesale Inquiry</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Contact us at wholesale@carryme.pk for bulk orders.</p>
                </div>
              } />
              <Route path="*" element={
                <div style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>404 — Page Not Found</h2>
                  <a href="/" style={{ color: 'var(--accent-dark)', marginTop: '1rem', display: 'block' }}>← Back to Home</a>
                </div>
              } />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
            </Routes>
          </main>
          <Footer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
