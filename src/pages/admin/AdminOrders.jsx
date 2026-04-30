import { useState, useEffect } from 'react';
import { FiEye, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusIcons = {
  pending: <FiClock />,
  processing: <FiPackage />,
  shipped: <FiTruck />,
  delivered: <FiCheckCircle />,
  cancelled: <FiXCircle />
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        {statusOptions.map(status => (
          <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="orders-grid">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-id">#{order._id?.slice(-8)}</div>
              <div className={`order-status ${order.orderStatus}`}>
                {statusIcons[order.orderStatus]} {order.orderStatus}
              </div>
            </div>
            <div className="order-body">
              <div className="order-info">
                <div className="info-row">
                  <span>Customer:</span>
                  <strong>{order.user?.name || 'Guest'}</strong>
                </div>
                <div className="info-row">
                  <span>Date:</span>
                  <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="info-row">
                  <span>Total:</span>
                  <strong className="order-total">Rs.{order.totalPrice?.toLocaleString()}</strong>
                </div>
                <div className="info-row">
                  <span>Items:</span>
                  <strong>{order.orderItems?.length || 0}</strong>
                </div>
              </div>
              <div className="order-actions">
                <button className="view-btn" onClick={() => setSelectedOrder(order)}>
                  <FiEye /> View Details
                </button>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="status-select"
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-details" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder._id?.slice(-8)}</h2>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}><FiXCircle /></button>
            </div>
            <div className="order-details-body">
              <div className="details-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.user?.name || 'Guest'}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || 'N/A'}</p>
              </div>
              <div className="details-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                <p>{selectedOrder.shippingAddress?.zipCode}</p>
              </div>
              <div className="details-section">
                <h3>Order Items</h3>
                <table className="order-items-table">
                  <thead>
                    <tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>Rs.{item.price?.toLocaleString()}</td>
                        <td>Rs.{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="details-section summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs.{selectedOrder.itemsPrice?.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Rs.{selectedOrder.shippingPrice?.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs.{selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}