import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEmployeeById, updateEmployee } from '../api/employee';
import '../styles/Employee.css';

const EmployeeUpdate = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    newEmployeeCode: '',
    email: '',
    role: 'Employee',
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getEmployeeById(id, token);
        if (data.success) {
          setFormData({
            fullName: data.data.fullName,
            newEmployeeCode: data.data.newEmployeeCode,
            email: data.data.email,
            role: data.data.role,
            joiningDate: data.data.joiningDate ? data.data.joiningDate.split('T')[0] : '',
            assignedDepartment: data.data.assignedDepartment,
            designation: data.data.designation,
            deviceUserId: data.data.deviceUserId || '',
            personalPhoneNumber: data.data.personalPhoneNumber || '',
            presentAddress: data.data.presentAddress || '',
            gender: data.data.gender || '',
            dob: data.data.dob ? data.data.dob.split('T')[0] : '',
          });
        } else {
          setError('Failed to fetch employee');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const data = await updateEmployee(id, formData, token);
      if (data.success) {
        navigate('/employees');
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-container">
      <h2>Update Employee</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeUpdate;