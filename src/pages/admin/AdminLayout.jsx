import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiPackage, FiShoppingBag, FiStar, FiMail, FiUsers, 
  FiMenu, FiX, FiLogOut, FiHome, FiSliders, FiBell, FiUser,
  FiChevronRight, FiChevronLeft, FiCreditCard
} from 'react-icons/fi';
import { getCurrentUser, logout } from '../../services/authService';
import './AdminLayout.css';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
  { path: '/admin/categories', label: 'Categories', icon: <FiShoppingBag /> },
  { path: '/admin/orders', label: 'Orders', icon: <FiSliders /> },
  { path: '/admin/hero', label: 'Hero Section', icon: <FiHome /> },
  { path: '/admin/reviews', label: 'Reviews', icon: <FiStar /> },
  { path: '/admin/contacts', label: 'Messages', icon: <FiMail /> },
  { path: '/admin/users', label: 'Users', icon: <FiUsers /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      if (currentUser.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      setUser(currentUser);
      setCheckingAuth(false);
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    document.body.style.overflow = 'unset';
    navigate('/login');
  };

  useEffect(() => {
    if (logoutModalOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [logoutModalOpen, mobileMenuOpen]);

  if (checkingAuth) {
    return (
      <div className="admin-auth-loading">
        <div className="auth-spinner"></div>
        <span>Verifying access...</span>
      </div>
    );
  }

  const NavContent = () => (
    <>
      <div className="admin-nav-header">
        <Link to="/admin/dashboard" className="admin-logo">
          <span className="logo-icon">⛑️</span>
          <span className="logo-text">Horizon<span>Admin</span></span>
        </Link>
      </div>

      <nav className="admin-nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-link ${location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {(location.pathname === item.path) && <span className="nav-active-dot"></span>}
          </Link>
        ))}
      </nav>

      <div className="admin-nav-footer">
        <div className="admin-user-info">
          <div className="admin-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="admin-user-details">
            <span className="admin-user-name">{user?.name}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          <FiLogOut /> <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className={`admin-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)} />
      <aside className={`admin-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <Link to="/admin/dashboard" className="admin-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-icon">⛑️</span>
            <span className="logo-text">Horizon<span>Admin</span></span>
          </Link>
          <button className="close-mobile" onClick={() => setMobileMenuOpen(false)}>
            <FiX />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="admin-topbar">
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <FiMenu />
          </button>
          <div className="admin-topbar-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-dot"></span>
            </button>
            <div className="topbar-user">
              <span className="topbar-user-name">{user?.name?.split(' ')[0]}</span>
              <div className="topbar-avatar">{user?.name?.charAt(0) || 'A'}</div>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="confirm-modal-overlay" onClick={() => setLogoutModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon logout-icon">
              <FiLogOut />
            </div>
            <h3>Sign Out</h3>
            <p>Are you sure you want to log out of the admin panel?</p>
            <div className="confirm-modal-actions">
              <button className="confirm-cancel-btn" onClick={() => setLogoutModalOpen(false)}>
                Cancel
              </button>
              <button className="confirm-danger-btn" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}