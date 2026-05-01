import { useState, useEffect } from 'react';
import { FiEye, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiX, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
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
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  const getStatusCount = (status) => orders.filter(o => o.orderStatus === status).length;

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders — {orders.length} total</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All <span className="tab-count">{orders.length}</span>
        </button>
        {statusOptions.map(status => (
          <button key={status} className={filter === status ? 'active' : ''} onClick={() => setFilter(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {getStatusCount(status) > 0 && <span className="tab-count">{getStatusCount(status)}</span>}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <FiPackage size={42} />
          <p>No orders found</p>
        </div>
      ) : (
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
                    <span>Customer</span>
                    <strong>{order.user?.name || 'Guest'}</strong>
                  </div>
                  <div className="info-row">
                    <span>Date</span>
                    <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div className="info-row">
                    <span>Items</span>
                    <strong>{order.orderItems?.length || 0} item(s)</strong>
                  </div>
                  <div className="info-row total-row">
                    <span>Total</span>
                    <strong className="order-total">Rs.{order.totalPrice?.toLocaleString()}</strong>
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
                    {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content large order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order #{selectedOrder._id?.slice(-8)}</h2>
                <span className={`order-status-inline ${selectedOrder.orderStatus}`}>
                  {statusIcons[selectedOrder.orderStatus]} {selectedOrder.orderStatus}
                </span>
              </div>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}><FiX /></button>
            </div>

            <div className="order-details-body">
              <div className="order-details-grid">
                <div className="details-section">
                  <div className="section-title"><FiUser /> Customer</div>
                  <div className="detail-info-list">
                    <div className="detail-info-item">
                      <label>Name</label>
                      <span>{selectedOrder.user?.name || 'Guest'}</span>
                    </div>
                    <div className="detail-info-item">
                      <label>Email</label>
                      <span>{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-info-item">
                      <label>Phone</label>
                      <span>{selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <div className="section-title"><FiMapPin /> Shipping Address</div>
                  <div className="detail-info-list">
                    <div className="detail-info-item">
                      <label>Full Name</label>
                      <span>{selectedOrder.shippingAddress?.fullName || 'N/A'}</span>
                    </div>
                    <div className="detail-info-item">
                      <label>Address</label>
                      <span>{selectedOrder.shippingAddress?.address}</span>
                    </div>
                    <div className="detail-info-item">
                      <label>City / State</label>
                      <span>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</span>
                    </div>
                    <div className="detail-info-item">
                      <label>ZIP Code</label>
                      <span>{selectedOrder.shippingAddress?.zipCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-section full-width">
                <div className="section-title"><FiPackage /> Order Items</div>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="item-name">{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>Rs.{item.price?.toLocaleString()}</td>
                        <td className="item-total">Rs.{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-summary-section">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs.{selectedOrder.itemsPrice?.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Rs.{selectedOrder.shippingPrice?.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>Rs.{selectedOrder.totalPrice?.toLocaleString()}</span>
                </div>
              </div>

              <div className="order-modal-footer">
                <span className="modal-label">Update Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  className="status-select-modal"
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button className="close-order-btn" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}