import { useState, useEffect } from 'react';
import { FiShoppingBag, FiMapPin, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getMyOrders } from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import { Link } from 'react-router-dom';

const DashboardOverview = ({ user }) => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setRecentOrders(res.data.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="dashboard-content-area">
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p>From your account dashboard you can view your recent orders, manage your shipping addresses and edit your password and account details.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dash-stat-card">
          <div className="stat-icon orders"><FiShoppingBag /></div>
          <div className="stat-info">
            <h3>{recentOrders.length}</h3>
            <p>Recent Orders</p>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon addresses"><FiMapPin /></div>
          <div className="stat-info">
            <h3>{user?.addresses?.length || 0}</h3>
            <p>Saved Addresses</p>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon status"><FiCheckCircle /></div>
          <div className="stat-info">
            <h3>Active</h3>
            <p>Account Status</p>
          </div>
        </div>
      </div>

      <div className="recent-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <Link to="/dashboard/orders" className="view-all-link">View All</Link>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="empty-orders">
            <FiClock />
            <p>You haven't placed any orders yet.</p>
            <Link to="/collections" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {recentOrders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
