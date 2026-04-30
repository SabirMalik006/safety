import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Layout component to conditionally show Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  
  // Pages where Navbar and Footer should be hidden
  const hideNavFooterPages = ['/checkout', '/login', '/register', '/dashboard'];
  const shouldHideNavFooter = hideNavFooterPages.includes(location.pathname);
  
  return (
    <>
      {!shouldHideNavFooter && <Navbar />}
      <main>{children}</main>
      {!shouldHideNavFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          <Layout>
            <Routes>
              {/* Public Routes with Navbar/Footer */}
              <Route path="/" element={<Home />} />
              <Route path="/collections/:slug" element={<Collections />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/pages/wishlist" element={<Wishlist />} />
              <Route path="/pages/reviews" element={<Reviews />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/about" element={<AboutUs />} />
              
              {/* Checkout - No Navbar/Footer */}
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Wholesale Page */}
              <Route path="/pages/wholesale" element={
                <div className="page-content" style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Wholesale Inquiry</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Contact us at info@safetyme.pk for industrial bulk orders.</p>
                </div>
              } />
              
              {/* Auth Pages - No Navbar/Footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* 404 Page */}
              <Route path="*" element={
                <div className="page-content" style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>404 — Page Not Found</h2>
                  <a href="/" style={{ color: 'var(--accent-dark)', marginTop: '1rem', display: 'block' }}>← Back to Home</a>
                </div>
              } />
            </Routes>
          </Layout>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}