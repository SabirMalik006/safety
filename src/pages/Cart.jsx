import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingCart, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shippingThreshold = 10000;
  const shipping = subtotal >= shippingThreshold ? 0 : 500;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    navigate('/checkout');
    window.scrollTo(0, 0);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty-page page-content">
        <div className="container">
          <div className="empty-cart-card">
            <div className="empty-icon-wrap">
              <FiShoppingCart size={64} />
            </div>
            <h1>Your cart is empty</h1>
            <p>Looks like you haven't added any safety gear to your cart yet.</p>
            <Link to="/collections/all-products" className="btn-primary">
              Continue Shopping <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-content">
      <div className="container">
        <header className="cart-header">
          <h1>Shopping Cart</h1>
          <p>You have {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items in your cart</p>
        </header>

        <div className="cart-grid">
          <div className="cart-items-section">
            <div className="cart-labels">
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.color}-${item.size}`} className="cart-item">
                  <div className="item-main">
                    <div className="item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-meta">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <div className="item-price-mobile">Rs.{item.price.toLocaleString()}</div>
                      <button className="btn-remove-mobile" onClick={() => removeFromCart(item.productId, item.color, item.size)}>
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="item-qty">
                    <div className="qty-stepper">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.color, item.size)} disabled={item.quantity <= 1}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.color, item.size)}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <strong>Rs.{(item.price * item.quantity).toLocaleString()}</strong>
                    <button className="btn-remove-desktop" title="Remove Item" onClick={() => removeFromCart(item.productId, item.color, item.size)}>
                      <FiXCircle />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer-actions">
              <Link to="/collections/all-products" className="btn-back-shop">
                <FiArrowLeft /> Continue Shopping
              </Link>
            </div>
          </div>

          <aside className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="free">FREE</span> : `Rs.${shipping.toLocaleString()}`}</span>
                </div>
                {shipping > 0 && (
                  <div className="shipping-info">
                    <FiTruck /> Spend <strong>Rs.{(shippingThreshold - subtotal).toLocaleString()}</strong> more for FREE shipping!
                  </div>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>

              <button className="btn-checkout" onClick={handleCheckout}>
                Secure Checkout <FiArrowRight />
              </button>

              <div className="trust-badges">
                <div className="badge"><FiShield /> Quality Certified</div>
                <div className="badge"><FiTruck /> Fast Delivery</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for better organization
function FiXCircle() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

function FiArrowLeft() {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
}