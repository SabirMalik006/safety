import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { resetPassword } from '../services/authService';
import toast from 'react-hot-toast';
import './Login.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  useEffect(() => {
    if (!email || !otp) {
      toast.error('Session expired. Please try again.');
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        toast.success('Password reset successfully! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-side-panel">
          <div className="side-overlay"></div>
          <img src="/safety_login_side_1777667349463.png" alt="Safety" className="side-bg-image" />
          <div className="side-content">
            <Link to="/" className="auth-logo">The Horizon <span>Hub</span></Link>
            <div className="side-text">
              <h2>Secure Your Account</h2>
              <p>Almost there! Create a strong new password to protect your The Horizon Hub account.</p>
            </div>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>New Password</h1>
              <p>Please enter your new secure password.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>New Password</label>
                <div className="input-box">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-box">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Updating...' : <>Reset Password <FiArrowRight /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
