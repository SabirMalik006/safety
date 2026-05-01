import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTruck, FiShield, FiCreditCard, FiSmartphone, FiCheckCircle, FiArrowRight, FiMapPin, FiPhone, FiUser, FiMail, FiChevronLeft, FiLock, FiChevronDown, FiUpload, FiInfo, FiX, FiImage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getCurrentUser, getProfile } from '../services/authService';
import { createOrder, uploadPaymentProof } from '../services/orderService';
import toast from 'react-hot-toast';
import './Checkout.css';

const PaymentMethodBlock = ({ id, icon: Icon, title, desc, accounts, isSelected, onSelect, paymentProof, onProofChange, screenshotFile, onFileChange, fileInputRef, uploading, onRemoveFile }) => {
  return (
    <div className={`payment-method-box ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(id)}>
      <div className="method-header">
        <div className="method-info">
          <Icon />
          <div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        </div>
        <div className="custom-radio"></div>
      </div>
      
      {isSelected && id !== 'cod' && (
        <div className="payment-details-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="bank-accounts-info">
            <div className="info-badge"><FiInfo /> Transfer to this account:</div>
            {accounts.map((acc, i) => (
              <div key={i} className="account-row">
                <span>{acc.label}:</span> <strong>{acc.value}</strong>
              </div>
            ))}
          </div>

          <div className="proof-form">
            <div className="form-group">
              <label>Transaction ID *</label>
              <input 
                name="transactionId" 
                value={paymentProof.transactionId} 
                onChange={onProofChange} 
                placeholder="Enter transaction ID" 
              />
            </div>
            <div className="form-group">
              <label>Paid From (Account/Name)</label>
              <input 
                name="paymentAccount" 
                value={paymentProof.paymentAccount} 
                onChange={onProofChange} 
                placeholder="Your account number or name" 
              />
            </div>
            
            <div className="form-group">
              <label>Payment Screenshot</label>
              <div 
                className={`proof-upload-box ${screenshotFile ? 'has-file' : ''}`}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/*" 
                  hidden 
                />
                {screenshotFile ? (
                  <div className="file-preview">
                    <FiImage />
                    <span>{screenshotFile.name}</span>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onRemoveFile(); }}><FiX /></button>
                  </div>
                ) : (
                  <>
                    <FiUpload />
                    <p>Click to upload screenshot</p>
                    <small>Supported: JPG, PNG (Max 5MB)</small>
                  </>
                )}
              </div>
              {uploading && <div className="upload-progress">Uploading to secure server...</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, loading } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const [activeAccordion, setActiveAccordion] = useState('shipping');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentProof, setPaymentProof] = useState({
    transactionId: '',
    paymentAccount: '',
    remarks: '',
    screenshotUrl: ''
  });
  
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (!loading && (!cartItems || cartItems.length === 0)) {
      navigate('/cart');
    }
    if (user) {
      fetchSavedAddresses();
    }
  }, [cartItems, loading, navigate, user]);

  const fetchSavedAddresses = async () => {
    try {
      const res = await getProfile();
      if (res.success && res.data.addresses) {
        setSavedAddresses(res.data.addresses);
        const defaultAddr = res.data.addresses.find(a => a.isDefault);
        if (defaultAddr) {
          selectAddress(defaultAddr);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectAddress = (addr) => {
    setFormData({
      ...formData,
      fullName: addr.fullName,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode
    });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  const validateShipping = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const isValid = validateShipping();
    if (!isValid) {
      toast.error('Please fill in all required fields', {
        position: 'top-center',
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
      
      // Auto-scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size must be less than 5MB');
      }
      setScreenshotFile(file);
    }
  };

  const uploadScreenshot = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('screenshot', file);
    try {
      const res = await uploadPaymentProof(formData);
      if (res.success) {
        return res.url;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Screenshot upload failed, please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login?redirect=checkout');
      return;
    }

    if (!validateForm()) return;

    if (paymentMethod !== 'cod' && !paymentProof.transactionId) {
      return toast.error('Please enter Transaction ID for verification');
    }

    setSubmitting(true);
    let finalScreenshotUrl = paymentProof.screenshotUrl;

    if (paymentMethod !== 'cod' && screenshotFile) {
      const uploadedUrl = await uploadScreenshot(screenshotFile);
      if (!uploadedUrl) {
        setSubmitting(false);
        return; // Upload failed, message already shown
      }
      finalScreenshotUrl = uploadedUrl;
    }

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
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod,
        paymentProof: paymentMethod !== 'cod' ? { ...paymentProof, screenshotUrl: finalScreenshotUrl } : undefined,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
        orderNotes: formData.orderNotes
      };
      
      console.log('📦 Placing Order:', orderData);
      
      const response = await createOrder(orderData);
      console.log('✅ Order Response:', response);
      
      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      console.error('❌ Order Placement Failed:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleProofChange = (e) => {
    setPaymentProof({ ...paymentProof, [e.target.name]: e.target.value });
  };

  if (loading || !cartItems || cartItems.length === 0) return null;

  return (
    <div className="checkout-page page-content has-navbar">
      <header className="checkout-header">
        <div className="container">
          <Link to="/cart" className="back-link"><FiChevronLeft /> Return to Cart</Link>
          <div className="logo">Safety<span>Me</span></div>
          <div className="secure-badge"><FiLock /> Secure Checkout</div>
        </div>
      </header>

      <div className="container checkout-container">
        <div className="checkout-main">
          {/* 1. SHIPPING ACCORDION */}
          <div className={`checkout-section ${activeAccordion === 'shipping' ? 'active' : ''}`}>
            <div className="section-header" onClick={() => setActiveAccordion('shipping')}>
              <div className="step-num">1</div>
              <h2>Shipping Information</h2>
              {activeAccordion !== 'shipping' && <FiCheckCircle className="completed-icon" />}
            </div>
            
            <div className="section-content">
              {savedAddresses.length > 0 && (
                <div className="saved-addresses-list">
                  <p className="label-text">Select from saved addresses:</p>
                  <div className="address-pills">
                    {savedAddresses.map(addr => (
                      <button 
                        key={addr._id} 
                        className={`address-pill ${formData.address === addr.street ? 'selected' : ''}`}
                        onClick={() => selectAddress(addr)}
                      >
                        <FiMapPin /> {addr.city} ({addr.fullName})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-grid">
                <div className={`form-group ${errors.fullName ? 'error' : ''} full`}>
                  <label>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label>Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 300 1234567" />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className={`form-group ${errors.address ? 'error' : ''} full`}>
                  <label>Street Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="House #, Street, Area" />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
                <div className={`form-group ${errors.city ? 'error' : ''}`}>
                  <label>City</label>
                  <input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Karachi" />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className={`form-group ${errors.state ? 'error' : ''}`}>
                  <label>State</label>
                  <input name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Sindh" />
                  {errors.state && <span className="error-text">{errors.state}</span>}
                </div>
                <div className={`form-group ${errors.zipCode ? 'error' : ''}`}>
                  <label>Zip Code</label>
                  <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="e.g. 75500" />
                  {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                </div>
              </div>
              {/* Continue button removed */}
            </div>
          </div>

          {/* 2. PAYMENT SECTION (Always open/visible) */}
          <div className="checkout-section active">
            <div className="section-header">
              <div className="step-num">2</div>
              <h2>Payment Method</h2>
            </div>

            <div className="section-content">
              <div className="payment-options">
                <PaymentMethodBlock 
                  id="cod"
                  icon={FiTruck}
                  title="Cash on Delivery"
                  desc="Pay when your order reaches your doorstep"
                  isSelected={paymentMethod === 'cod'}
                  onSelect={setPaymentMethod}
                />
                
                <PaymentMethodBlock 
                  id="easypaisa"
                  icon={FiSmartphone}
                  title="EasyPaisa"
                  desc="Transfer to our EasyPaisa account"
                  accounts={[{ label: 'EasyPaisa', value: '0300-1234567 (Horizon)' }]}
                  isSelected={paymentMethod === 'easypaisa'}
                  onSelect={setPaymentMethod}
                  paymentProof={paymentProof}
                  onProofChange={handleProofChange}
                  screenshotFile={screenshotFile}
                  onFileChange={handleFileChange}
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  onRemoveFile={() => setScreenshotFile(null)}
                />

                <PaymentMethodBlock 
                  id="jazzcash"
                  icon={FiSmartphone}
                  title="JazzCash"
                  desc="Transfer to our JazzCash account"
                  accounts={[{ label: 'JazzCash', value: '0300-7654321 (SafetyMe)' }]}
                  isSelected={paymentMethod === 'jazzcash'}
                  onSelect={setPaymentMethod}
                  paymentProof={paymentProof}
                  onProofChange={handleProofChange}
                  screenshotFile={screenshotFile}
                  onFileChange={handleFileChange}
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  onRemoveFile={() => setScreenshotFile(null)}
                />

                <PaymentMethodBlock 
                  id="bank_transfer"
                  icon={FiCreditCard}
                  title="Bank Transfer"
                  desc="Transfer to our Bank account"
                  accounts={[
                    { label: 'Bank', value: 'Bank Al-Habib' },
                    { label: 'Account #', value: '1234-5678-9012 (HIS)' }
                  ]}
                  isSelected={paymentMethod === 'bank_transfer'}
                  onSelect={setPaymentMethod}
                  paymentProof={paymentProof}
                  onProofChange={handleProofChange}
                  screenshotFile={screenshotFile}
                  onFileChange={handleFileChange}
                  fileInputRef={fileInputRef}
                  uploading={uploading}
                  onRemoveFile={() => setScreenshotFile(null)}
                />
              </div>

              <div className="checkout-notes">
                <label>Additional Notes</label>
                <textarea name="orderNotes" value={formData.orderNotes} onChange={handleChange} placeholder="Instructions for the courier..." rows="2" />
              </div>

              <div className="place-order-wrapper">
                <button className="btn-place-order" disabled={submitting || uploading} onClick={handlePlaceOrder}>
                  {submitting ? 'Processing Order...' : uploading ? 'Uploading Screenshot...' : <>Place Order <FiCheckCircle /></>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <div className="item-img">
                    <img src={item.image} alt={item.name} />
                    <span className="item-qty">{item.quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    {item.color && <p>{item.color}</p>}
                  </div>
                  <div className="item-price">Rs.{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `Rs.${shipping.toLocaleString()}`}</span>
              </div>
              <div className="row total">
                <span>Grand Total</span>
                <span>Rs.{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="trust-badges">
              <div className="badge"><FiShield /> 100% Genuine Products</div>
              <div className="badge"><FiTruck /> Safe & Secure Delivery</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}