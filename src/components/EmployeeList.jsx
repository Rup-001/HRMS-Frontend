// // // import { useState, useEffect, useContext } from 'react';
// // // import { Link } from 'react-router-dom';
// // // import { AuthContext } from '../context/AuthContext';
// // // import { getEmployees } from '../api/employee';
// // // import '../styles/Employee.css';

// // // const EmployeeList = () => {
// // //   const { user } = useContext(AuthContext);
// // //   const [employees, setEmployees] = useState([]);
// // //   const [error, setError] = useState('');
// // //   const [loading, setLoading] = useState(true);
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const employeesPerPage = 5;

// // //   useEffect(() => {
// // //     const fetchEmployees = async () => {
// // //       try {
// // //         const token = localStorage.getItem('token');
// // //         const data = await getEmployees(token);
// // //         if (data.success) {
// // //           setEmployees(data.data);
// // //         } else {
// // //           setError('Failed to fetch employees');
// // //         }
// // //       } catch (err) {
// // //         setError(err.error || 'Something went wrong');
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchEmployees();
// // //   }, []);

// // //   // Pagination logic
// // //   const indexOfLastEmployee = currentPage * employeesPerPage;
// // //   const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
// // //   const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
// // //   const totalPages = Math.ceil(employees.length / employeesPerPage);

// // //   const handlePrevious = () => {
// // //     if (currentPage > 1) setCurrentPage(currentPage - 1);
// // //   };

// // //   const handleNext = () => {
// // //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
// // //   };

// // //   if (loading) return <div className="loading">Loading...</div>;
// // //   if (error) return <div className="error">{error}</div>;

// // //   return (
// // //     <div className="employee-container">
// // //       <h2>Employees</h2>
// // //       <div className="employee-card">
// // //         <table className="employee-table">
// // //           <thead>
// // //             <tr>
// // //               <th>Name</th>
// // //               <th>Employee Code</th>
// // //               <th>Email</th>
// // //               <th>Role</th>
// // //               <th>Department</th>
// // //               <th>Designation</th>
// // //               <th>Phone</th>
// // //               <th>Address</th>
// // //               <th>Gender</th>
// // //               <th>Date of Birth</th>
// // //               <th>Actions</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {currentEmployees.map((employee) => (
// // //               <tr key={employee._id}>
// // //                 <td>{employee.fullName}</td>
// // //                 <td>{employee.newEmployeeCode}</td>
// // //                 <td>{employee.email}</td>
// // //                 <td>{employee.role}</td>
// // //                 <td>{employee.assignedDepartment}</td>
// // //                 <td>{employee.designation}</td>
// // //                 <td>{employee.personalPhoneNumber || '-'}</td>
// // //                 <td>{employee.presentAddress || '-'}</td>
// // //                 <td>{employee.gender || '-'}</td>
// // //                 <td>{employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</td>
// // //                 <td>
// // //                   <Link to={`/employees/${employee._id}/edit`} className="action-link">Edit</Link>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //         <div className="pagination">
// // //           <button
// // //             onClick={handlePrevious}
// // //             disabled={currentPage === 1}
// // //             className="pagination-button"
// // //           >
// // //             Previous
// // //           </button>
// // //           <span className="pagination-info">
// // //             Page {currentPage} of {totalPages}
// // //           </span>
// // //           <button
// // //             onClick={handleNext}
// // //             disabled={currentPage === totalPages}
// // //             className="pagination-button"
// // //           >
// // //             Next
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeList;



// // import { useState, useEffect, useContext } from 'react';
// // import { Link } from 'react-router-dom';
// // import { AuthContext } from '../context/AuthContext';
// // import { getEmployees } from '../api/employee';
// // import '../styles/Employee.css';

// // const EmployeeList = () => {
// //   const { user } = useContext(AuthContext);
// //   const [employees, setEmployees] = useState([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const employeesPerPage = 5;

// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         const data = await getEmployees(token);
// //         if (data.success) {
// //           setEmployees(data.data);
// //         } else {
// //           setError('Failed to fetch employees');
// //         }
// //       } catch (err) {
// //         setError(err.error || 'Something went wrong');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchEmployees();
// //   }, []);

// //   // Pagination logic
// //   const indexOfLastEmployee = currentPage * employeesPerPage;
// //   const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
// //   const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
// //   const totalPages = Math.ceil(employees.length / employeesPerPage);

// //   const handlePrevious = () => {
// //     if (currentPage > 1) setCurrentPage(currentPage - 1);
// //   };

// //   const handleNext = () => {
// //     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
// //   };

// //   if (loading) return <div className="employee-message">Loading employees...</div>;
// //   if (error) return <div className="employee-message employee-error">{error}</div>;

// //   return (
// //     <div className="employee-container">
// //       <h2 class ib className="employee-title">Employees</h2>
// //       {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
// //         <Link to="/employees/create" className="employee-button">
// //           Add Employee
// //         </Link>
// //       )}
// //       {employees.length === 0 ? (
// //         <div className="employee-message">No employees available.</div>
// //       ) : (
// //         <>
// //           <div className="employee-card-container">
// //             {currentEmployees.map((employee) => (
// //               <div key={employee._id} className="employee-card">
// //                 <p><strong>Name:</strong> {employee.fullName || '-'}</p>
// //                 <p><strong>Employee Code:</strong> {employee.newEmployeeCode || '-'}</p>
// //                 <p><strong>Email:</strong> {employee.email || '-'}</p>
// //                 <p><strong>Role:</strong> {employee.role || '-'}</p>
// //                 <p><strong>Department:</strong> {employee.assignedDepartment || '-'}</p>
// //                 <p><strong>Designation:</strong> {employee.designation || '-'}</p>
// //                 <p><strong>Phone:</strong> {employee.personalPhoneNumber || '-'}</p>
// //                 <p><strong>Address:</strong> {employee.presentAddress || '-'}</p>
// //                 <p><strong>Gender:</strong> {employee.gender || '-'}</p>
// //                 <p><strong>Date of Birth:</strong> {employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</p>
// //                 {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
// //                   <Link to={`/employees/${employee._id}/edit`} className="employee-button">
// //                     Edit
// //                   </Link>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //           {employees.length > employeesPerPage && (
// //             <div className="pagination-controls">
// //               <button
// //                 onClick={handlePrevious}
// //                 disabled={currentPage === 1}
// //                 className="pagination-button"
// //               >
// //                 Previous
// //               </button>
// //               <span className="pagination-info">
// //                 Page {currentPage} of {totalPages}
// //               </span>
// //               <button
// //                 onClick={handleNext}
// //                 disabled={currentPage === totalPages}
// //                 className="pagination-button"
// //               >
// //                 Next
// //               </button>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeeList;




// import { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { getEmployees } from '../api/employee';
// import '../styles/Employee.css';

// const EmployeeList = () => {
//   const { user } = useContext(AuthContext);
//   const [employees, setEmployees] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const employeesPerPage = 5;

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const data = await getEmployees(token);
//         if (data.success) {
//           setEmployees(data.data);
//         } else {
//           setError('Failed to fetch employees');
//         }
//       } catch (err) {
//         setError(err.error || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // Pagination logic
//   const indexOfLastEmployee = currentPage * employeesPerPage;
//   const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
//   const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
//   const totalPages = Math.ceil(employees.length / employeesPerPage);

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   if (loading) return <div className="employee-message">Loading employees...</div>;
//   if (error) return <div className="employee-message employee-error">{error}</div>;

//   return (
//     <div className="employee-container">
//       <div className="employee-header">
//         <h2 className="employee-title">Employees</h2>
//         {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
//           <Link to="/employees/create" className="employee-button">
//             Add Employee
//           </Link>
//         )}
//       </div>
//       {employees.length === 0 ? (
//         <div className="employee-message">No employees available.</div>
//       ) : (
//         <>
//           <div className="employee-table-container">
//             <table className="employee-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Employee Code</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Department</th>
//                   <th>Designation</th>
//                   <th>Phone</th>
//                   <th>Address</th>
//                   <th>Gender</th>
//                   <th>Date of Birth</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentEmployees.map((employee) => (
//                   <tr key={employee._id}>
//                     <td>{employee.fullName || '-'}</td>
//                     <td>{employee.newEmployeeCode || '-'}</td>
//                     <td>{employee.email || '-'}</td>
//                     <td>{employee.role || '-'}</td>
//                     <td>{employee.assignedDepartment || '-'}</td>
//                     <td>{employee.designation || '-'}</td>
//                     <td>{employee.personalPhoneNumber || '-'}</td>
//                     <td>{employee.presentAddress || '-'}</td>
//                     <td>{employee.gender || '-'}</td>
//                     <td>{employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</td>
//                     <td>
//                       {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
//                         <Link to={`/employees/${employee._id}/edit`} className="employee-button">
//                           Edit
//                         </Link>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {employees.length > employeesPerPage && (
//             <div className="pagination-controls">
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentPage === 1}
//                 className="pagination-button"
//               >
//                 Previous
//               </button>
//               <span className="pagination-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={handleNext}
//                 disabled={currentPage === totalPages}
//                 className="pagination-button"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default EmployeeList;

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEmployees } from '../api/employee';
import '../styles/Employee.css';

const EmployeeList = () => {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getEmployees(token);
        if (data.success) {
          setEmployees(data.data);
          setFilteredEmployees(data.data);
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

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.newEmployeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchQuery, employees]);

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <div className="employee-message">Loading employees...</div>;
  if (error) return <div className="employee-message employee-error">{error}</div>;

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2 className="employee-title">Employees</h2>
        <div className="employee-controls">
          <input
            type="text"
            placeholder="Search by name, code, or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="employee-input employee-search"
          />
          {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin') && (
            <Link to="/employees/create" className="employee-button">
              Add Employee
            </Link>
          )}
        </div>
      </div>
      {filteredEmployees.length === 0 ? (
        <div className="employee-message">No employees found.</div>
      ) : (
        <>
          <div className="employee-table-container">
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
                    <td>{employee.fullName || '-'}</td>
                    <td>{employee.newEmployeeCode || '-'}</td>
                    <td>{employee.email || '-'}</td>
                    <td>{employee.role || '-'}</td>
                    <td>{employee.assignedDepartment || '-'}</td>
                    <td>{employee.designation || '-'}</td>
                    <td>{employee.personalPhoneNumber || '-'}</td>
                    <td>{employee.presentAddress || '-'}</td>
                    <td>{employee.gender || '-'}</td>
                    <td>{employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}</td>
                    <td>
                      {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin') && (
                        <Link to={`/employees/${employee._id}/edit`} className="employee-button">
                          Edit
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length > employeesPerPage && (
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

export default EmployeeList;