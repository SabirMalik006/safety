import { useState, useEffect } from 'react';
import { FiEye, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiX, FiMapPin, FiUser, FiPhone, FiCreditCard, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { getAllOrders, updateOrderStatus, verifyPayment, rejectPayment } from '../../services/orderService';
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
  const [submitting, setSubmitting] = useState(false);
  
  // Draft states for modal
  const [statusDraft, setStatusDraft] = useState('');
  const [trackingDraft, setTrackingDraft] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      await updateOrderStatus(selectedOrder._id, statusDraft, trackingDraft);
      toast.success(`Order status updated to ${statusDraft}`);
      fetchOrders();
      setSelectedOrder(null); // Close modal on success as requested
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (orderId) => {
    if (window.confirm('Verify this payment? Order will be moved to processing.')) {
      setSubmitting(true);
      try {
        await verifyPayment(orderId, 'Verified via Admin Panel');
        toast.success('Payment verified! Order is now processing.');
        fetchOrders();
        setSelectedOrder(null);
      } catch (error) {
        toast.error('Verification failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleReject = async (orderId) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason) {
      setSubmitting(true);
      try {
        await rejectPayment(orderId, reason, 'Rejected via Admin Panel');
        toast.success('Payment rejected. Order cancelled.');
        fetchOrders();
        setSelectedOrder(null);
      } catch (error) {
        toast.error('Rejection failed');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setStatusDraft(order.orderStatus);
    setTrackingDraft(order.trackingNumber || '');
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  const getStatusCount = (status) => orders.filter(o => o.orderStatus === status).length;

  if (loading) return <div className="admin-loading">Loading orders...</div>;

  return (
    <div className="admin-orders">
      <div className="page-header">
        <div>
          <h1>Order Management</h1>
          <p>Track and fulfill customer orders — {orders.length} total</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All <span className="tab-count">{orders.length}</span>
        </button>
        {statusOptions.map(status => (
          <button key={status} className={`${filter === status ? 'active' : ''} tab-${status}`} onClick={() => setFilter(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {getStatusCount(status) > 0 && <span className="tab-count">{getStatusCount(status)}</span>}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <FiPackage size={42} />
          <p>No orders found in this category.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => (
            <div key={order._id} className={`order-card ${order.paymentStatus === 'pending_verification' ? 'needs-verify' : ''}`}>
              <div className="order-header">
                <div className="order-id">#{order._id?.slice(-8).toUpperCase()}</div>
                <div className={`order-status ${order.orderStatus}`}>
                  {statusIcons[order.orderStatus]} {order.orderStatus}
                </div>
              </div>
              <div className="order-body">
                <div className="order-info">
                  <div className="info-row">
                    <span>Customer</span>
                    <strong>{order.user?.name || 'Guest User'}</strong>
                  </div>
                  <div className="info-row">
                    <span>Amount</span>
                    <strong className="order-total">Rs.{order.totalPrice?.toLocaleString()}</strong>
                  </div>
                  <div className="info-row">
                    <span>Payment</span>
                    <span className={`payment-badge ${order.paymentStatus}`}>
                      {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                    </span>
                  </div>
                </div>
                <div className="order-actions">
                  <button onClick={() => openOrderModal(order)} className="view-btn">
                    <FiEye /> View & Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content large order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Order #{selectedOrder._id?.slice(-8).toUpperCase()}</h2>
                <div className="header-badges">
                  <span className={`status-pill ${selectedOrder.orderStatus}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>
              <button className="close-modal" onClick={() => setSelectedOrder(null)}><FiX /></button>
            </div>

            <div className="order-details-body" style={{ padding: '24px' }}>
              <div className="details-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Left Side: Customer & Shipping */}
                <div className="details-left">
                  <div className="details-card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiUser /> Customer Info
                    </h3>
                    <div className="info-list" style={{ fontSize: '14px' }}>
                      <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                      <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                      <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>

                  <div className="details-card">
                    <h3 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiMapPin /> Shipping Address
                    </h3>
                    <div className="addr-p" style={{ fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
                      <p>{selectedOrder.shippingAddress?.fullName}</p>
                      <p>{selectedOrder.shippingAddress?.address}</p>
                      <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                    </div>
                  </div>

                  {/* Payment Proof Section */}
                  {selectedOrder.paymentMethod !== 'cod' && (
                    <div className="payment-proof-section" style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                      <h3 style={{ fontSize: '14px', marginBottom: '12px' }}><FiCreditCard /> Payment Details</h3>
                      <p style={{ fontSize: '13px' }}><strong>Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                      <p style={{ fontSize: '13px' }}><strong>Transaction ID:</strong> {selectedOrder.paymentProof?.transactionId || 'N/A'}</p>
                      
                      {selectedOrder.paymentProof?.screenshotUrl && (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                          <a href={selectedOrder.paymentProof.screenshotUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                            View Proof
                          </a>
                        </div>
                      )}

                      {selectedOrder.paymentStatus === 'pending_verification' && (
                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                          <button className="btn-primary" style={{ fontSize: '12px', flex: 1 }} onClick={() => handleVerify(selectedOrder._id)}>Approve</button>
                          <button className="btn-secondary" style={{ fontSize: '12px', flex: 1, color: '#dc3545' }} onClick={() => handleReject(selectedOrder._id)}>Reject</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Items & Action */}
                <div className="details-right">
                  <div className="details-card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiPackage /> Order Items
                    </h3>
                    <div className="items-list" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                      {selectedOrder.orderItems?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="summary" style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Subtotal</span><span>Rs.{selectedOrder.itemsPrice?.toLocaleString()}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Shipping</span><span>Rs.{selectedOrder.shippingPrice?.toLocaleString()}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '15px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
                        <span>Total</span><span>Rs.{selectedOrder.totalPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-card action-card" style={{ padding: '20px', background: '#fff', border: '1px solid #e4a47a', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Update Status</h3>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '6px' }}>Order Status</label>
                      <select
                        className="admin-status-select"
                        value={statusDraft}
                        onChange={(e) => setStatusDraft(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '6px' }}>Tracking Number</label>
                      <input 
                        type="text" 
                        placeholder="Enter tracking ID..."
                        value={trackingDraft}
                        onChange={(e) => setTrackingDraft(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
                      onClick={handleStatusUpdate}
                      disabled={submitting}
                    >
                      {submitting ? 'Updating...' : 'Update Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}