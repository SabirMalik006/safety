import { useState, useEffect } from 'react';
import { FiStar, FiCheckCircle, FiXCircle, FiTrash2, FiEye, FiX, FiAlertTriangle, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminReviews.css';

const StarRating = ({ rating, size = 14 }) => (
  <div className="star-rating">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        size={size}
        className={i < rating ? 'star filled' : 'star'}
      />
    ))}
  </div>
);

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

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
      if (selectedReview?._id === reviewId) {
        setSelectedReview(prev => ({ ...prev, isApproved: true }));
      }
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const openDeleteModal = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await api.delete(`/reviews/${reviewToDelete._id}`);
      toast.success('Review deleted!');
      fetchReviews();
      setDeleteModalOpen(false);
      setReviewToDelete(null);
      if (selectedReview?._id === reviewToDelete._id) {
        setSelectedReview(null);
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r =>
    filter === 'approved' ? r.isApproved : !r.isApproved
  );

  const pendingCount = reviews.filter(r => !r.isApproved).length;
  const approvedCount = reviews.filter(r => r.isApproved).length;

  if (loading) return <div className="admin-loading">Loading reviews...</div>;

  return (
    <div className="admin-reviews">
      <div className="page-header">
        <div>
          <h1>Customer Reviews</h1>
          <p>Manage and approve product reviews — {pendingCount} pending</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All <span className="tab-count">{reviews.length}</span>
        </button>
        <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>
          Approved <span className="tab-count">{approvedCount}</span>
        </button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
          Pending <span className="tab-count">{pendingCount}</span>
        </button>
      </div>

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="reviews-empty">
            <FiMessageSquare size={40} />
            <p>No reviews found</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review._id} className={`review-item ${!review.isApproved ? 'pending' : ''}`}>
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">{review.user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <div>
                    <strong>{review.user?.name || 'Anonymous'}</strong>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="review-header-right">
                  <StarRating rating={review.rating} />
                  <span className={`review-status-badge ${review.isApproved ? 'approved' : 'pending'}`}>
                    {review.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="review-body">
                <h4>{review.title}</h4>
                <p>{review.comment?.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}</p>
                <div className="review-product">
                  <FiStar size={12} />
                  Product: <strong>{review.product?.name || 'Unknown'}</strong>
                </div>
              </div>
              <div className="review-actions">
                {!review.isApproved && (
                  <button onClick={() => approveReview(review._id)} className="approve-btn">
                    <FiCheckCircle /> Approve
                  </button>
                )}
                <button onClick={() => setSelectedReview(review)} className="view-btn">
                  <FiEye /> View Full
                </button>
                <button onClick={() => openDeleteModal(review)} className="delete-btn">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="modal-overlay" onClick={() => setSelectedReview(null)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Details</h2>
              <button className="close-modal" onClick={() => setSelectedReview(null)}><FiX /></button>
            </div>
            <div className="review-detail">
              <div className="review-detail-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar large">
                    {selectedReview.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <strong>{selectedReview.user?.name || 'Anonymous'}</strong>
                    <span>{selectedReview.user?.email}</span>
                  </div>
                </div>
                <StarRating rating={selectedReview.rating} size={18} />
              </div>

              <div className="review-detail-body">
                <div className="detail-field">
                  <label>Product</label>
                  <span>{selectedReview.product?.name}</span>
                </div>
                <div className="detail-field">
                  <label>Review Title</label>
                  <span className="review-title-text">{selectedReview.title}</span>
                </div>
                <div className="detail-field">
                  <label>Comment</label>
                  <p className="review-comment-text">{selectedReview.comment}</p>
                </div>
                <div className="detail-field-row">
                  <div className="detail-field">
                    <label>Date</label>
                    <span>{new Date(selectedReview.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-field">
                    <label>Status</label>
                    <span className={`review-status-badge ${selectedReview.isApproved ? 'approved' : 'pending'}`}>
                      {selectedReview.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="review-detail-actions">
                {!selectedReview.isApproved && (
                  <button onClick={() => approveReview(selectedReview._id)} className="approve-btn large">
                    <FiCheckCircle /> Approve Review
                  </button>
                )}
                <button onClick={() => { openDeleteModal(selectedReview); setSelectedReview(null); }} className="delete-btn large">
                  <FiTrash2 /> Delete Review
                </button>
                <button onClick={() => setSelectedReview(null)} className="btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && reviewToDelete && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Review</h3>
            <p>Are you sure you want to delete this review by <strong>{reviewToDelete.user?.name}</strong>? This cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="confirm-cancel-btn" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="confirm-danger-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}