import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      toast.error('Passwords do not match!');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      console.log('Registration response:', response.data); // Debug log
      
      // ✅ Fix: Check response structure
      if (response.data.success || response.status === 201) {
        // Save token if returned
        if (response.data.data?.token) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        
        toast.success('Account created successfully! Please login.');
        
        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-left">
          <div className="brand">
            <div className="brand-icon">
              <span>HS</span>
            </div>
            <h1>Join Horizon Supplies</h1>
            <p>Create your account and start shopping today</p>
          </div>
          
          <div className="benefits">
            <div className="benefit">
              <div className="benefit-icon">✅</div>
              <div>
                <h4>Easy Order Tracking</h4>
                <p>Track your orders in real-time</p>
              </div>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🎁</div>
              <div>
                <h4>Exclusive Offers</h4>
                <p>Get special discounts and deals</p>
              </div>
            </div>
            <div className="benefit">
              <div className="benefit-icon">⚡</div>
              <div>
                <h4>Quick Checkout</h4>
                <p>Save time with saved addresses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="register-right">
          <div className="register-card">
            <div className="register-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
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

              <div className="terms">
                <label className="checkbox">
                  <input type="checkbox" required /> I agree to the 
                  <a href="#"> Terms of Service</a> and 
                  <a href="#"> Privacy Policy</a>
                </label>
              </div>

              <button type="submit" disabled={loading} className="register-btn">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="login-link">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;