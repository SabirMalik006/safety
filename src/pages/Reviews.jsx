import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { reviews as staticReviews } from '../data/products';
import { getFeaturedReviews } from '../services/reviewService';
import './Reviews.css';

export default function Reviews() {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getFeaturedReviews();
        setFeaturedReviews(res.data || []);
      } catch (err) {
        console.error('Failed to fetch featured reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Use featured reviews from DB if available, otherwise fallback to static reviews
  const displayReviews = featuredReviews.length > 0 ? featuredReviews : staticReviews;

  return (
    <div className="reviews-page page-content">
      <div className="reviews-hero">
        <div className="container">
          <p className="section-tag">Testimonials</p>
          <h1>Customer Reviews</h1>
          <p>Real feedback from 10,000+ satisfied professionals across Pakistan.</p>
          <div className="rating-summary">
            <span className="big-num">4.8</span>
            <div>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => <FiStar key={i} className="star filled" />)}
              </div>
              <span>Based on 10,000+ reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container reviews-grid-page">
        {loading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : displayReviews.length === 0 ? (
          <div className="empty-state">No featured reviews yet.</div>
        ) : (
          displayReviews.map((r, i) => (
            <div key={r._id || i} className="review-card">
              <div className="review-stars">
                {[...Array(r.rating)].map((_, j) => <FiStar key={j} className="star filled" />)}
              </div>
              <p className="review-text">"{r.comment}"</p>
              <div className="reviewer">
                <div className="reviewer-avatar">{(r.user?.name || r.guestName || r.name || '?')[0]}</div>
                <div>
                  <strong>{r.user?.name || r.guestName || r.name}</strong>
                  <span>{r.location || 'Verified Buyer'} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
