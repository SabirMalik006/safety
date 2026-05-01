import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { forgotPassword } from '../services/authService';
import toast from 'react-hot-toast';
import './Login.css'; // Reuse auth styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success('OTP sent to your email!');
        navigate('/verify-otp', { state: { email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
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
            <Link to="/" className="auth-logo">Safety<span>Me</span></Link>
            <div className="side-text">
              <h2>Reset Your Password</h2>
              <p>Don't worry! It happens to the best of us. We'll help you get back into your account safely.</p>
            </div>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-card">
            <Link to="/login" className="btn-back-link">
              <FiArrowLeft /> Back to Sign In
            </Link>
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>Enter your registered email and we'll send you a 6-digit OTP to reset your password.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-box">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Sending OTP...' : <>Send OTP <FiArrowRight /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
