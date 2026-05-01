import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiShield, FiClock, FiCreditCard, FiSmartphone, FiCheckCircle, FiArrowRight, FiMapPin, FiPhone, FiUser, FiMail } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getCurrentUser } from '../services/authService';
import { createOrder } from '../services/orderService';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const user = getCurrentUser();

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
  }, [cartItems, loading, navigate]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 3999 ? 0 : 200;
  const total = subtotal + shipping;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          size: item.size
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          email: formData.email
        },
        paymentMethod: paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
        orderNotes: formData.orderNotes
      };
      
      const response = await createOrder(orderData);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  if (loading || !cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${activeStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${activeStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${activeStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirm</span>
            </div>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Left Column - Form */}
          <div className="checkout-form-section">
            <form onSubmit={handlePlaceOrder}>
              {/* Shipping Information */}
              <div className="form-card">
                <div className="form-card-header">
                  <FiMapPin className="card-icon" />
                  <h2>Shipping Information</h2>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={errors.fullName ? 'error' : ''}
                      />
                    </div>
                    {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address *</label>
                    <div className="input-wrapper">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="input-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className={errors.phone ? 'error' : ''}
                    />
                  </div>
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House #, Street, Area"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Karachi"
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Sindh"
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Pakistan"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-card">
                <div className="form-card-header">
                  <FiCreditCard className="card-icon" />
                  <h2>Payment Method</h2>
                </div>

                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon">
                        <FiTruck />
                      </div>
                      <div className="payment-details">
                        <strong>Cash on Delivery</strong>
                        <span>Pay when you receive your order</span>
                      </div>
                      <FiCheckCircle className="payment-check" />
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'easypaisa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon">
                        <FiSmartphone />
                      </div>
                      <div className="payment-details">
                        <strong>EasyPaisa</strong>
                        <span>Pay via EasyPaisa mobile account</span>
                      </div>
                      <FiCheckCircle className="payment-check" />
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'jazzcash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzcash"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <div className="payment-icon">
                        <FiSmartphone />
                      </div>
                      <div className="payment-details">
                        <strong>JazzCash</strong>
                        <span>Pay via JazzCash mobile account</span>
                      </div>
                      <FiCheckCircle className="payment-check" />
                    </div>
                  </label>
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="payment-info">
                    <p>⚠️ After placing order, you'll receive payment instructions via SMS/Email</p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="form-card">
                <div className="form-card-header">
                  <FiClock className="card-icon" />
                  <h2>Order Notes (Optional)</h2>
                </div>
                <textarea
                  name="orderNotes"
                  rows="3"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Special delivery instructions or notes about your order..."
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="place-order-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>Processing Order <span className="spinner"></span></>
                ) : (
                  <>Place Order - Rs.{total.toLocaleString()} <FiArrowRight /></>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="item-qty">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      {item.color && <span className="item-variant">Color: {item.color}</span>}
                    </div>
                    <div className="item-price">
                      Rs.{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `Rs.${shipping.toLocaleString()}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="shipping-note">
                    Add Rs.{(3999 - subtotal).toLocaleString()} more for free shipping
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="guarantee-badge">
                <FiShield />
                <div>
                  <strong>Secure Checkout</strong>
                  <span>Your information is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}