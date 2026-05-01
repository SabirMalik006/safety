import { FiPackage, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-yellow';
      case 'processing': return 'status-blue';
      case 'shipped': return 'status-purple';
      case 'delivered': return 'status-green';
      case 'cancelled': return 'status-red';
      default: return '';
    }
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-id-group">
          <div className="order-icon-box">
            <FiPackage />
          </div>
          <div>
            <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
            <p className="order-date">
              <FiCalendar /> {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`order-status-badge ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </div>
      </div>

      <div className="order-card-body">
        <div className="order-items-preview">
          {order.orderItems.slice(0, 3).map((item, idx) => (
            <img 
              key={idx} 
              src={item.image || '/images/placeholder.jpg'} 
              alt={item.name} 
              title={item.name}
            />
          ))}
          {order.orderItems.length > 3 && (
            <div className="more-items">+{order.orderItems.length - 3}</div>
          )}
        </div>
        
        <div className="order-summary-group">
          <div className="summary-item">
            <span>Total Amount</span>
            <strong>Rs.{order.totalPrice.toLocaleString()}</strong>
          </div>
          <div className="summary-item">
            <span>Payment</span>
            <strong>{order.paymentMethod.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      <div className="order-card-footer">
        <Link to={`/dashboard/orders/${order._id}`} className="view-details-btn">
          View Details <FiChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
