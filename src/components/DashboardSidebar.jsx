import { NavLink } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiMapPin, FiLogOut, FiLayout } from 'react-icons/fi';
import { logout } from '../services/authService';
import './DashboardSidebar.css';

const DashboardSidebar = ({ user }) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="user-profile-brief">
        <div className="user-avatar-circle">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
      </div>

      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FiLayout /> <span>Overview</span>
        </NavLink>
        <NavLink to="/dashboard/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FiShoppingBag /> <span>My Orders</span>
        </NavLink>
        <NavLink to="/dashboard/addresses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FiMapPin /> <span>Addresses</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FiUser /> <span>Profile Settings</span>
        </NavLink>
        
        <button className="nav-item logout-btn" onClick={logout}>
          <FiLogOut /> <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
