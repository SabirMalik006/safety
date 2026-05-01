import { useState } from 'react';
import { FiPlus, FiMapPin, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../services/authService';
import toast from 'react-hot-toast';
import './DashboardAddresses.css';

const DashboardAddresses = ({ user, onUpdate }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Pakistan'
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country || 'Pakistan'
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Pakistan'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (editingAddress) {
        res = await updateAddress(editingAddress._id, formData);
        toast.success('Address updated!');
      } else {
        res = await addAddress(formData);
        toast.success('Address added!');
      }
      onUpdate(); // Refresh user data in parent
      setModalOpen(false);
    } catch (err) {
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id);
        toast.success('Address deleted');
        onUpdate();
      } catch (err) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success('Default address updated');
      onUpdate();
    } catch (err) {
      toast.error('Failed to set default address');
    }
  };

  return (
    <div className="dashboard-content-area">
      <div className="section-header-top">
        <div>
          <h1>Shipping Addresses</h1>
          <p>Manage your delivery addresses for faster checkout</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <FiPlus /> Add New Address
        </button>
      </div>

      <div className="addresses-grid">
        {user?.addresses?.length === 0 ? (
          <div className="empty-addresses">
            <FiMapPin />
            <p>No addresses saved yet.</p>
          </div>
        ) : (
          user?.addresses?.map(addr => (
            <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
              {addr.isDefault && <span className="default-badge">Default</span>}
              <div className="address-card-body">
                <h3>{addr.fullName}</h3>
                <p className="address-phone">{addr.phone}</p>
                <p className="address-text">
                  {addr.street}, {addr.city}<br />
                  {addr.state}, {addr.zipCode}<br />
                  {addr.country}
                </p>
              </div>
              <div className="address-card-footer">
                <button onClick={() => handleOpenModal(addr)} className="addr-action-btn" title="Edit">
                  <FiEdit2 /> Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className="addr-action-btn delete" title="Delete">
                  <FiTrash2 /> Delete
                </button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} className="addr-action-btn set-default">
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button className="close-btn" onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input 
                  type="text" 
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  required 
                />
              </div>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>State / Province</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input 
                    type="text" 
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAddresses;
