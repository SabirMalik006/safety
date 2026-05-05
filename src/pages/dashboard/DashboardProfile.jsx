import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiCheck } from 'react-icons/fi';
import { updateProfile } from '../../services/authService';
import toast from 'react-hot-toast';

const DashboardProfile = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      onUpdate();
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content-area">
      <div className="section-header-top">
        <div>
          <h1>Profile Settings</h1>
          <p>Update your personal information and contact details</p>
        </div>
      </div>

      <div className="profile-settings-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} disabled className="disabled-input" />
              <small>Email cannot be changed</small>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="e.g. +92 300 1234567"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : <>Save Changes <FiCheck /></>}
            </button>
          </div>
        </form>
      </div>

      <div className="security-section">
        <div className="section-header">
          <h2>Security</h2>
          <p>Manage your password and account security</p>
        </div>
        <div className="security-card">
          <div className="security-info">
            <FiLock />
            <div>
              <h3>Account Password</h3>
              <p>Change your password regularly to keep your account secure</p>
            </div>
          </div>
          <button className="btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfile;
