import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiX, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  // ✅ Fixed: Use correct variable names from CartContext
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const total = getCartTotal();
  const delivery = total >= 10000 ? 0 : 500;

  // ✅ Fixed: Use cartItems instead of cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty page-content">
        <FiShoppingCart size={64} strokeWidth={1} />
        <h2>Your cart is empty</h2>
        <p>Add some essential safety equipment to your cart!</p>
        <Link to="/collections/all-products" className="btn-shop">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-content">
      <div className="container cart-header">
        <h1>Shopping Cart</h1>
        <span>{getCartCount()} item{cartItems.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="container cart-body">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <Link to={`/products/${item.slug}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/products/${item.slug}`} className="cart-item-name">
                  {item.name}
                </Link>
                {item.color && <span className="cart-item-color">Color: {item.color}</span>}
                <div className="cart-item-price">Rs.{item.price.toLocaleString()}</div>

                <div className="cart-item-actions">
                  <div className="qty-ctrl">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>
                  <span className="cart-item-subtotal">
                    Rs.{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(index)}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs.{total.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={delivery === 0 ? 'free' : ''}>
                {delivery === 0 ? 'FREE' : `Rs.${delivery}`}
              </span>
            </div>
            {delivery > 0 && (
              <p className="free-shipping-notice">
                Add Rs.{(10000 - total).toLocaleString()} more for free delivery!
              </p>
            )}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>Rs.{(total + delivery).toLocaleString()}</span>
          </div>

          <div className="promo-input">
            <input type="text" placeholder="Promo code..." />
            <button>Apply</button>
          </div>

          <Link to="/checkout" className="btn-checkout">
            Proceed to Checkout <FiArrowRight />
          </Link>

          <Link to="/collections/all-products" className="continue-shopping">
            ← Continue Shopping
          </Link>

          <div className="payment-methods">
            <span>We accept:</span>
            <div className="pay-badges">
              <span>COD</span>
              <span>JazzCash</span>
              <span>EasyPaisa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}