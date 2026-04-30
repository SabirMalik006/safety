import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getCurrentUser } from '../services/authService';
import { createOrderWithPaymentProof } from '../services/orderService';
import { uploadPaymentScreenshot } from '../services/uploadService';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const user = getCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentProof, setPaymentProof] = useState({
    transactionId: '',
    paymentAccount: '',
    remarks: '',
    screenshotFile: null,
    screenshotPreview: null
  });
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    phone: '',
  });

  // Bank account details to show to user
  const bankAccounts = {
    easypaisa: {
      name: 'EasyPaisa',
      account: '0344 1234567',
      holder: 'Horizon Supplies'
    },
    jazzcash: {
      name: 'JazzCash',
      account: '0344 1234567', 
      holder: 'Horizon Supplies'
    },
    bank_transfer: {
      name: 'Bank Alfalah',
      account: 'PK12 ALFH 0001 2345 6789',
      holder: 'Horizon Supplies (PVT) Ltd',
      bank: 'Bank Alfalah, Karachi'
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large! Max 5MB');
        return;
      }
      const preview = URL.createObjectURL(file);
      setPaymentProof(prev => ({ 
        ...prev, 
        screenshotFile: file, 
        screenshotPreview: preview 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentProof.transactionId) {
      toast.error('Please enter Transaction ID');
      return;
    }
    
    if (!paymentProof.screenshotFile) {
      toast.error('Please upload payment screenshot');
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Upload screenshot to Cloudinary
      let screenshotUrl = '';
      if (paymentProof.screenshotFile) {
        const uploadRes = await uploadPaymentScreenshot(paymentProof.screenshotFile);
        screenshotUrl = uploadRes.url;
      }
      
      // 2. Create order with payment proof
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
        shippingAddress: formData,
        paymentMethod: paymentMethod,
        itemsPrice: getCartTotal(),
        shippingPrice: 200,
        totalPrice: getCartTotal() + 200,
        paymentProof: {
          screenshotUrl: screenshotUrl,
          transactionId: paymentProof.transactionId,
          paymentDate: new Date().toISOString(),
          paymentAccount: paymentProof.paymentAccount,
          remarks: paymentProof.remarks
        }
      };
      
      const response = await createOrderWithPaymentProof(orderData);
      
      if (response.success) {
        toast.success('Order placed! Payment verification pending.');
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = 200;
  const total = getCartTotal() + shippingCost;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-grid">
          {/* Left - Order Form */}
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address *"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="ZIP Code *"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="form-section">
                <h3>Payment Method</h3>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>Bank Transfer</strong>
                    <small>Pay via bank transfer (1-24 hours verification)</small>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>EasyPaisa</strong>
                    <small>Pay via EasyPaisa mobile account</small>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    value="jazzcash"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <strong>JazzCash</strong>
                    <small>Pay via JazzCash mobile account</small>
                  </div>
                </label>
              </div>

              {/* Payment Instructions */}
              <div className="form-section payment-instructions">
                <h3>Payment Instructions</h3>
                <div className="bank-details">
                  <p><strong>Send payment to:</strong></p>
                  <div className="bank-info">
                    <span>{bankAccounts[paymentMethod]?.name}</span>
                    <strong>{bankAccounts[paymentMethod]?.account}</strong>
                    <small>Account Holder: {bankAccounts[paymentMethod]?.holder}</small>
                    {bankAccounts[paymentMethod]?.bank && (
                      <small>Bank: {bankAccounts[paymentMethod]?.bank}</small>
                    )}
                  </div>
                </div>
                
                <div className="payment-note">
                  <p>⚠️ <strong>Important:</strong> After payment, please provide:</p>
                  <ul>
                    <li>Transaction ID / Reference Number</li>
                    <li>Screenshot of payment confirmation</li>
                  </ul>
                  <p>Your order will be processed after payment verification (1-24 hours).</p>
                </div>
              </div>

              {/* Payment Proof Upload */}
              <div className="form-section payment-proof">
                <h3>Payment Proof</h3>
                
                <div className="form-group">
                  <label>Transaction ID *</label>
                  <input
                    type="text"
                    placeholder="Enter transaction/reference ID"
                    value={paymentProof.transactionId}
                    onChange={(e) => setPaymentProof({...paymentProof, transactionId: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Payment Account (Optional)</label>
                  <input
                    type="text"
                    placeholder="Which account did you pay from?"
                    value={paymentProof.paymentAccount}
                    onChange={(e) => setPaymentProof({...paymentProof, paymentAccount: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Upload Screenshot *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    {paymentProof.screenshotPreview && (
                      <div className="screenshot-preview">
                        <img src={paymentProof.screenshotPreview} alt="Payment proof" />
                        <button type="button" onClick={() => {
                          setPaymentProof({...paymentProof, screenshotFile: null, screenshotPreview: null});
                        }}>Remove</button>
                      </div>
                    )}
                  </div>
                  <small>Upload screenshot of payment confirmation (Max 5MB)</small>
                </div>
                
                <div className="form-group">
                  <label>Additional Remarks (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Any additional information about your payment..."
                    value={paymentProof.remarks}
                    onChange={(e) => setPaymentProof({...paymentProof, remarks: e.target.value})}
                  />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="place-order-btn">
                {loading ? 'Placing Order...' : `Place Order - Rs.${total.toLocaleString()}`}
              </button>
            </form>
          </div>

          {/* Right - Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item, idx) => (
              <div key={idx} className="summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>Rs.{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Subtotal:</span>
              <span>Rs.{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="summary-total">
              <span>Shipping:</span>
              <span>Rs.{shippingCost.toLocaleString()}</span>
            </div>
            <div className="summary-grand">
              <span>Total:</span>
              <span>Rs.{total.toLocaleString()}</span>
            </div>
            
            <div className="verification-note">
              <p>✅ Your order will be processed after payment verification</p>
              <p>📧 We'll email you when payment is verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}