import { useState, useEffect } from 'react';
import { FiTrash2, FiUserCheck, FiUserX, FiShield, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change ${user.name}'s role to ${newRole}?`)) {
      try {
        await api.put(`/users/${user._id}`, { role: newRole });
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      } catch (error) {
        toast.error('Failed to update role');
      }
    }
  };

  const deleteUser = async (user) => {
    if (window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) {
      try {
        await api.delete(`/users/${user._id}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
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
                  <button onClick={() => toggleRole(user)} className="action-btn role" title="Change Role">
                    {user.role === 'admin' ? <FiUserX /> : <FiShield />}
                  </button>
                  <button onClick={() => deleteUser(user)} className="action-btn delete" title="Delete User">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}