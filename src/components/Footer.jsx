import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">SafetyPro</Link>
          <p>Pakistan's trusted destination for premium safety equipment and industrial protection gear. Quality you can trust, safety you can rely on.</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Safety Products</h4>
          <ul>
            <li><Link to="/collections/all-bags">Head Protection</Link></li>
            <li><Link to="/collections/best-selling">Eye Protection</Link></li>
            <li><Link to="/collections/canvas-bags">Hand Protection</Link></li>
            <li><Link to="/collections/men-wallets">Body Protection</Link></li>
            <li><Link to="/collections/tote-bag">Foot Protection</Link></li>
            <li><Link to="/collections/shoulder-bag">Respiratory Protection</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li><Link to="/pages/about">About Us</Link></li>
            <li><Link to="/pages/reviews">Customer Reviews</Link></li>
            <li><Link to="/pages/wholesale">Wholesale</Link></li>
            <li><Link to="/pages/affiliate">Affiliate Program</Link></li>
            <li><Link to="/pages/faq">FAQs</Link></li>
            <li><Link to="/pages/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Policies</h4>
          <ul>
            <li><Link to="/policies/shipping">Shipping Policy</Link></li>
            <li><Link to="/policies/return">Return Policy</Link></li>
            <li><Link to="/policies/privacy">Privacy Policy</Link></li>
            <li><Link to="/policies/terms">Terms of Service</Link></li>
          </ul>
          <div className="newsletter">
            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Newsletter</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email..." />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} SafetyPro. All rights reserved. Made with ♥ in Pakistan</p>
        <div className="payment-badges">
          <span>COD</span>
          <span>JazzCash</span>
          <span>EasyPaisa</span>
          <span>Bank Transfer</span>
        </div>
      </div>
    </footer>
  );
}