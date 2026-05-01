import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // ✅ Check both response structures
      // Structure 1: { success: true, data: { token, user } }
      // Structure 2: { success: true, token, user }
      
      let token = null;
      let user = null;
      
      if (response.data.data) {
        // Structure 1
        token = response.data.data.token;
        user = response.data.data;
      } else {
        // Structure 2
        token = response.data.token;
        user = response.data.user || response.data;
      }
      
      if (token) {
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Token saved:', localStorage.getItem('token'));
        console.log('User saved:', localStorage.getItem('user'));
        
        toast.success('Login successful! Welcome back!');
        
        // Check if user is admin
        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">
              <span>HS</span>
            </div>
            <h1>Horizon Supplies</h1>
            <p>Your trusted partner for industrial and safety equipment</p>
          </div>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <div>
                <h4>Secure Platform</h4>
                <p>Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🚀</div>
              <div>
                <h4>Fast Delivery</h4>
                <p>Express shipping across Pakistan</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">💎</div>
              <div>
                <h4>Premium Quality</h4>
                <p>Top-rated industrial products</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
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
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="register-link">
              <p>Don't have an account? <Link to="/register">Create Account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;