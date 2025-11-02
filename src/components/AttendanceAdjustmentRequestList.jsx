import React, { useState, useEffect, useContext } from 'react';
import { getAdjustmentRequests, managerReviewAdjustment, hrReviewAdjustment } from '../api/attendance';
import { AuthContext } from '../context/AuthContext';
import '../styles/Attendance.css';

const AttendanceAdjustmentRequestList = ({ refreshTrigger }) => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  // ← ADD THIS
// const [managerComment, setManagerComment] = useState({});
  const [managerComment, setManagerComment] = useState({});
  const [hrComment, setHrComment] = useState({});

  useEffect(() => {
    fetchRequests();
  }, [user, refreshTrigger]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = await getAdjustmentRequests(token);
      if (data.success) {
        setRequests(data.data);
      } else {
        setError(data.error || 'Failed to fetch requests.');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleManagerReview = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const data = await managerReviewAdjustment(id, { status, managerComment: managerComment[id] || '' }, token);
      if (data.success) {
        fetchRequests();
      } else {
        setError(data.error || 'Manager review failed.');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    }
  };

  const handleHrReview = async (id, status) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const data = await hrReviewAdjustment(id, { status, hrComment: hrComment[id] || '' }, token);
      if (data.success) {
        fetchRequests();
      } else {
        setError(data.error || 'HR review failed.');
      }
    } catch (err) {
      setError(err.error || 'An unexpected error occurred.');
    }
  };

  if (loading) return <div className="employee-message">Loading requests...</div>;
  if (error) return <div className="employee-message employee-error">Error: {error}</div>;

  const isManager = user?.role === 'Manager';
  const isHR = user?.role === 'HR Manager';
  const isSuperAdmin = user?.role === 'Super Admin';
  const isCompanyAdmin = user?.role === 'Company Admin';
  const isCLevelExecutive = user?.role === 'C-Level Executive';

  return (
    <div className="attendance-container">
      <h3 className="employee-title">Attendance Adjustment Requests</h3>
      {requests.length === 0 ? (
        <p className="employee-message">No adjustment requests found.</p>
      ) : (
        <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Original Check-in</th>
              <th>Original Check-out</th>
              <th>Proposed Check-in</th>
              <th>Proposed Check-out</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Manager</th>
              <th>HR</th>
              {(isManager || isHR || isSuperAdmin || isCompanyAdmin || isCLevelExecutive) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request._id}>
                <td>{request.employeeId?.fullName} ({request.employeeId?.newEmployeeCode})</td>
                <td>{new Date(request.attendanceDate).toLocaleDateString()}</td>
                <td>{request.originalCheckIn ? new Date(request.originalCheckIn).toLocaleTimeString() : '-'}</td>
                <td>{request.originalCheckOut ? new Date(request.originalCheckOut).toLocaleTimeString() : '-'}</td>
                <td>{request.proposedCheckIn ? new Date(request.proposedCheckIn).toLocaleTimeString() : '-'}</td>
                <td>{request.proposedCheckOut ? new Date(request.proposedCheckOut).toLocaleTimeString() : '-'}</td>
                <td>{request.reason}</td>
                <td>{request.status.replace(/_/g, ' ').toUpperCase()}</td>
                <td>{request.managerApproverId?.fullName || 'N/A'}</td>
                <td>{request.hrApproverId?.fullName || 'N/A'}</td>
                <td>
                  {/* {request.status === 'pending_manager_approval' && (isManager || isSuperAdmin || isCompanyAdmin || isCLevelExecutive) && user?.employeeId === request.managerApproverId?._id && ( */}
                    {request.status === 'pending_manager_approval' && 
  (isManager || isCLevelExecutive || isSuperAdmin || isCompanyAdmin) && 
  user?.employeeId === request.managerApproverId?._id && (
                    <div className="review-actions">
                      <textarea
                        placeholder="Manager comment"
                        value={managerComment[request._id] || ''}
                        onChange={(e) => setManagerComment({ ...managerComment, [request._id]: e.target.value })}
                        className="employee-input"
                      ></textarea>
                      <button onClick={() => handleManagerReview(request._id, 'approved')} className="employee-button approve-button">Approve</button>
                      <button onClick={() => handleManagerReview(request._id, 'denied_by_manager')} className="employee-button deny-button">Deny</button>
                    </div>
                  )}
                  {/* {request.status === 'pending_hr_approval' && (isHR || isSuperAdmin || isCompanyAdmin || isCLevelExecutive) && ( */}
                    {request.status === 'pending_hr_approval' && 
  (isHR || isCLevelExecutive || isSuperAdmin || isCompanyAdmin) && (
                    <div className="review-actions">
                      <textarea
                        placeholder="HR comment"
                        value={hrComment[request._id] || ''}
                        onChange={(e) => setHrComment({ ...hrComment, [request._id]: e.target.value })}
                        className="employee-input"
                      ></textarea>
                      <button onClick={() => handleHrReview(request._id, 'approved')} className="employee-button approve-button">Approve</button>
                      <button onClick={() => handleHrReview(request._id, 'denied_by_hr')} className="employee-button deny-button">Deny</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceAdjustmentRequestList;