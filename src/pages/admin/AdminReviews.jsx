import { useState, useEffect } from 'react';
import { FiCheck, FiTrash2, FiMessageSquare, FiStar, FiUser, FiClock, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/all'); 
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deleteModal.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [deleteModal.open]);

  const handleApprove = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}/approve`);
      toast.success('Review approved!');
      fetchReviews();
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/reviews/${deleteModal.id}`);
      toast.success('Review deleted');
      fetchReviews();
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      toast.error('Deletion failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  if (loading) return <div className="admin-loading">Loading reviews...</div>;

  return (
    <div className="admin-reviews">
      <div className="page-header">
        <div>
          <h1>Product Reviews</h1>
          <p>Moderate and manage customer feedback</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Reviews</button>
        <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending Approval</button>
        <button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>Approved</button>
      </div>

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="empty-state">
            <FiMessageSquare size={40} />
            <p>No reviews found</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review._id} className={`review-admin-card ${!review.isApproved ? 'pending' : ''}`}>
              <div className="review-card-header">
                <div className="reviewer-info">
                  <div className="rev-avatar"><FiUser /></div>
                  <div>
                    <h3>{review.user?.name || review.guestName || 'Anonymous'}</h3>
                    <div className="rev-stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < review.rating ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rev-date">
                  <FiClock /> {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="review-card-content">
                <p className="rev-product">Product: <strong>{review.product?.name || 'General Feedback'}</strong></p>
                <p className="rev-comment">"{review.comment}"</p>
              </div>

              <div className="review-card-actions">
                {!review.isApproved && (
                  <button className="btn-approve" onClick={() => handleApprove(review._id)}>
                    <FiCheck /> Approve
                  </button>
                )}
                <button className="btn-delete" onClick={() => setDeleteModal({ open: true, id: review._id })}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="confirm-modal-overlay" onClick={() => setDeleteModal({ open: false, id: null })}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Review</h3>
            <p>Are you sure you want to delete this review permanently? This action cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button className="confirm-cancel-btn" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
              <button className="confirm-danger-btn" onClick={handleDelete} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;