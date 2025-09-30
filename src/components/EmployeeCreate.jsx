import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createEmployee } from '../api/employee';
import '../styles/Employee.css';

const EmployeeCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    newEmployeeCode: '',
    email: '',
    role: 'Employee',
    companyId: user.companyId,
    joiningDate: '',
    assignedDepartment: '',
    designation: '',
    deviceUserId: '',
    personalPhoneNumber: '',
    presentAddress: '',
    gender: '',
    dob: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = await createEmployee(formData, token);
      if (data.success) {
        setSuccess('Employee created successfully! An invitation email has been sent.');
        setFormData({
          fullName: '',
          newEmployeeCode: '',
          email: '',
          role: 'Employee',
          companyId: user.companyId,
          joiningDate: '',
          assignedDepartment: '',
          designation: '',
          deviceUserId: '',
          personalPhoneNumber: '',
          presentAddress: '',
          gender: '',
          dob: '',
        });
        setTimeout(() => navigate('/employees'), 2000);
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-container">
      <h2>Create Employee</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newEmployeeCode">Employee Code</label>
          <input
            type="text"
            id="newEmployeeCode"
            name="newEmployeeCode"
            value={formData.newEmployeeCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="Super Admin">Super Admin</option>
            <option value="C-Level Executive">C-Level Executive</option>
            <option value="Company Admin">Company Admin</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignedDepartment">Department</label>
          <input
            type="text"
            id="assignedDepartment"
            name="assignedDepartment"
            value={formData.assignedDepartment}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deviceUserId">Device User ID</label>
          <input
            type="text"
            id="deviceUserId"
            name="deviceUserId"
            value={formData.deviceUserId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="personalPhoneNumber">Phone Number</label>
          <input
            type="text"
            id="personalPhoneNumber"
            name="personalPhoneNumber"
            value={formData.personalPhoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="presentAddress">Present Address</label>
          <input
            type="text"
            id="presentAddress"
            name="presentAddress"
            value={formData.presentAddress}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeCreate;