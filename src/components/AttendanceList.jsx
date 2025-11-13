// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { getEmployeeAttendance } from '../api/attendance';
// import { getEmployees } from '../api/employee';
// import * as XLSX from 'xlsx';
// import '../styles/Attendance.css';

// const AttendanceList = () => {
//   const { user } = useContext(AuthContext);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   const allowedRoles = ['Super Admin', 'C-Level Executive', 'Company Admin', 'HR Manager'];

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const { data } = await getEmployees(token); // Pass the token here
//         if (data.success) {
//           setEmployees(data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching employees:', error);
//       }
//     };

//     if (allowedRoles.includes(user.role)) {
//       fetchEmployees();
//     }
//   }, [user.role]);

//   useEffect(() => {
//     const fetchAttendance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const now = new Date();
//         const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
//         const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

//         const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;
//         const params = {
//           startDate: startDate || defaultStart,
//           endDate: endDate || defaultEnd,
//           employeeId,
//         };

//         const data = await getEmployeeAttendance(params.startDate, params.endDate, params.employeeId, token);
//         console.log('Attendance data:', data.data);
//         if (data.success) {
//           setAttendanceData(data.data);
//         } else {
//           setError('Failed to fetch attendance');
//         }
//       } catch (err) {
//         setError(err.error || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAttendance();
//   }, [user, selectedEmployee, startDate, endDate]);

//   const handleFilter = () => {
//     setCurrentPage(1);
//     setLoading(true);
//     setError('');
//     const fetchAttendance = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;
//         const data = await getEmployeeAttendance(startDate, endDate, employeeId, token);
//         if (data.success) {
//           setAttendanceData(data.data);
//         } else {
//           setError('Failed to fetch attendance');
//         }
//       } catch (err) {
//         setError(err.error || 'Something went wrong');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAttendance();
//   };

//   const exportToExcel = () => {
//     const exportData = attendanceData.map(record => ({
//       'Employee Name': record.fullName,
//       'Device User ID': record.deviceUserId,
//       'Date': record.date,
//       'Check In': record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-',
//       'Check Out': record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-',
//       'Work Hours': record.work_hours,
//       'Status': record.status,
//       'Late By (minutes)': record.lateBy,
//       'Overtime (hours)': record.overtimeHours,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
//     XLSX.writeFile(workbook, `attendance_${startDate || 'start'}_to_${endDate || 'end'}.xlsx`);
//   };

//   // Pagination logic
//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   if (loading) return <div className="employee-message">Loading attendance...</div>;
//   if (error) return <div className="employee-message employee-error">{error}</div>;

//   return (
//     <div className="attendance-container">
//       <h2 className="employee-title">Attendance</h2>
//       <div className="attendance-filters">
//         <div className="form-group">
//           <label htmlFor="startDate">Start Date</label>
//           <input
//             type="date"
//             id="startDate"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="employee-input"
//             placeholder="Select start date"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="endDate">End Date</label>
//           <input
//             type="date"
//             id="endDate"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="employee-input"
//             placeholder="Select end date"
//           />
//         </div>
//         {allowedRoles.includes(user.role) && (
//           <div className="form-group">
//             <label htmlFor="employee">Employee</label>
//             <select
//               id="employee"
//               value={selectedEmployee}
//               onChange={(e) => setSelectedEmployee(e.target.value)}
//               className="employee-input"
//             >
//               <option value="">All Employees</option>
//               {employees.map((employee) => (
//                 <option key={employee.employeeId} value={employee.employeeId}>
//                   {employee.fullName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}
//         <div className="filter-buttons">
//           <button onClick={handleFilter} className="employee-button">
//             Filter
//           </button>
//           <button onClick={exportToExcel} className="employee-button">
//             Export to Excel
//           </button>
//         </div>
//       </div>
//       {attendanceData.length === 0 ? (
//         <div className="employee-message">No attendance records available.</div>
//       ) : (
//         <>
//           <div className="attendance-table-container">
//             <table className="attendance-table">
//               <thead>
//                 <tr>
//                   <th>Employee Name</th>
//                   <th>Device User ID</th>
//                   <th>Date</th>
//                   <th>Check In</th>
//                   <th>Check Out</th>
//                   <th>Work Hours</th>
//                   <th>Status</th>
//                   <th>Late By (minutes)</th>
//                   <th>Overtime (hours)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentRecords.map((record, index) => (
//                   <tr key={`${record.employeeId}-${record.date}-${index}`}>
//                     <td>{record.fullName}</td>
//                     <td>{record.deviceUserId}</td>
//                     <td>{record.date}</td>
//                     <td>{record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}</td>
//                     <td>{record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}</td>
//                     <td>{record.work_hours ? record.work_hours.toFixed(2) : '-'}</td>
//                     <td>{record.status}</td>
//                     <td>{record.lateBy}</td>
//                     <td>{record.overtimeHours}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {attendanceData.length > recordsPerPage && (
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

// export default AttendanceList;



import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployeeAttendance } from '../api/attendance';
import { getEmployees } from '../api/employee';
import * as XLSX from 'xlsx';
import '../styles/Attendance.css';

const AttendanceList = () => {
  const { user } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const allowedRoles = ['Super Admin', 'C-Level Executive', 'Company Admin', 'HR Manager'];

  // === FINAL CLEAN DISPLAY FUNCTION ===
  const cleanDisplay = (value) => {
    if (!value) return '0 mins';
    if (typeof value !== 'string') return value;

    // Fix: "21.80000000000001 mins" → "22 mins"
    if (value.includes('mins')) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        return `${Math.round(num)} mins`;
      }
    }

    // Fix: "1.19.80000000000001 hr" → "1.19 hr"
    if (value.includes('hr')) {
      const match = value.match(/(\d+\.\d+)(\.\d+)* hr/);
      if (match) {
        return `${match[1]} hr`;
      }
      // If already clean: "2 hr", "1.5 hr"
      if (/^\d+(\.\d+)? hr$/.test(value.trim())) {
        return value.trim();
      }
    }

    return value; // fallback
  };

  // === FETCH EMPLOYEES (Admin Only) ===
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getEmployees(token);
        if (response.success && Array.isArray(response.data)) {
          setEmployees(response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (allowedRoles.includes(user.role)) {
      fetchEmployees();
    }
  }, [user.role]);

  // === FETCH ATTENDANCE ===
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;

        const data = await getEmployeeAttendance(
          startDate || defaultStart,
          endDate || defaultEnd,
          employeeId,
          token
        );

        if (data.success) {
          setAttendanceData(data.data || []);
        } else {
          setError('Failed to fetch attendance');
        }
      } catch (err) {
        setError(err.error || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, selectedEmployee, startDate, endDate]);

  // === FILTER HANDLER ===
  const handleFilter = async () => {
    setCurrentPage(1);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;

      const data = await getEmployeeAttendance(startDate, endDate, employeeId, token);
      if (data.success) {
        setAttendanceData(data.data || []);
      } else {
        setError('Failed to fetch attendance');
      }
    } catch (err) {
      setError(err.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // === EXPORT TO EXCEL (Clean Values) ===
  const exportToExcel = () => {
    const exportData = attendanceData.map(record => ({
      'Employee Name': record.fullName,
      'Device User ID': record.deviceUserId,
      'Date': record.date,
      'Check In': record.check_in
        ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '-',
      'Check Out': record.check_out
        ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '-',
      'Work Hours': record.work_hours ? record.work_hours.toFixed(2) : '0.00',
      'Status': record.status,
      'Late By (minutes)': cleanDisplay(record.lateBy),
      'Overtime (hours)': cleanDisplay(record.overtimeHours),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `attendance_${startDate || 'start'}_to_${endDate || 'end'}.xlsx`);
  };

  // === PAGINATION ===
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // === LOADING / ERROR ===
  if (loading) return <div className="employee-message">Loading attendance...</div>;
  if (error) return <div className="employee-message employee-error">{error}</div>;

  return (
    <div className="attendance-container">
      <h2 className="employee-title">Attendance</h2>

      <div className="attendance-filters">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="employee-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="

endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="employee-input"
          />
        </div>

        {/* Employee Dropdown */}
        {allowedRoles.includes(user.role) && (
          <div className="form-group">
            <label htmlFor="employee">Employee</label>
            <select
              id="employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="employee-input"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-buttons">
          <button onClick={handleFilter} className="employee-button">
            Filter
          </button>
          <button onClick={exportToExcel} className="employee-button">
            Export to Excel
          </button>
        </div>
      </div>

      {attendanceData.length === 0 ? (
        <div className="employee-message">No attendance records available.</div>
      ) : (
        <>
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Device User ID</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                  <th>Late By (minutes)</th>
                  <th>Overtime (hours)</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr key={`${record.employeeId}-${record.date}-${index}`}>
                    <td>{record.fullName}</td>
                    <td>{record.deviceUserId}</td>
                    <td>{record.date}</td>
                    <td>
                      {record.check_in
                        ? new Date(record.check_in).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            // second: '2-digit',
                            hour12: false
                          })
                        : '-'}
                    </td>
                    <td>
                      {record.check_out
                        ? new Date(record.check_out).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            // second: '2-digit',
                            hour12: false
                          })
                        : '-'}
                    </td>
                    <td>{record.work_hours ? record.work_hours.toFixed(2) : '0.00'}</td>
                    <td>{record.status}</td>
                    <td>{cleanDisplay(record.lateBy)}</td>
                    <td>{cleanDisplay(record.overtimeHours)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {attendanceData.length > recordsPerPage && (
            <div className="pagination-controls">
              <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-button">
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handleNext} disabled={currentPage === totalPages} className="pagination-button">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceList;