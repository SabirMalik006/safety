import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy Loaded Pages
const Home = lazy(() => import('./pages/Home'));
const Collections = lazy(() => import('./pages/Collections'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Reviews = lazy(() => import('./pages/Reviews'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPaymentVerification = lazy(() => import('./pages/admin/AdminPaymentVerification'));

// Loading Spinner Component
const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
    <style>{`
      .page-loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        width: 100%;
      }
      .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(196, 164, 122, 0.1);
        border-top-color: #c4a47a;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Layout component to conditionally show Navbar and Footer
function Layout({ children }) {
  const location = useLocation();
  
  // Navbar/Footer visibility rules
  // - Show Navbar on checkout (requested)
  // - Hide Navbar on auth pages + admin routes
  // - Hide Footer on checkout + auth pages + admin routes
  const hideNavbarPages = ['/login', '/register'];
  const hideFooterPages = ['/checkout', '/login', '/register'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNavbar = hideNavbarPages.includes(location.pathname) || isAdminRoute;
  const shouldHideFooter = hideFooterPages.includes(location.pathname) || isAdminRoute;
  
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? 'has-navbar' : ''}>{children}</main>
      {!shouldHideFooter && <Footer />}
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
            <Toaster position="top-right" />
            <Suspense fallback={<PageLoader />}>
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
              <Route path="/profile" element={<Profile />} />
              
              {/* Checkout - No Navbar/Footer */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              
              {/* Wholesale Page */}
              <Route path="/pages/wholesale" element={
                <div className="page-content" style={{ padding: '6rem 0', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Wholesale Inquiry</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Contact us at info@thehorizonhub.com for industrial bulk orders.</p>
                </div>
              } />
              
              {/* Auth Pages - No Navbar/Footer */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              
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
            </Suspense>
          </Layout>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}