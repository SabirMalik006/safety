import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight } from 'react-icons/fi';
import { getOrderById } from '../services/orderService';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Error fetching success order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="page-content" style={{ textAlign: 'center', padding: '100px 0' }}>Processing your order...</div>;

  return (
    <div className="order-success-page page-content">
      <div className="container success-card">
        <div className="success-icon">
          <FiCheckCircle size={80} />
        </div>
        <h1>Order Placed Successfully!</h1>
        <p className="order-number">Order ID: <strong>#{id?.slice(-8).toUpperCase()}</strong></p>
        <p className="success-msg">
          Thank you for your purchase. We've received your order and will begin processing it right away.
          A confirmation email has been sent to <strong>{order?.shippingAddress?.email}</strong>.
        </p>

        <div className="next-steps">
          <div className="step-item">
            <FiPackage />
            <div>
              <h4>Processing</h4>
              <p>We're preparing your safety equipment for shipment.</p>
            </div>
          </div>
          <div className="step-item">
            <FiTruck />
            <div>
              <h4>Shipping</h4>
              <p>You'll receive a tracking number once your order is dispatched.</p>
            </div>
          </div>
        </div>

        <div className="order-summary-mini">
          <h3>Order Details</h3>
          <div className="summary-row">
            <span>Payment Method:</span>
            <span>{order?.paymentMethod?.toUpperCase()}</span>
          </div>
          <div className="summary-row">
            <span>Total Amount:</span>
            <span>Rs.{order?.totalPrice?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Status:</span>
            <span className="status-badge">{order?.orderStatus}</span>
          </div>
        </div>

        {order?.paymentMethod !== 'cod' && (
          <div className="payment-instructions">
            <h4>Payment Instructions</h4>
            <p>Please send <strong>Rs.{order?.totalPrice?.toLocaleString()}</strong> to the following account:</p>
            <div className="account-details">
              <p><strong>Account Name:</strong> SafetyMe Supplies</p>
              <p><strong>{order?.paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} #:</strong> 0300-1234567</p>
            </div>
            <p className="note">⚠️ Please upload the screenshot of your payment in the dashboard to verify your order.</p>
          </div>
        )}

        <div className="success-actions">
          <Link to="/dashboard" className="btn-secondary">View Order in Dashboard</Link>
          <Link to="/collections/all-products" className="btn-primary">
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
