import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authService';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import DashboardOrders from './dashboard/DashboardOrders';
import DashboardAddresses from './dashboard/DashboardAddresses';
import DashboardProfile from './dashboard/DashboardProfile';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      // If token is invalid, it will be handled by interceptors, 
      // but let's be safe
      // navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="dashboard-loading">
      <div className="dash-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard-page page-content">
      <div className="container dashboard-container">
        <DashboardSidebar user={user} />
        
        <main className="dashboard-main-content">
          <Routes>
            <Route index element={<DashboardOverview user={user} />} />
            <Route path="orders" element={<DashboardOrders />} />
            <Route path="addresses" element={<DashboardAddresses user={user} onUpdate={fetchUserData} />} />
            <Route path="profile" element={<DashboardProfile user={user} onUpdate={fetchUserData} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;