import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      if (data.success) {
        setAuth(data.token, {
          id: data.id,
          email: data.email,
          role: data.role,
          employeeId: data.employeeId,
          companyId: data.companyId,
        });
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="particle-background">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`} />
        ))}
      </div>
      <div className="login-card">
        <div className="login-glow" />
        <Link to="/" className="back-link">
          <ArrowLeft className="back-icon" />
          Back to Home
        </Link>
        <div className="logo-container">
          <img src="/logo-al.svg" alt="Alawaf HRMS Logo" className="login-logo animate-float" />
        </div>
        <h2 className="login-title">Login to Alawaf HRMS</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="login-input"
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="login-input"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="invitation-link">
          New user?{' '}
          <Link to="/accept-invitation">Accept Invitation</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;