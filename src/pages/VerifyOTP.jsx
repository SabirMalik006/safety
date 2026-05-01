import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiHash, FiArrowRight, FiRotateCcw } from 'react-icons/fi';
import { verifyOTP, forgotPassword } from '../services/authService';
import toast from 'react-hot-toast';
import './Login.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please try again.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter 6-digit OTP');
    
    setLoading(true);
    try {
      const res = await verifyOTP(email, otp);
      if (res.success) {
        toast.success('OTP Verified!');
        navigate('/reset-password', { state: { email, otp } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await forgotPassword(email);
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
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
              <h2>Verify Your Identity</h2>
              <p>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
            </div>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Verify OTP</h1>
              <p>Please enter the 6-digit code received on your email.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Verification Code</label>
                <div className="input-box">
                  <FiHash className="input-icon" />
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="otp-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? 'Verifying...' : <>Verify Code <FiArrowRight /></>}
              </button>
            </form>
            <div className="auth-footer">
              <p>Didn't receive the code? 
                <button 
                  onClick={handleResend} 
                  disabled={resending} 
                  className="resend-btn"
                >
                  {resending ? 'Sending...' : 'Resend OTP'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
