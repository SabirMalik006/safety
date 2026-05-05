import { useState, useEffect } from 'react';
import { FiShoppingBag, FiSearch } from 'react-icons/fi';
import { getMyOrders } from '../../services/orderService';
import OrderCard from '../../components/OrderCard';
import { Link } from 'react-router-dom';

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-content-area">
      <div className="section-header-top">
        <div>
          <h1>My Orders</h1>
          <p>Track and manage your purchase history</p>
        </div>
        <div className="order-search">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state-card">
          <FiShoppingBag size={48} />
          <h3>No orders found</h3>
          <p>It seems you haven't placed any orders yet. Check out our latest products!</p>
          <Link to="/collections/all-products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-full-list">
          {filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="no-search-results">
              <p>No orders matching "#{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardOrders;
