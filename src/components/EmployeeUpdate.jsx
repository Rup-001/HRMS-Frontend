import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEmployeeProfile, updateEmployee } from '../api/employee';
import { getCompanies } from '../api/company';
import { getEmployees as getAllEmployees } from '../api/employee';
import '../styles/Employee.css';

const EmployeeUpdate = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'Super Admin';
  const [formData, setFormData] = useState({
    companyId: '',
    fullName: '',
    newEmployeeCode: '',
    role: '',
    joiningDate: '',
    assignedDepartment: '',
    designation: '',
    email: '',
    createUser: false,
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
  const [employeesList, setEmployeesList] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [hasUserAccount, setHasUserAccount] = useState(false);
  const defaultAvatar = '/default-avatar.png';
  const fileFields = ['passportSizePhoto', 'appointmentLetter', 'resume', 'nidCopy'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [employeeData, companyData, empData] = await Promise.all([
          getEmployeeProfile(id, token),
          getCompanies(token),
          getAllEmployees(token),
        ]);
        if (employeeData.success && companyData.success && empData.success) {
          const emp = employeeData.data;
          setFormData({
            companyId: emp.companyId || '',
            fullName: emp.fullName || '',
            newEmployeeCode: emp.newEmployeeCode || '',
            role: emp.role || '',
            joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '',
            assignedDepartment: emp.assignedDepartment || '',
            designation: emp.designation || '',
            email: emp.email || '',
            createUser: false,
            oldEmployeeCode: emp.oldEmployeeCode || '',
            deviceUserId: emp.deviceUserId || '',
            currentDesignation: emp.currentDesignation || '',
            lastWorkingDay: emp.lastWorkingDay ? new Date(emp.lastWorkingDay).toISOString().split('T')[0] : '',
            ageOfService: emp.ageOfService || '',
            personalPhoneNumber: emp.personalPhoneNumber || '',
            emergencyContactNumber: emp.emergencyContactNumber || '',
            hasIdCard: emp.hasIdCard || false,
            idCardStatus: emp.idCardStatus || '',
            presentAddress: emp.presentAddress || '',
            permanentAddress: emp.permanentAddress || '',
            gender: emp.gender || '',
            dob: emp.dob ? new Date(emp.dob).toISOString().split('T')[0] : '',
            bloodGroup: emp.bloodGroup || '',
            nidPassportNumber: emp.nidPassportNumber || '',
            fatherName: emp.fatherName || '',
            motherName: emp.motherName || '',
            employeeStatus: emp.employeeStatus || 'active',
            separationType: emp.separationType || '',
            managerId: emp.managerId || '',
            passportSizePhoto: null,
            appointmentLetter: null,
            resume: null,
            nidCopy: null,
          });
          setPreviewImage(emp.passportSizePhoto ? `${import.meta.env.VITE_API_URL}${emp.passportSizePhoto}` : null);
          setHasUserAccount(emp.hasUserAccount || false);
          setCompanies(companyData.data);
          setEmployeesList(empData.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
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
        } else if (key === 'createUser') {
          if (formData[key] && !hasUserAccount) {
            formDataToSend.append(key, 'true');
          }
          // Do not append if false or if hasUserAccount
        } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key].toString());
        }
      });

      const data = await updateEmployee(id, formDataToSend, token);
      if (data.success) {
        setSuccess('Employee updated successfully!');
        setTimeout(() => navigate('/employees'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="employee-message">Loading...</div>;

  return (
    <div className="employee-container">
      <h2 className="employee-title">Update Employee</h2>
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
            <label htmlFor="newEmployeeCode">New Employee Code *</label>
            <input
              type="text"
              id="newEmployeeCode"
              name="newEmployeeCode"
              value={formData.newEmployeeCode}
              onChange={handleChange}
              className="employee-input"
              required
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
            <label htmlFor="assignedDepartment">Assigned Department *</label>
            <input
              type="text"
              id="assignedDepartment"
              name="assignedDepartment"
              value={formData.assignedDepartment}
              onChange={handleChange}
              className="employee-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation *</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="employee-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email {(hasUserAccount || formData.createUser) ? '*' : ''}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="employee-input"
              required={hasUserAccount || formData.createUser}
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
          {hasUserAccount ? (
            <div className="form-group">
              <label>Has User Account</label>
              <input
                type="checkbox"
                checked={true}
                className="employee-checkbox"
                disabled
              />
            </div>
          ) : (
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
          )}

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
          {loading ? 'Updating...' : 'Update Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeUpdate;