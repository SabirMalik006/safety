import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiX, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  const delivery = total >= 3999 ? 0 : 250;

  if (cart.length === 0) {
    return (
      <div className="cart-empty page-content">
        <FiShoppingCart size={64} strokeWidth={1} />
        <h2>Your cart is empty</h2>
        <p>Add some beautiful bags to your cart!</p>
        <Link to="/collections/all-bags" className="btn-shop">
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page page-content">
      <div className="container cart-header">
        <h1>Shopping Cart</h1>
        <span>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="container cart-body">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={`${item.id}-${item.selectedColor}`} className="cart-item">
              <Link to={`/products/${item.slug}`} className="cart-item-image">
                <img src={item.images[0]} alt={item.name} />
              </Link>

              <div className="cart-item-info">
                <Link to={`/products/${item.slug}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="cart-item-color">Color: {item.selectedColor}</span>
                <div className="cart-item-price">Rs.{item.price.toLocaleString()}</div>

                <div className="cart-item-actions">
                  <div className="qty-ctrl">
                    <button onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}>
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
                onClick={() => removeFromCart(item.id, item.selectedColor)}
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
                Add Rs.{(3999 - total).toLocaleString()} more for free delivery!
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

          {/* ✅ ONLY THIS LINE CHANGED - Added Link to checkout page */}
          <Link to="/checkout" className="btn-checkout">
            Proceed to Checkout <FiArrowRight />
          </Link>

          <Link to="/collections/all-bags" className="continue-shopping">
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