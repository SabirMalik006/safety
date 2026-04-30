import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchProfile();
    
    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span>HS</span>
            <h3>Horizon Supplies</h3>
          </div>
          <button className="close-sidebar" onClick={closeSidebar}>
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">🛍️</span>
            <span>My Orders</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Header with Hamburger Menu */}
        <header className="dashboard-header">
          <div className="header-left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <div className="header-title">
              <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p>Manage your account and track orders</p>
            </div>
          </div>
          <div className="header-avatar">
            <div className="avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <span>🛍️</span>
            </div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">0</p>
              <span className="stat-label">All time orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <span>📦</span>
            </div>
            <div className="stat-info">
              <h3>Products Bought</h3>
              <p className="stat-value">0</p>
              <span className="stat-label">Items purchased</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <span>⭐</span>
            </div>
            <div className="stat-info">
              <h3>Account Type</h3>
              <p className="stat-value">{user?.role === 'admin' ? 'Admin' : 'User'}</p>
              <span className="stat-label">Your role</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <span>📅</span>
            </div>
            <div className="stat-info">
              <h3>Member Since</h3>
              <p className="stat-value">{user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</p>
              <span className="stat-label">Join date</span>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="welcome-card">
              <h2>Getting Started</h2>
              <p>Welcome to Horizon Supplies! Here are some things you can do:</p>
              <div className="action-buttons">
                <button className="action-btn primary">Browse Products</button>
                <button className="action-btn secondary">View Orders</button>
                <button className="action-btn secondary">Update Profile</button>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🎉</div>
                  <div>
                    <p>Welcome to Horizon Supplies!</p>
                    <span>Just now</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div>
                    <p>Account created successfully</p>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-card">
              <h2>Profile Information</h2>
              <div className="profile-details">
                <div className="detail-row">
                  <label>Full Name</label>
                  <p>{user?.name}</p>
                </div>
                <div className="detail-row">
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                </div>
                <div className="detail-row">
                  <label>Phone Number</label>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
                <div className="detail-row">
                  <label>Member Since</label>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="orders-card">
              <h2>My Orders</h2>
              <div className="empty-orders">
                <div className="empty-icon">📦</div>
                <p>No orders yet</p>
                <button className="shop-now-btn">Start Shopping</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <div className="settings-card">
              <h2>Account Settings</h2>
              <div className="settings-option">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive updates about your orders and promotions</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="settings-option">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;