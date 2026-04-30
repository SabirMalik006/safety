import { useState, useEffect } from 'react';
import { FiStar, FiCheckCircle, FiXCircle, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminReviews.css';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/all');
      setReviews(res.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}/approve`);
      toast.success('Review approved!');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('Delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        toast.success('Review deleted!');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => 
    filter === 'approved' ? r.isApproved : !r.isApproved
  );

  if (loading) return <div className="admin-loading">Loading reviews...</div>;

  return (
    <div className="admin-reviews">
      <div className="page-header">
        <div>
          <h1>Customer Reviews</h1>
          <p>Manage and approve product reviews</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>Approved</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
      </div>

      <div className="reviews-list">
        {filteredReviews.map(review => (
          <div key={review._id} className={`review-item ${!review.isApproved ? 'pending' : ''}`}>
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">{review.user?.name?.charAt(0) || 'U'}</div>
                <div>
                  <strong>{review.user?.name || 'Anonymous'}</strong>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                ))}
              </div>
            </div>
            <div className="review-body">
              <h4>{review.title}</h4>
              <p>{review.comment}</p>
              <div className="review-product">
                Product: <strong>{review.product?.name}</strong>
              </div>
            </div>
            <div className="review-actions">
              {!review.isApproved && (
                <button onClick={() => approveReview(review._id)} className="approve-btn">
                  <FiCheckCircle /> Approve
                </button>
              )}
              <button onClick={() => setSelectedReview(review)} className="view-btn">
                <FiEye /> View
              </button>
              <button onClick={() => deleteReview(review._id)} className="delete-btn">
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Details</h2>
              <button className="close-modal" onClick={() => setSelectedReview(null)}><FiXCircle /></button>
            </div>
            <div className="review-detail">
              <div className="detail-row">
                <label>Product:</label>
                <span>{selectedReview.product?.name}</span>
              </div>
              <div className="detail-row">
                <label>Reviewer:</label>
                <span>{selectedReview.user?.name} ({selectedReview.user?.email})</span>
              </div>
              <div className="detail-row">
                <label>Rating:</label>
                <span className="detail-rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < selectedReview.rating ? 'filled' : ''} />
                  ))}
                </span>
              </div>
              <div className="detail-row">
                <label>Title:</label>
                <span>{selectedReview.title}</span>
              </div>
              <div className="detail-row">
                <label>Comment:</label>
                <p>{selectedReview.comment}</p>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${selectedReview.isApproved ? 'approved' : 'pending'}`}>
                  {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}