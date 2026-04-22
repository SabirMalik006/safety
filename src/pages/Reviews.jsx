import { FiStar } from 'react-icons/fi';
import { reviews } from '../data/products';
import './Reviews.css';

export default function Reviews() {
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
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-stars">
              {[...Array(r.rating)].map((_, j) => <FiStar key={j} className="star filled" />)}
            </div>
            <p className="review-text">"{r.comment}"</p>
            <div className="reviewer">
              <div className="reviewer-avatar">{r.name[0]}</div>
              <div>
                <strong>{r.name}</strong>
                <span>{r.location} · {r.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
