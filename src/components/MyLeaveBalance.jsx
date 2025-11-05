import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getLeaveSummary } from '../api/leave';
import '../styles/Employee.css'; // Using employee styles for consistency

const MyLeaveBalance = () => {
  const { user } = useContext(AuthContext);
  const [leaveSummary, setLeaveSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyLeaveBalance = async () => {
      if (!user || !user.employeeId) {
        setError('User not logged in or user ID not available.');
        setLoading(false);
        return;
      }

      const currentYear = new Date().getFullYear();

      try {
        const token = localStorage.getItem('token');
        const response = await getLeaveSummary(user.employeeId, currentYear, token);
        if (response.success) {
          setLeaveSummary(response.data);
        } else {
          setError(response.error || 'Failed to fetch leave summary.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching leave summary.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyLeaveBalance();
  }, [user]);

  if (loading) {
    return <div className="employee-message">Loading leave balance...</div>;
  }

  if (error) {
    return <div className="employee-message employee-error">{error}</div>;
  }

  if (!leaveSummary) {
    return <div className="employee-message">No leave summary data available.</div>;
  }

  const leaveTypes = ['casual', 'sick', 'earned', 'maternity', 'paternity', 'bereavement', 'festive'];

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 className="employee-title">My Leave Balance</h2>
      </div>
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Entitlement (days)</th>
              <th>Taken (days)</th>
              <th>Balance (days)</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map(type => (
              <tr key={type}>
                <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                <td>{leaveSummary.entitlement[type] || 0}</td>
                <td>{leaveSummary.leaveTaken[type] || 0}</td>
                <td>{leaveSummary.balance[type] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaveBalance;
