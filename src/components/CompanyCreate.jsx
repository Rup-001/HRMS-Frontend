import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../api/company';
import '../styles/CompanyCreate.css';

const CompanyCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = await createCompany(formData, token);
      if (data.success) {
        setSuccess('Company created successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-container">
      <h2 className="company-title">Create Company</h2>
      <form onSubmit={handleSubmit} className="company-form">
        <div className="form-group">
          <label htmlFor="name">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="company-input"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Active</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="company-checkbox"
          />
        </div>
        {error && <p className="company-message company-error">{error}</p>}
        {success && <p className="company-message company-success">{success}</p>}
        <button type="submit" className="company-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Company'}
        </button>
      </form>
    </div>
  );
};

export default CompanyCreate;