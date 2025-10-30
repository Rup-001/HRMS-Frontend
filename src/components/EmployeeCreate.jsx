import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createEmployee } from '../api/employee';
import { getCompanies } from '../api/company';
import { getEmployees as getAllEmployees } from '../api/employee';
import { getDepartmentsByCompany } from '../api/department';
import { getDesignationsByDepartment } from '../api/designation';
import '../styles/Employee.css';

const EmployeeCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'Super Admin';
  const [formData, setFormData] = useState({
    companyId: '',
    fullName: '',
    role: isSuperAdmin ? '' : 'Employee',
    joiningDate: '',
    department: '',
    designation: '',
    email: '',
    createUser: false,
    createDeviceUser: false,
    oldEmployeeCode: '',
    deviceUserId: '',
    currentDesignation: '',
    lastWorkingDay: '',
    ageOfService: '',
    personalPhoneNumber: '',
    emergencyContactNumber: '',
    hasIdCard: false,
    idCardStatus: '',
    presentAddress: '',
    permanentAddress: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    nidPassportNumber: '',
    fatherName: '',
    motherName: '',
    employeeStatus: 'active',
    separationType: '',
    managerId: '',
    passportSizePhoto: null,
    appointmentLetter: null,
    resume: null,
    nidCopy: null,
  });
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const defaultAvatar = '/default-avatar.png';
  const fileFields = ['passportSizePhoto', 'appointmentLetter', 'resume', 'nidCopy'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [companyData, empData] = await Promise.all([
          getCompanies(token),
          getAllEmployees(token),
        ]);
        if (companyData.success && empData.success) {
          setCompanies(companyData.data);
          setEmployeesList(empData.data);
          // Automatically select the first company if available
          if (companyData.data.length > 0) {
            setFormData(prev => ({ ...prev, companyId: companyData.data[0]._id }));
          }
        } else {
          setError(companyData.error || empData.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.companyId) {
        try {
          const token = localStorage.getItem('token');
          console.log('Fetching departments for companyId:', formData.companyId);
          const data = await getDepartmentsByCompany(formData.companyId, token);
          if (data.success) {
            console.log('Fetched departments:', data.data);
            setDepartments(data.data);
          } else {
            setError(data.error || 'Failed to fetch departments');
            console.error('Error fetching departments:', data.error);
          }
        } catch (err) {
          setError(err.error || 'Something went wrong');
          console.error('Exception fetching departments:', err);
        }
      } else {
        setDepartments([]);
        console.log('companyId is empty, resetting departments.');
      }
    };
    fetchDepartments();
  }, [formData.companyId]);

  useEffect(() => {
    const fetchDesignations = async () => {
      if (formData.department) {
        try {
          const token = localStorage.getItem('token');
          console.log('Fetching designations for departmentId:', formData.department);
          const data = await getDesignationsByDepartment(formData.department, token);
          if (data.success) {
            console.log('Fetched designations:', data.data);
            setDesignations(data.data);
          } else {
            setError(data.error || 'Failed to fetch designations');
            console.error('Error fetching designations:', data.error);
          }
        } catch (err) {
          setError(err.error || 'Something went wrong');
          console.error('Exception fetching designations:', err);
        }
      } else {
        setDesignations([]);
        console.log('departmentId is empty, resetting designations.');
      }
    };
    fetchDesignations();
  }, [formData.department]);

  useEffect(() => {
    if (formData.joiningDate) {
      const today = new Date();
      const join = new Date(formData.joiningDate);
      const diffYears = today.getFullYear() - join.getFullYear();
      const diffMonths = today.getMonth() - join.getMonth();
      const years = diffYears + (diffMonths < 0 ? -1 : 0);
      setFormData(prev => ({ ...prev, ageOfService: `${years} years` }));
    }
  }, [formData.joiningDate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (fileFields.includes(name)) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      if (name === 'passportSizePhoto') {
        setPreviewImage(file ? URL.createObjectURL(file) : null);
      }
    } else if (name === 'role' && !isSuperAdmin) {
      // Prevent change if not super admin
      return;
    } else {
      setFormData(prevFormData => {
        const newFormData = { ...prevFormData, [name]: type === 'checkbox' ? checked : value };
        if (name === 'companyId') {
          newFormData.department = '';
          newFormData.designation = '';
        }
        if (name === 'department') {
          newFormData.designation = '';
        }
        return newFormData;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (fileFields.includes(key) && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key === 'createUser' || key === 'createDeviceUser') {
          if (formData[key]) {
            formDataToSend.append(key, 'true');
          }
          // Do not append if false
        } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key].toString());
        }
      });

      const data = await createEmployee(formDataToSend, token);
      if (data.success) {
        setSuccess('Employee created successfully!');
        setTimeout(() => navigate('/employees'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-container">
      <h2 className="employee-title">Create Employee</h2>
      <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
        <div className="form-grid">
          {/* Required fields top */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="employee-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="createDeviceUser">Create Device User</label>
            <input
              type="checkbox"
              id="createDeviceUser"
              name="createDeviceUser"
              checked={formData.createDeviceUser}
              onChange={handleChange}
              className="employee-checkbox"
            />
          </div>
          <div className="form-group">
            <label htmlFor="companyId">Company *</label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="employee-input"
              required
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="employee-input"
              required
              disabled={!isSuperAdmin}
            >
              <option value="Employee">Employee</option>
              {isSuperAdmin && (
                <>
                  <option value="Manager">Manager</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Company Admin">Company Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="C-Level Executive">C-Level Executive</option>
                </>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="joiningDate">Joining Date *</label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="employee-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="employee-input"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation *</label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="employee-input"
              required
            >
              <option value="">Select Designation</option>
              {designations.map((desig) => (
                <option key={desig._id} value={desig._id}>
                  {desig.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email {formData.createUser ? '*' : ''}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="employee-input"
              required={formData.createUser}
            />
          </div>

          {/* Optional fields */}
          <div className="form-group">
            <label htmlFor="oldEmployeeCode">Old Employee Code</label>
            <input
              type="text"
              id="oldEmployeeCode"
              name="oldEmployeeCode"
              value={formData.oldEmployeeCode}
              onChange={handleChange}
              className="employee-input"
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
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentDesignation">Current Designation</label>
            <input
              type="text"
              id="currentDesignation"
              name="currentDesignation"
              value={formData.currentDesignation}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastWorkingDay">Last Working Day</label>
            <input
              type="date"
              id="lastWorkingDay"
              name="lastWorkingDay"
              value={formData.lastWorkingDay}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ageOfService">Age of Service</label>
            <input
              type="text"
              id="ageOfService"
              name="ageOfService"
              value={formData.ageOfService}
              className="employee-input"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="personalPhoneNumber">Personal Phone Number</label>
            <input
              type="text"
              id="personalPhoneNumber"
              name="personalPhoneNumber"
              value={formData.personalPhoneNumber}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="emergencyContactNumber">Emergency Contact Number</label>
            <input
              type="text"
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              value={formData.emergencyContactNumber}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hasIdCard">Has ID Card</label>
            <input
              type="checkbox"
              id="hasIdCard"
              name="hasIdCard"
              checked={formData.hasIdCard}
              onChange={handleChange}
              className="employee-checkbox"
            />
          </div>
          <div className="form-group">
            <label htmlFor="idCardStatus">ID Card Status</label>
            <input
              type="text"
              id="idCardStatus"
              name="idCardStatus"
              value={formData.idCardStatus}
              onChange={handleChange}
              className="employee-input"
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
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="permanentAddress">Permanent Address</label>
            <input
              type="text"
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="employee-input"
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
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="employee-input"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nidPassportNumber">NID/Passport Number</label>
            <input
              type="text"
              id="nidPassportNumber"
              name="nidPassportNumber"
              value={formData.nidPassportNumber}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fatherName">Father's Name</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="motherName">Mother's Name</label>
            <input
              type="text"
              id="motherName"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="employeeStatus">Employee Status</label>
            <select
              id="employeeStatus"
              name="employeeStatus"
              value={formData.employeeStatus}
              onChange={handleChange}
              className="employee-input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
              <option value="resigned">Resigned</option>
              <option value="probation">Probation</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="separationType">Separation Type</label>
            <input
              type="text"
              id="separationType"
              name="separationType"
              value={formData.separationType}
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="managerId">Manager</label>
            <select
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="employee-input"
            >
              <option value="">No Manager</option>
              {employeesList.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName} ({emp.newEmployeeCode})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="createUser">Create User Account</label>
            <input
              type="checkbox"
              id="createUser"
              name="createUser"
              checked={formData.createUser}
              onChange={handleChange}
              className="employee-checkbox"
            />
          </div>

          {/* Uploads bottom */}
          <div className="form-group">
            <label htmlFor="passportSizePhoto">Passport Size Photo</label>
            <div className="image-preview-container">
              <img
                src={previewImage || defaultAvatar}
                alt="Profile Preview"
                className="employee-profile-image"
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <input
                type="file"
                id="passportSizePhoto"
                name="passportSizePhoto"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleChange}
                className="employee-input"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="appointmentLetter">Appointment Letter</label>
            <input
              type="file"
              id="appointmentLetter"
              name="appointmentLetter"
              accept="application/pdf"
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="resume">Resume</label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept="application/pdf"
              onChange={handleChange}
              className="employee-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nidCopy">NID Copy</label>
            <input
              type="file"
              id="nidCopy"
              name="nidCopy"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleChange}
              className="employee-input"
            />
          </div>
        </div>
        {error && <p className="employee-message employee-error">{error}</p>}
        {success && <p className="employee-message employee-success">{success}</p>}
        <button type="submit" className="employee-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeCreate;