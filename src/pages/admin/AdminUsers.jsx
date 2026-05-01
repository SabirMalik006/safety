import { useState, useEffect } from 'react';
import { FiTrash2, FiUserCheck, FiUserX, FiShield, FiUser, FiX, FiAlertTriangle } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [roleModal, setRoleModal] = useState({ open: false, user: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setSubmitting(true);
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
      setRoleModal({ open: false, user: null });
    } catch (error) {
      toast.error('Failed to update role');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (deleteModal.open || roleModal.open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [deleteModal.open, roleModal.open]);

  const toggleRole = () => {
    // This is now handled by handleRoleUpdate with dropdown
  };

  const deleteUser = async () => {
    const user = deleteModal.user;
    setSubmitting(true);
    try {
      await api.delete(`/users/${user._id}`);
      toast.success('User deleted');
      fetchUsers();
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Loading users...</div>;

  return (
    <div className="admin-users">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage registered customers and administrators</p>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon"><FiUser /></div>
          <div>
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiShield /></div>
          <div>
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>Admins</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FiUserCheck /></div>
          <div>
            <h3>{users.filter(u => u.isActive !== false).length}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td className="user-cell">
                  <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
                  <strong>{user.name}</strong>
                 </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                    {user.role === 'admin' ? <FiShield /> : <FiUser />}
                    {user.role}
                  </span>
                 </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => setRoleModal({ open: true, user })} className="action-btn role" title="Change Role">
                    {user.role === 'admin' ? <FiUserX /> : <FiShield />}
                  </button>
                  <button onClick={() => setDeleteModal({ open: true, user })} className="action-btn delete" title="Delete User">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {roleModal.open && (
        <div className="modal-overlay" onClick={() => setRoleModal({ open: false, user: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change User Role</h2>
              <button className="close-modal" onClick={() => setRoleModal({ open: false, user: null })}><FiX /></button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ marginBottom: '16px' }}>Change role for <strong>{roleModal.user?.name}</strong></p>
              <div className="form-group">
                <label>Select Role</label>
                <select 
                  className="admin-status-select"
                  value={roleModal.user?.role}
                  onChange={(e) => setRoleModal({ ...roleModal, user: { ...roleModal.user, role: e.target.value } })}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions" style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                <button className="btn-secondary" onClick={() => setRoleModal({ open: false, user: null })}>Cancel</button>
                <button className="btn-primary" onClick={() => handleRoleUpdate(roleModal.user._id, roleModal.user.role)} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deleteModal.open && (
        <div className="confirm-modal-overlay" onClick={() => setDeleteModal({ open: false, user: null })}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-icon delete-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete <strong>{deleteModal.user?.name}</strong>? 
              This action cannot be undone and all their data will be removed.
            </p>
            <div className="confirm-modal-actions">
              <button className="confirm-cancel-btn" onClick={() => setDeleteModal({ open: false, user: null })}>Cancel</button>
              <button className="confirm-danger-btn" onClick={deleteUser} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Yes, Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}