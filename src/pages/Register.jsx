import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { register } from '../services/authService';
import toast from 'react-hot-toast';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.token) {
        toast.success('Account created successfully! Welcome to The Horizon Hub.');
        navigate('/');
      } else {
        toast.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
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
              The Horizon <span>Hub</span>
            </Link>
            <div className="side-text">
              <h2>Join the Professionals</h2>
              <p>Create an account to access bulk pricing, track shipments, and secure your industrial operations.</p>
            </div>
            
            <ul className="benefits-list">
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Access to wholesale pricing</span>
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Dedicated safety consultancy</span>
              </li>
              <li>
                <FiCheckCircle className="benefit-icon" />
                <span>Custom branding on safety gear</span>
              </li>
            </ul>
            
            <div className="side-footer">
              <p>© 2026 The Horizon Hub. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Sign up to start shopping for industrial gear.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-box">
                  <FiUser className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

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
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-box">
                  <FiLock className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    required
                    minLength="6"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-box">
                  <FiLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="auth-submit-btn">
                {loading ? (
                  <span className="loader-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  <>
                    Create Account <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;