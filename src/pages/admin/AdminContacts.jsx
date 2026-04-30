import { useState, useEffect } from 'react';
import { FiMail, FiCheckCircle, FiTrash2, FiEye, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminContacts.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const deleteContact = async (contactId) => {
    if (window.confirm('Delete this message?')) {
      try {
        await api.delete(`/contact/${contactId}`);
        toast.success('Message deleted');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredContacts = filter === 'all' ? contacts : contacts.filter(c => 
    filter === 'read' ? c.isRead : !c.isRead
  );

  if (loading) return <div className="admin-loading">Loading messages...</div>;

  return (
    <div className="admin-contacts">
      <div className="page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>View and manage customer inquiries</p>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
        <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>Read</button>
      </div>

      <div className="contacts-list">
        {filteredContacts.map(contact => (
          <div key={contact._id} className={`contact-item ${!contact.isRead ? 'unread' : ''}`}>
            <div className="contact-header">
              <div className="contact-sender">
                <div className="sender-avatar">{contact.name?.charAt(0) || 'U'}</div>
                <div>
                  <strong>{contact.name}</strong>
                  <span>{contact.email}</span>
                </div>
              </div>
              <div className="contact-date">
                {new Date(contact.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="contact-subject">
              <FiMail /> {contact.subject}
            </div>
            <div className="contact-message-preview">
              {contact.message?.substring(0, 100)}...
            </div>
            <div className="contact-actions">
              {!contact.isRead && (
                <button onClick={() => markAsRead(contact._id)} className="read-btn">
                  <FiCheckCircle /> Mark as Read
                </button>
              )}
              <button onClick={() => setSelectedContact(contact)} className="view-btn">
                <FiEye /> View Details
              </button>
              <button onClick={() => deleteContact(contact._id)} className="delete-btn">
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message from {selectedContact.name}</h2>
              <button className="close-modal" onClick={() => setSelectedContact(null)}><FiXCircle /></button>
            </div>
            <div className="contact-detail">
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedContact.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedContact.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{selectedContact.phone || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <label>Subject:</label>
                <span>{selectedContact.subject}</span>
              </div>
              <div className="detail-row">
                <label>Message:</label>
                <p>{selectedContact.message}</p>
              </div>
              <div className="detail-row">
                <label>Received:</label>
                <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${selectedContact.isRead ? 'read' : 'unread'}`}>
                  {selectedContact.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
              <div className="reply-section">
                <label>Quick Reply:</label>
                <textarea placeholder="Type your reply here..."></textarea>
                <button className="reply-btn">
                  <FiMessageSquare /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}