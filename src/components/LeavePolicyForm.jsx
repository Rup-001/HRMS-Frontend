import React, { useState, useEffect, useContext } from 'react';
import { getLeavePolicy, updateLeavePolicy } from '../api/leave';
import { AuthContext } from '../context/AuthContext';
import '../styles/Leave.css';

const LeavePolicyForm = () => {
  const { user } = useContext(AuthContext);
  const [policy, setPolicy] = useState({
    casual: 0,
    sick: 0,
    annual: 0,
    maternity: 0,
    festive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // const isAuthorized = ['HR Manager'||'Super Admin'].includes(user?.role);
const isAuthorized = ['HR Manager', 'Super Admin', 'Company Admin', 'C-Level Executive'].includes(user?.role);
  useEffect(() => {
    if (!isAuthorized) return;
    fetchPolicy();
  }, [isAuthorized]);

  const fetchPolicy = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = await getLeavePolicy(token);
      if (data.success) {
        setPolicy(data.data);
      } else {
        setError(data.error || 'Failed to fetch leave policy.');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicy(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await updateLeavePolicy(policy, token);
      if (data.success) {
        setSuccess('Leave policy updated successfully!');
      } else {
        setError(data.error || 'Failed to update leave policy.');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return <div className="employee-message employee-error">Access Denied</div>;
  if (loading) return <div className="employee-message">Loading leave policy...</div>;
  if (error) return <div className="employee-message employee-error">Error: {error}</div>;

  return (
    <div className="leave-container">
      <h3 className="employee-title">Manage Leave Policy</h3>
      <form onSubmit={handleSubmit} className="leave-form">
        {Object.keys(policy).map(key => {
          if (['_id', 'companyId', 'createdAt', 'updatedAt', '__v'].includes(key)) return null;
          return (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)} Leave (days):</label>
              <input
                type="number"
                id={key}
                name={key}
                value={policy[key]}
                onChange={handleChange}
                min="0"
                required
                className="employee-input"
              />
            </div>
          );
        })}
        {success && <p className="employee-message employee-success">{success}</p>}
        {error && <p className="employee-message employee-error">{error}</p>}
        <button type="submit" disabled={loading} className="employee-button">
          {loading ? 'Updating...' : 'Update Policy'}
        </button>
      </form>
    </div>
  );
};

export default LeavePolicyForm;