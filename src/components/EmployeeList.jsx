import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEmployees } from '../api/employee';
import '../styles/Employee.css';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getEmployees(token);
        if (data.success) {
          setEmployees(data.data);
        } else {
          setError('Failed to fetch employees');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-container">
      <h2>Employees</h2>
      <div className="employee-card">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee Code</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.fullName}</td>
                <td>{employee.newEmployeeCode}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>{employee.assignedDepartment}</td>
                <td>{employee.designation}</td>
                <td>{employee.personalPhoneNumber || '-'}</td>
                <td>{employee.presentAddress || '-'}</td>
                <td>{employee.gender || '-'}</td>
                <td>{employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</td>
                <td>
                  <Link to={`/employees/${employee._id}/edit`} className="action-link">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
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
      </div>
    </div>
  );
};

export default EmployeeList;