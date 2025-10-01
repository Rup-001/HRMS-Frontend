import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createLeaveRequest, getLeaveRequests, approveLeaveRequest, denyLeaveRequest } from '../api/leave';
import '../styles/Leave.css';

const LeaveList = () => {
  const { user } = useContext(AuthContext);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: 'sick',
    isHalfDay: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  const allowedRoles = ['Manager', 'HR Manager', 'Super Admin', 'Company Admin'];

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getLeaveRequests(token);
        if (data.success) {
          setLeaveRequests(data.data);
          setFilteredRequests(data.data);
        } else {
          setError('Failed to fetch leave requests');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    const filtered = leaveRequests.filter(request =>
      (request.employeeId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       request.employeeId?.newEmployeeCode?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchQuery, leaveRequests]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = await createLeaveRequest(formData, token);
      if (data.success) {
        setSuccess('Leave request created successfully!');
        setFormData({ startDate: '', endDate: '', type: 'sick', isHalfDay: false });
        const updatedData = await getLeaveRequests(token);
        if (updatedData.success) {
          setLeaveRequests(updatedData.data);
          setFilteredRequests(updatedData.data);
        }
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await approveLeaveRequest(id, token);
      if (data.success) {
        setSuccess('Leave request approved successfully!');
        const updatedData = await getLeaveRequests(token);
        if (updatedData.success) {
          setLeaveRequests(updatedData.data);
          setFilteredRequests(updatedData.data);
        }
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async (id) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await denyLeaveRequest(id, token);
      if (data.success) {
        setSuccess('Leave request denied successfully!');
        const updatedData = await getLeaveRequests(token);
        if (updatedData.success) {
          setLeaveRequests(updatedData.data);
          setFilteredRequests(updatedData.data);
        }
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="employee-message">Loading leave requests...</div>;
  if (error) return <div className="employee-message employee-error">{error}</div>;

  return (
    <div className="leave-container">
      <h2 className="employee-title">Leave Requests</h2>
      {user?.role === 'Employee' && (
        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="employee-input"
                placeholder="Select start date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="employee-input"
                placeholder="Select end date"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Leave Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="employee-input"
                required
              >
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
                <option value="annual">Annual</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
                <option value="bereavement">Bereavement</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div className="form-group form-group-checkbox">
              <label htmlFor="isHalfDay">Half Day</label>
              <input
                type="checkbox"
                id="isHalfDay"
                name="isHalfDay"
                checked={formData.isHalfDay}
                onChange={handleChange}
                className="employee-checkbox"
              />
            </div>
          </div>
          {error && <p className="employee-message employee-error">{error}</p>}
          {success && <p className="employee-message employee-success">{success}</p>}
          <button type="submit" className="employee-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      )}
      <div className="leave-header">
        <h3 className="employee-title">Leave History</h3>
        <div className="leave-controls">
          <input
            type="text"
            placeholder="Search by employee name or code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="employee-input employee-search"
          />
        </div>
      </div>
      {filteredRequests.length === 0 ? (
        <div className="employee-message">No leave requests found.</div>
      ) : (
        <>
          <div className="leave-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee Code</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Half Day</th>
                  {allowedRoles.includes(user?.role) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.employeeId?.fullName || '-'}</td>
                    <td>{request.employeeId?.newEmployeeCode || '-'}</td>
                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                    <td>{request.type.charAt(0).toUpperCase() + request.type.slice(1)}</td>
                    <td>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</td>
                    <td>{request.isHalfDay ? 'Yes' : 'No'}</td>
                    {allowedRoles.includes(user?.role) && (
                      <td>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request._id)}
                              className="employee-button approve-button"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeny(request._id)}
                              className="employee-button deny-button"
                            >
                              Deny
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length > requestsPerPage && (
            <div className="pagination-controls">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveList;