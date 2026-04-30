import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiDownload, FiEye } from 'react-icons/fi';
import { getPendingVerificationOrders, verifyPayment, rejectPayment, getPaymentProofDetails } from '../../services/orderService';
import toast from 'react-hot-toast';
// import './AdminPaymentVerification.css';

export default function AdminPaymentVerification() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getPendingVerificationOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProof = async (order) => {
    try {
      const res = await getPaymentProofDetails(order._id);
      setSelectedOrder({ ...order, paymentProofDetails: res.data });
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to load payment proof');
    }
  };

  const handleVerify = async (orderId) => {
    if (window.confirm('Verify this payment? Order will be processed.')) {
      try {
        await verifyPayment(orderId, adminNotes);
        toast.success('Payment verified! Order is now processing.');
        fetchOrders();
        setModalOpen(false);
      } catch (error) {
        toast.error('Verification failed');
      }
    }
  };

  const handleReject = async (orderId) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason) {
      try {
        await rejectPayment(orderId, reason, adminNotes);
        toast.success('Payment rejected. Order cancelled.');
        fetchOrders();
        setModalOpen(false);
      } catch (error) {
        toast.error('Rejection failed');
      }
    }
  };

  if (loading) return <div className="loading">Loading pending verifications...</div>;

  return (
    <div className="admin-payment-verification">
      <div className="page-header">
        <h1>Payment Verification</h1>
        <p>Verify customer payment proofs before processing orders</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card pending">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Pending Verification</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FiCheckCircle size={48} />
          <h3>No pending verifications</h3>
          <p>All payments have been verified</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8)}</td>
                  <td>{order.user?.name}<br/><small>{order.user?.email}</small></td>
                  <td>Rs.{order.totalPrice?.toLocaleString()}</td>
                  <td><span className="payment-method">{order.paymentMethod}</span></td>
                  <td>{order.paymentProof?.transactionId || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button onClick={() => handleViewProof(order)} className="btn-view">
                      <FiEye /> View Proof
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing payment proof */}
      {modalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Verification - Order #{selectedOrder._id.slice(-8)}</h2>
              <button className="close-modal" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            
            <div className="payment-proof-details">
              <div className="proof-section">
                <h3>Payment Proof</h3>
                <div className="proof-image">
                  <img src={selectedOrder.paymentProof?.screenshotUrl} alt="Payment proof" />
                  <a href={selectedOrder.paymentProof?.screenshotUrl} download className="btn-download">
                    <FiDownload /> Download
                  </a>
                </div>
                <div className="proof-info">
                  <div className="info-row">
                    <strong>Transaction ID:</strong> {selectedOrder.paymentProof?.transactionId}
                  </div>
                  <div className="info-row">
                    <strong>Payment Date:</strong> {new Date(selectedOrder.paymentProof?.paymentDate).toLocaleString()}
                  </div>
                  <div className="info-row">
                    <strong>Paid From:</strong> {selectedOrder.paymentProof?.paymentAccount || 'Not specified'}
                  </div>
                  <div className="info-row">
                    <strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase()}
                  </div>
                  <div className="info-row">
                    <strong>Customer Remarks:</strong> {selectedOrder.paymentProof?.remarks || 'None'}
                  </div>
                </div>
              </div>

              <div className="proof-section">
                <h3>Order Details</h3>
                <div className="order-items">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="order-total">
                    <strong>Total Amount:</strong> Rs.{selectedOrder.totalPrice?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="proof-section">
                <h3>Customer Information</h3>
                <div className="customer-info">
                  <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
                </div>
              </div>

              <div className="proof-section">
                <h3>Admin Notes</h3>
                <textarea
                  className="admin-notes"
                  rows="3"
                  placeholder="Add internal notes about this verification..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button onClick={() => handleReject(selectedOrder._id)} className="btn-reject">
                  <FiXCircle /> Reject Payment
                </button>
                <button onClick={() => handleVerify(selectedOrder._id)} className="btn-verify">
                  <FiCheckCircle /> Verify & Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}