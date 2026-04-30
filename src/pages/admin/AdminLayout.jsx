import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiPackage, FiShoppingBag, FiStar, FiMail, FiUsers, 
  FiMenu, FiX, FiLogOut, FiHome, FiSliders, FiBell, FiUser,
  FiChevronRight, FiChevronLeft
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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      console.log('Current user in AdminLayout:', currentUser); // Debug log
      
      if (!currentUser) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }
      
      if (currentUser.role !== 'admin') {
        console.log('User is not admin, redirecting to dashboard');
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
    logout();
    navigate('/login');
  };

  if (checkingAuth) {
    return <div className="admin-loading">Checking authentication...</div>;
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
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
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
      <main className="admin-main">
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
    </div>
  );
}