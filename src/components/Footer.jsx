import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiStar, FiX, FiMessageSquare } from 'react-icons/fi';
import { getCurrentUser } from '../services/authService';
import { getCategories } from '../services/productService';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Footer.css';

export default function Footer() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user && showFeedbackModal) {
      setGuestName(user.name);
    }
  }, [user, showFeedbackModal]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (err) {
        console.error('Error fetching footer cats:', err);
      }
    };
    fetchCats();
  }, []);

  const handleLinkClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error('Please enter your feedback');
    if (!user && !guestName) return toast.error('Please enter your name');

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        rating,
        comment,
        guestName: user ? undefined : guestName,
      });
      toast.success('Thank you for your feedback!');
      setShowFeedbackModal(false);
      setComment('');
      setRating(5);
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" onClick={handleLinkClick}>The Horizon <span>Hub</span></Link>
          <p>One Hub. Unlimited Solutions. Your trusted platform for industrial, technical, and everyday procurement needs.</p>
          
          <button className="footer-feedback-btn" onClick={() => setShowFeedbackModal(true)}>
            <FiMessageSquare /> Leave a Review
          </button>
        </div>

        <div className="footer-col">
          <h4>Categories We Serve</h4>
          <ul>
            {categories.length > 0 ? (
              categories.slice(0, 6).map(cat => (
                <li key={cat._id}>
                  <Link to={`/collections/${cat.slug}`} onClick={handleLinkClick}>{cat.name}</Link>
                </li>
              ))
            ) : (
              <>
                <li><Link to="/collections/head-protection" onClick={handleLinkClick}>Head Protection</Link></li>
                <li><Link to="/collections/eye-protection" onClick={handleLinkClick}>Eye Protection</Link></li>
                <li><Link to="/collections/hand-protection" onClick={handleLinkClick}>Hand Protection</Link></li>
                <li><Link to="/collections/body-protection" onClick={handleLinkClick}>Body Protection</Link></li>
                <li><Link to="/collections/foot-protection" onClick={handleLinkClick}>Foot Protection</Link></li>
                <li><Link to="/collections/respiratory-protection" onClick={handleLinkClick}>Respiratory Protection</Link></li>
              </>
            )}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/about" onClick={handleLinkClick}>About Our Story</Link></li>
            <li><Link to="/pages/reviews" onClick={handleLinkClick}>Customer Testimonials</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Get in Touch</Link></li>
            <li><Link to="/policy" onClick={handleLinkClick}>Policy</Link></li>
          </ul>
          <div className="social-links">
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>© {new Date().getFullYear()} The Horizon Hub. All rights reserved.</p>
        {/* <div className="payment-badges">
          <span>JazzCash</span>
          <span>Cash on delivery</span>
        </div> */}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="feedback-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowFeedbackModal(false)}>
              <FiX />
            </button>
            
            <div className="modal-header-banner">
              <div className="modal-header">
                <FiStar className="header-icon" />
                <h3>Share Your Feedback</h3>
                <p>We'd love to hear your thoughts on our products and service.</p>
              </div>
            </div>

            <div className="modal-inner">
              <form onSubmit={handleSubmitFeedback}>
                <div className="star-rating">
                  <div className="star-btns-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <FiStar />
                      </button>
                    ))}
                  </div>
                  <span className="rating-text">
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                  </span>
                </div>

                {!user && (
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    placeholder="How was your experience with us?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
