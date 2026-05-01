import { useState, useEffect } from 'react';
import { FiMail, FiCheckCircle, FiTrash2, FiEye, FiMessageSquare, FiX, FiAlertTriangle, FiPhone, FiUser, FiCalendar } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminContacts.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact/all');
      setContacts(res.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      await api.put(`/contact/${contactId}/read`);
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const openDeleteModal = (contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      await api.delete(`/contact/${contactToDelete._id}`);
      toast.success('Message deleted');
      fetchContacts();
      setDeleteModalOpen(false);
      setContactToDelete(null);
      if (selectedContact?._id === contactToDelete._id) {
        setSelectedContact(null);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredContacts = filter === 'all' ? contacts : contacts.filter(c =>
    filter === 'read' ? c.isRead : !c.isRead
  );

  const unreadCount = contacts.filter(c => !c.isRead).length;

  if (loading) return <div className="admin-loading">Loading messages...</div>;

  return (
    <div className="admin-contacts">
      <div className="page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>View and manage customer inquiries — {unreadCount} unread</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          All <span className="tab-count">{contacts.length}</span>
        </button>
        <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>
          Unread <span className="tab-count">{unreadCount}</span>
        </button>
        <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>
          Read <span className="tab-count">{contacts.length - unreadCount}</span>
        </button>
      </div>

      <div className="contacts-list">
        {filteredContacts.length === 0 ? (
          <div className="empty-contacts">
            <FiMail size={40} />
            <p>No messages found</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact._id} className={`contact-item ${!contact.isRead ? 'unread' : ''}`}>
              <div className="contact-header">
                <div className="contact-sender">
                  <div className="sender-avatar">{contact.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  <div>
                    <strong>{contact.name}</strong>
                    <span>{contact.email}</span>
                  </div>
                </div>
                <div className="contact-meta">
                  {!contact.isRead && <span className="unread-dot"></span>}
                  <div className="contact-date">
                    <FiCalendar size={11} />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="contact-subject">
                <FiMail /> {contact.subject}
              </div>
              <div className="contact-message-preview">
                {contact.message?.substring(0, 120)}{contact.message?.length > 120 ? '...' : ''}
              </div>
              <div className="contact-actions">
                {!contact.isRead && (
                  <button onClick={() => markAsRead(contact._id)} className="read-btn">
                    <FiCheckCircle /> Mark as Read
                  </button>
                )}
                <button onClick={() => { setSelectedContact(contact); setReplyText(''); }} className="view-btn">
                  <FiEye /> View Details
                </button>
                <button onClick={() => openDeleteModal(contact)} className="delete-btn">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content large contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="contact-modal-title">
                <div className="sender-avatar large">{selectedContact.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <h2>{selectedContact.name}</h2>
                  <span className={`contact-status-badge ${selectedContact.isRead ? 'read' : 'unread'}`}>
                    {selectedContact.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
              <button className="close-modal" onClick={() => setSelectedContact(null)}><FiX /></button>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-grid">
                <div className="detail-info-card">
                  <div className="detail-info-row">
                    <FiUser className="detail-icon" />
                    <div>
                      <label>Full Name</label>
                      <span>{selectedContact.name}</span>
                    </div>
                  </div>
                  <div className="detail-info-row">
                    <FiMail className="detail-icon" />
                    <div>
                      <label>Email Address</label>
                      <span><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></span>
                    </div>
                  </div>
                  {selectedContact.phone && (
                    <div className="detail-info-row">
                      <FiPhone className="detail-icon" />
                      <div>
                        <label>Phone Number</label>
                        <span>{selectedContact.phone}</span>
                      </div>
                    </div>
                  )}
                  <div className="detail-info-row">
                    <FiCalendar className="detail-icon" />
                    <div>
                      <label>Received</label>
                      <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-message-card">
                  <div className="detail-subject">
                    <label>Subject</label>
                    <h4>{selectedContact.subject}</h4>
                  </div>
                  <div className="detail-message">
                    <label>Message</label>
                    <p>{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="reply-section">
                <label>Quick Reply</label>
                <textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="4"
                />
                <div className="reply-actions">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}&body=${encodeURIComponent(replyText)}`}
                    className="reply-btn"
                  >
                    <FiMessageSquare /> Open in Email Client
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && contactToDelete && (
        <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Message</h3>
            <p>Are you sure you want to delete the message from <strong>{contactToDelete.name}</strong>? This action cannot be undone.</p>
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