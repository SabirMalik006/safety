import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { login } from '../services/authService';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(formData.email, formData.password);
      
      if (response.token) {
        toast.success('Welcome back to SafetyMe!');
        
        // Redirect based on role
        if (response.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side: Brand Info */}
        <div className="auth-side-panel">
          <div className="side-overlay"></div>
          <img 
            src="/safety_login_side_1777667349463.png" 
            alt="Safety Gear" 
            className="side-bg-image" 
          />
          <div className="side-content">
            <Link to="/" className="auth-logo">
              Safety<span>Me</span>
            </Link>
            <div className="side-text">
              <h2>Empowering Industrial Safety</h2>
              <p>Join thousands of professionals who trust SafetyMe for premium industrial protection and equipment.</p>
            </div>
            
            <ul className="benefits-list">
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Enterprise-grade safety standards</span>
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Next-day delivery across Pakistan</span>
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Bulk wholesale pricing for businesses</span>
              </li>
            </ul>
            
            <div className="side-footer">
              <p>© 2026 SafetyMe Solutions. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Sign In</h1>
              <p>Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-box">
                  <FiMail className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" title="Reset your password" className="forgot-pass-link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="input-box">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="pass-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember for 30 days</span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? (
                  <span className="loader-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  <>
                    Sign In <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;