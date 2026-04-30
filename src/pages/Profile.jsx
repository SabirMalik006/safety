import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/authService';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' }
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || { street: '', city: '', state: '', zipCode: '', country: 'Pakistan' }
      });
    }
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={() => setEditing(!editing)} className="edit-toggle-btn">
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          {!editing ? (
            <div className="profile-view">
              <div className="profile-info-card">
                <h3>Personal Information</h3>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span>{user.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="profile-info-card">
                <h3>Address Information</h3>
                <div className="info-row">
                  <span className="info-label">Street:</span>
                  <span>{user.address?.street || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">City:</span>
                  <span>{user.address?.city || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">State:</span>
                  <span>{user.address?.state || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">ZIP Code:</span>
                  <span>{user.address?.zipCode || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Country:</span>
                  <span>{user.address?.country || 'Pakistan'}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Address Information</h3>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}