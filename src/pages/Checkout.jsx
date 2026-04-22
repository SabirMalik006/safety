// src/pages/Checkout.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiChevronRight, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    saveInfo: false,
    sameAsShipping: true,
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [openPayment, setOpenPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 199;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setOpenPayment(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order processing
    setTimeout(() => {
      setOrderComplete(true);
      clearCart();
      setIsSubmitting(false);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="checkout-success">
        <div className="success-container">
          <FiCheckCircle className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. You will receive a confirmation email shortly.</p>
          <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="back-to-cart">
          ← Back to Cart
        </Link>
        <h1 className="checkout-title">SafetyMe</h1>
      </div>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          {/* Contact Section */}
          <div className="form-section">
            <h2 className="section-title">Contact</h2>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email or mobile phone number"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newsletter"
                onChange={() => {}}
              />
              <span>Email me with news and offers</span>
            </label>
          </div>

          {/* Delivery Section */}
          <div className="form-section">
            <h2 className="section-title">Delivery</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Country/Region</label>
                <select className="form-input" defaultValue="PK">
                  <option value="PK">Pakistan</option>
                </select>
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal code (optional)"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleChange}
              />
              <span>Save this information for next time</span>
            </label>
          </div>

          {/* Shipping Method */}
          <div className="form-section">
            <h2 className="section-title">Shipping method</h2>
            <div className="shipping-option">
              <div className="shipping-info">
                <span className="shipping-name">Standard Shipping</span>
                <span className="shipping-price">Rs {shipping.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Payment Section - Updated with 3 separate boxes */}
          <div className="form-section">
            <h2 className="section-title">Payment</h2>
            <p className="payment-security">
              <FiLock /> All transactions are secure and encrypted.
            </p>

            <div className="payment-options-container">
              {/* Cash on Delivery Option */}
              <div className={`payment-box ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <div 
                  className="payment-box-header"
                  onClick={() => handlePaymentSelect('cod')}
                >
                  <div className="payment-box-radio">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentSelect('cod')}
                    />
                    <strong>Cash on Delivery (COD)</strong>
                  </div>
                  <FiChevronDown className={`payment-arrow ${openPayment === 'cod' ? 'open' : ''}`} />
                </div>
                
                {openPayment === 'cod' && (
                  <div className="payment-box-content">
                    <div className="payment-info">
                      <p>Pay when you receive your order at your doorstep.</p>
                      <div className="payment-note">
                        <strong>Note:</strong>
                        <p>Please keep exact cash ready for smooth delivery.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Easypaisa Option */}
              <div className={`payment-box ${paymentMethod === 'easypaisa' ? 'selected' : ''}`}>
                <div 
                  className="payment-box-header"
                  onClick={() => handlePaymentSelect('easypaisa')}
                >
                  <div className="payment-box-radio">
                    <input
                      type="radio"
                      name="payment"
                      value="easypaisa"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => handlePaymentSelect('easypaisa')}
                    />
                    <strong>Easypaisa</strong>
                  </div>
                  <FiChevronDown className={`payment-arrow ${openPayment === 'easypaisa' ? 'open' : ''}`} />
                </div>
                
                {openPayment === 'easypaisa' && (
                  <div className="payment-box-content">
                    <div className="bank-details">
                      <p><strong>Account Details:</strong></p>
                      <p>Account Name: SafetyMe Official</p>
                      <p>Bank / Service: Easypaisa</p>
                      <p>Account Number: 0329 7239880</p>
                    </div>
                    <div className="payment-note">
                      <strong>Note:</strong>
                      <p>To confirm your order, please send the payment screenshot along with your order details to +92 329 7239880 after completing the payment.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Faysal Bank Option */}
              <div className={`payment-box ${paymentMethod === 'faysal' ? 'selected' : ''}`}>
                <div 
                  className="payment-box-header"
                  onClick={() => handlePaymentSelect('faysal')}
                >
                  <div className="payment-box-radio">
                    <input
                      type="radio"
                      name="payment"
                      value="faysal"
                      checked={paymentMethod === 'faysal'}
                      onChange={() => handlePaymentSelect('faysal')}
                    />
                    <strong>Faysal Bank</strong>
                  </div>
                  <FiChevronDown className={`payment-arrow ${openPayment === 'faysal' ? 'open' : ''}`} />
                </div>
                
                {openPayment === 'faysal' && (
                  <div className="payment-box-content">
                    <div className="bank-details">
                      <p><strong>Bank Details:</strong></p>
                      <p>Bank Name: Faysal Bank</p>
                      <p>Account Title: SafetyMe</p>
                      <p>Account Number: 1234-5678901</p>
                      <p>IBAN: PK65FAYS1234567890123</p>
                    </div>
                    <div className="payment-note">
                      <strong>Note:</strong>
                      <p>After bank transfer, please send the payment screenshot to +92 329 7239880 for order confirmation.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="form-section">
            <h2 className="section-title">Billing address</h2>
            <label className="radio-label">
              <input
                type="radio"
                name="billingAddress"
                value="same"
                checked={formData.sameAsShipping}
                onChange={() => setFormData(prev => ({ ...prev, sameAsShipping: true }))}
              />
              <span>Same as shipping address</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="billingAddress"
                value="different"
                checked={!formData.sameAsShipping}
                onChange={() => setFormData(prev => ({ ...prev, sameAsShipping: false }))}
              />
              <span>Use a different billing address</span>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="complete-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Complete order'}
          </button>

          <div className="privacy-policy">
            <Link to="/privacy-policy">Privacy policy</Link>
          </div>
        </form>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h3 className="summary-title">Order summary</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div className="item-info">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                </div>
                <span className="item-price">Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs {shipping.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <p className="tax-note">Including Rs 0.00 in taxes</p>
          </div>
        </div>
      </div>
    </div>
  );
}