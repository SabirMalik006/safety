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

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminHero from './pages/admin/AdminHero';
import AdminReviews from './pages/admin/AdminReviews';
import AdminContacts from './pages/admin/AdminContacts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPaymentVerification from './pages/admin/AdminPaymentVerification';

// Layout component to conditionally show Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  
  // Pages where Navbar and Footer should be hidden
  const hideNavFooterPages = ['/checkout', '/login', '/register', '/dashboard'];
  // Also hide on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNavFooter = hideNavFooterPages.includes(location.pathname) || isAdminRoute;
  
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
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
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
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              
              {/* Admin Routes - No Navbar/Footer, Protected Layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="payment-verification" element={<AdminPaymentVerification />} />
              </Route>
              
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