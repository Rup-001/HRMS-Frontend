// // import { useState, useEffect, useContext } from 'react';
// // import { AuthContext } from '../context/AuthContext';
// // import { getEmployeeAttendance } from '../api/attendance';
// // import { getEmployees } from '../api/employee';
// // import * as XLSX from 'xlsx';
// // import '../styles/Attendance.css';

// // const AttendanceList = () => {
// //   const { user } = useContext(AuthContext);
// //   const [attendanceData, setAttendanceData] = useState([]);
// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState('');
// //   const [startDate, setStartDate] = useState('');
// //   const [endDate, setEndDate] = useState('');
// //   const [searchTerm, setSearchTerm] = useState(''); // New state for search term
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const recordsPerPage = 10;

// //   const allowedRoles = ['Super Admin', 'C-Level Executive', 'Company Admin', 'HR Manager'];

// //   /* ---------- UTC TIME (HH:MM) ---------- */
// //   const formatUTCTime = (isoString) => {
// //     if (!isoString) return '-';
// //     const d = new Date(isoString);
// //     return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
// //   };

// //   /* ---------- ORIGINAL CLEAN DISPLAY (keeps "X.XX hr") ---------- */
// //   const cleanDisplay = (value) => {
// //     if (!value) return '0 mins';
// //     if (typeof value !== 'string') return value;

// //     // Fix floating-point noise like "21.80000000000001 mins"
// //     if (value.includes('mins')) {
// //       const num = parseFloat(value);
// //       if (!isNaN(num)) return `${Math.round(num)} mins`;
// //     }

// //     // Keep hour strings clean – "9.45 hr", "8.44 hr"
// //     if (value.includes('hr')) {
// //       const match = value.match(/(\d+\.\d+)(\.\d+)* hr/);
// //       if (match) return `${match[1]} hr`;

// //       if (/^\d+(\.\d+)? hr$/.test(value.trim())) return value.trim();
// //     }

// //     return value;
// //   };

// //   /* ---------- FETCH EMPLOYEES ---------- */
// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         const response = await getEmployees(token);
// //         if (response.success && Array.isArray(response.data)) {
// //           setEmployees(response.data);
// //         }
// //       } catch (err) {
// //         console.error('Error fetching employees:', err);
// //       }
// //     };

// //     if (allowedRoles.includes(user.role)) fetchEmployees();
// //   }, [user.role]);

// //   /* ---------- FETCH ATTENDANCE ---------- */
// //   useEffect(() => {
// //     const fetchAttendance = async () => {
// //       try {
// //         const token = localStorage.getItem('token');
// //         const now = new Date();
// //         const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
// //           .toISOString()
// //           .split('T')[0];
// //         const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
// //           .toISOString()
// //           .split('T')[0];

// //         const employeeIdToFetch = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;

// //         const data = await getEmployeeAttendance(
// //           startDate || defaultStart,
// //           endDate || defaultEnd,
// //           employeeIdToFetch,
// //           searchTerm, // Pass search term
// //           token
// //         );

// //         if (data.success) setAttendanceData(data.data || []);
// //         else setError('Failed to fetch attendance');
// //       } catch (err) {
// //         setError(err.error || 'Something went wrong');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAttendance();
// //   }, [user, selectedEmployee, startDate, endDate, searchTerm]); // Add searchTerm to dependencies

// //   /* ---------- FILTER ---------- */
// //   const handleFilter = async () => {
// //     setCurrentPage(1);
// //     setLoading(true);
// //     setError('');

// //     try {
// //       const token = localStorage.getItem('token');
// //       const employeeIdToFetch = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;

// //       const data = await getEmployeeAttendance(startDate, endDate, employeeIdToFetch, searchTerm, token); // Pass search term
// //       if (data.success) setAttendanceData(data.data || []);
// //       else setError('Failed to fetch attendance');
// //     } catch (err) {
// //       setError(err.error || 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- EXPORT TO EXCEL ---------- */
// //   const exportToExcel = () => {
// //     const exportData = attendanceData.map((record) => ({
// //       'Employee Name': record.fullName,
// //       'Device User ID': record.deviceUserId,
// //       Date: record.date,
// //       'Check In': record.check_in ? formatUTCTime(record.check_in) : '-',
// //       'Check Out': record.check_out ? formatUTCTime(record.check_out) : '-',
// //       'Work Hours': record.work_hours ? record.work_hours.toFixed(2) : '0.00',
// //       Status: record.status,
// //       'Late By (minutes)': cleanDisplay(record.lateBy),
// //       'Overtime (hours)': cleanDisplay(record.overtimeHours),
// //     }));

// //     const ws = XLSX.utils.json_to_sheet(exportData);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
// //     XLSX.writeFile(wb, `attendance_${startDate || 'start'}_to_${endDate || 'end'}.xlsx`);
// //   };

// //   /* ---------- PAGINATION ---------- */
// //   const indexOfLast = currentPage * recordsPerPage;
// //   const indexOfFirst = indexOfLast - recordsPerPage;
// //   const currentRecords = attendanceData.slice(indexOfFirst, indexOfLast);
// //   const totalPages = Math.ceil(attendanceData.length / recordsPerPage);

// //   const prev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
// //   const next = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

// //   /* ---------- RENDER ---------- */
// //   if (loading) return <div className="employee-message">Loading attendance...</div>;
// //   if (error) return <div className="employee-message employee-error">{error}</div>;

// //   return (
// //     <div className="attendance-container">
// //       <h2 className="employee-title">Attendance</h2>

// //       <div className="attendance-filters">
// //         <div className="form-group">
// //           <label htmlFor="startDate">Start Date</label>
// //           <input
// //             type="date"
// //             id="startDate"
// //             value={startDate}
// //             onChange={(e) => setStartDate(e.target.value)}
// //             className="employee-input"
// //           />
// //         </div>

// //         <div className="form-group">
// //           <label htmlFor="endDate">End Date</label>
// //           <input
// //             type="date"
// //             id="endDate"
// //             value={endDate}
// //             onChange={(e) => setEndDate(e.target.value)}
// //             className="employee-input"
// //           />
// //         </div>

// //         {allowedRoles.includes(user.role) && (
// //           <>
// //             <div className="form-group">
// //               <label htmlFor="employee">Employee</label>
// //               <select
// //                 id="employee"
// //                 value={selectedEmployee}
// //                 onChange={(e) => setSelectedEmployee(e.target.value)}
// //                 className="employee-input"
// //               >
// //                 <option value="">All Employees</option>
// //                 {employees.map((emp) => (
// //                   <option key={emp._id} value={emp._id}>
// //                     {emp.fullName}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label htmlFor="searchEmployee">Search Employee</label>
// //               <input
// //                 type="text"
// //                 id="searchEmployee"
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="employee-input"
// //                 placeholder="Search by name"
// //               />
// //             </div>
// //           </>
// //         )}

// //         <div className="filter-buttons">
// //           <button onClick={handleFilter} className="employee-button">
// //             Filter
// //           </button>
// //           <button onClick={exportToExcel} className="employee-button">
// //             Export to Excel
// //           </button>
// //         </div>
// //       </div>

// //       {attendanceData.length === 0 ? (
// //         <div className="employee-message">No attendance records available.</div>
// //       ) : (
// //         <>
// //           <div className="attendance-table-container">
// //             <table className="attendance-table">
// //               <thead>
// //                 <tr>
// //                   <th>Employee Name</th>
// //                   <th>Device User ID</th>
// //                   <th>Date</th>
// //                   <th>Check In</th>
// //                   <th>Check Out</th>
// //                   <th>Work Hours</th>
// //                   <th>Status</th>
// //                   <th>Late By (minutes)</th>
// //                   <th>Overtime (hours)</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentRecords.map((record, idx) => (
// //                   <tr key={`${record.employeeId}-${record.date}-${idx}`}>
// //                     <td>{record.fullName}</td>
// //                     <td>{record.deviceUserId}</td>
// //                     <td>{record.date}</td>
// //                     <td>{record.check_in ? formatUTCTime(record.check_in) : '-'}</td>
// //                     <td>{record.check_out ? formatUTCTime(record.check_out) : '-'}</td>
// //                     <td>{record.work_hours ? record.work_hours.toFixed(2) : '0.00'}</td>
// //                     <td>{record.status}</td>
// //                     <td>{cleanDisplay(record.lateBy)}</td>
// //                     <td>{cleanDisplay(record.overtimeHours)}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {attendanceData.length > recordsPerPage && (
// //             <div className="pagination-controls">
// //               <button onClick={prev} disabled={currentPage === 1} className="pagination-button">
// //                 Previous
// //               </button>
// //               <span className="pagination-info">
// //                 Page {currentPage} of {totalPages}
// //               </span>
// //               <button onClick={next} disabled={currentPage === totalPages} className="pagination-button">
// //                 Next
// //               </button>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default AttendanceList;



// import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { getEmployeeAttendance } from '../api/attendance';
// import { getEmployees } from '../api/employee';
// import * as XLSX from 'xlsx';
// import '../styles/Attendance.css';

// const AttendanceList = () => {
//   const { user } = useContext(AuthContext);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [searchQuery, setSearchQuery] = useState(''); // Instant name search
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const recordsPerPage = 10;

//   const allowedRoles = ['Super Admin', 'C-Level Executive', 'Company Admin', 'HR Manager'];

//   /* ---------- UTC TIME (HH:MM) ---------- */
//   const formatUTCTime = (isoString) => {
//     if (!isoString) return '-';
//     const d = new Date(isoString);
//     return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
//   };

//   /* ---------- CLEAN DISPLAY ---------- */
//   const cleanDisplay = (value) => {
//     if (!value) return '0 mins';
//     if (typeof value !== 'string') return value;

//     if (value.includes('mins')) {
//       const num = parseFloat(value);
//       if (!isNaN(num)) return `${Math.round(num)} mins`;
//     }

//     if (value.includes('hr')) {
//       const match = value.match(/(\d+\.\d+)(\.\d+)* hr/);
//       if (match) return `${match[1]} hr`;
//       if (/^\d+(\.\d+)? hr$/.test(value.trim())) return value.trim();
//     }

//     return value;
//   };

//   /* ---------- FETCH EMPLOYEES ---------- */
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await getEmployees(token);
//         if (response.success && Array.isArray(response.data)) {
//           setEmployees(response.data);
//         }
//       } catch (err) {
//         console.error('Error fetching employees:', err);
//       }
//     };

//     if (allowedRoles.includes(user.role)) fetchEmployees();
//   }, [user.role]);

//   /* ---------- FETCH ATTENDANCE (triggered by Filter button) ---------- */
//   const fetchAttendance = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const now = new Date();
//       const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
//         .toISOString()
//         .split('T')[0];
//       const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
//         .toISOString()
//         .split('T')[0];

//       const employeeIdToFetch = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;

//       const data = await getEmployeeAttendance(
//         startDate || defaultStart,
//         endDate || defaultEnd,
//         employeeIdToFetch,
//         '', // we do name search client-side
//         token
//       );

//       if (data.success) {
//         setAttendanceData(data.data || []);
//         setFilteredData(data.data || []);
//       } else {
//         setError('Failed to fetch attendance');
//       }
//     } catch (err) {
//       setError(err.error || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load + when Filter is clicked
//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // only on mount

//   /* ---------- INSTANT CLIENT-SIDE NAME SEARCH ---------- */
//   useEffect(() => {
//     const filtered = attendanceData.filter(record =>
//       (record.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredData(filtered);
//     setCurrentPage(1);
//   }, [searchQuery, attendanceData]);

//   /* ---------- HANDLE FILTER BUTTON (Date + Employee) ---------- */
//   const handleFilter = () => {
//     setCurrentPage(1);
//     fetchAttendance();
//   };

//   /* ---------- EXPORT TO EXCEL (uses currently filtered data) ---------- */
//   const exportToExcel = () => {
//     const exportData = filteredData.map((record) => ({
//       'Employee Name': record.fullName,
//       'Employee Code': record.employeeCode,
//       Date: record.date,
//       'Check In': record.check_in ? formatUTCTime(record.check_in) : '-',
//       'Check Out': record.check_out ? formatUTCTime(record.check_out) : '-',
//       'Work Hours': record.work_hours ? record.work_hours.toFixed(2) : '0.00',
//       Status: record.status,
//       'Late By (minutes)': cleanDisplay(record.lateBy),
//       'Overtime (hours)': cleanDisplay(record.overtimeHours),
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
//     XLSX.writeFile(wb, `attendance_${startDate || 'start'}_to_${endDate || 'end'}.xlsx`);
//   };

//   /* ---------- PAGINATION ---------- */
//   const indexOfLast = currentPage * recordsPerPage;
//   const indexOfFirst = indexOfLast - recordsPerPage;
//   const currentRecords = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / recordsPerPage);

//   const prev = () => currentPage > 1 && setCurrentPage(p => p - 1);
//   const next = () => currentPage < totalPages && setCurrentPage(p => p + 1);

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
//           />
//         </div>

//         {allowedRoles.includes(user.role) && (
//           <>
//             <div className="form-group">
//               <label htmlFor="employee">Employee</label>
//               <select
//                 id="employee"
//                 value={selectedEmployee}
//                 onChange={(e) => setSelectedEmployee(e.target.value)}
//                 className="employee-input"
//               >
//                 <option value="">All Employees</option>
//                 {employees.map((emp) => (
//                   <option key={emp._id} value={emp._id}>
//                     {emp.fullName}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label htmlFor="searchName">Search by Name</label>
//               <input
//                 type="text"
//                 id="searchName"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="employee-input"
//                 placeholder="Type name (instant search)"
//               />
//             </div>
//           </>
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

//       {filteredData.length === 0 ? (
//         <div className="employee-message">No attendance records found.</div>
//       ) : (
//         <>
//           <div className="attendance-table-container">
//             <table className="attendance-table">
//               <thead>
//                 <tr>
//                   <th>Employee Name</th>
//                   <th>Employee Code</th>
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
//                 {currentRecords.map((record, idx) => (
//                   <tr key={`${record.employeeId}-${record.date}-${idx}`}>
//                     <td>{record.fullName}</td>
//                     <td>{record.employeeCode}</td>
//                     <td>{record.date}</td>
//                     <td>{record.check_in ? formatUTCTime(record.check_in) : '-'}</td>
//                     <td>{record.check_out ? formatUTCTime(record.check_out) : '-'}</td>
//                     <td>{record.work_hours ? record.work_hours.toFixed(2) : '0.00'}</td>
//                     <td>{record.status}</td>
//                     <td>{cleanDisplay(record.lateBy)}</td>
//                     <td>{cleanDisplay(record.overtimeHours)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredData.length > recordsPerPage && (
//             <div className="pagination-controls">
//               <button onClick={prev} disabled={currentPage === 1} className="pagination-button">
//                 Previous
//               </button>
//               <span className="pagination-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button onClick={next} disabled={currentPage === totalPages} className="pagination-button">
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



import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getEmployeeAttendance } from "../api/attendance";
import { getEmployees } from "../api/employee";
import * as XLSX from "xlsx";
import "../styles/Attendance.css";

const AttendanceList = () => {
  const { user } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  const allowedRoles = [
    "Super Admin",
    "C-Level Executive",
    "Company Admin",
    "HR Manager",
  ];

  const formatLocalTime = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const cleanDisplay = (value, unit = 'mins') => {
    if (typeof value !== 'number' || value <= 0) {
      return `0 ${unit}`;
    }
    if (unit === 'hr') {
      return `${value.toFixed(2)} hr`;
    }
    return `${Math.round(value)} ${unit}`;
  };

  /** ---------------- FETCH EMPLOYEES ---------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await getEmployees(token);
        if (response.success && Array.isArray(response.data)) {
          setEmployees(response.data);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    if (user && allowedRoles.includes(user.role)) fetchEmployees();
  }, [user]);

  /** ---------------- FETCH ATTENDANCE ---------------- */
  const fetchAttendance = async () => {
    setLoading(true);
    setError("");

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const now = new Date();
      const defaultStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];

      const defaultEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];

      const employeeIdToFetch = allowedRoles.includes(user.role)
        ? selectedEmployee
        : user.employeeId;

      /** FIXED: Correct API call — no token in query */
      const data = await getEmployeeAttendance(
        startDate || defaultStart,
        endDate || defaultEnd,
        employeeIdToFetch,
        token
      );

      if (data.success) {
        setAttendanceData(data.data || []);
        setFilteredData(data.data || []);
      } else {
        setError("Failed to fetch attendance");
      }
    } catch (err) {
      setError("Something went wrong while loading attendance");
    } finally {
      setLoading(false);
    }
  };

  /** Initial load */
  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, []);

  /** ---------------- INSTANT CLIENT-SIDE SEARCH ---------------- */
  useEffect(() => {
    const filtered = attendanceData.filter((record) =>
      (record.fullName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, attendanceData]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchAttendance();
  };

  /** ---------------- EXPORT ---------------- */
  const exportToExcel = () => {
    const exportData = filteredData.map((record) => ({
      "Employee Name": record.fullName,
      "Employee Code": record.employeeCode,
      Date: record.date,
      "Check In": record.check_in
        ? formatUTCTime(record.check_in)
        : "-",
      "Check Out": record.check_out
        ? formatUTCTime(record.check_out)
        : "-",
      "Work Hours": record.work_hours
        ? record.work_hours.toFixed(2)
        : "0.00",
      Status: record.status,
      "Late By (minutes)": cleanDisplay(record.lateBy),
      "Overtime (hours)": cleanDisplay(record.overtimeHours),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(
      wb,
      `attendance_${startDate || "start"}_to_${endDate || "end"}.xlsx`
    );
  };

  /** ---------------- PAGINATION ---------------- */
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  if (loading) return <div className="employee-message">Loading...</div>;
  if (error)
    return (
      <div className="employee-message employee-error">{error}</div>
    );

  return (
    <div className="attendance-container">
      <h2 className="employee-title">Attendance</h2>

      <div className="attendance-filters">
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {user && allowedRoles.includes(user.role) && (
          <>
            <div className="form-group">
              <label>Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Search Name</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Type name..."
              />
            </div>
          </>
        )}

        <div className="filter-buttons">
          <button onClick={handleFilter} className="employee-button">Filter</button>
          <button onClick={exportToExcel} className="employee-button">Export</button>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Date</th>
              <th>In</th>
              <th>Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Late</th>
              <th>OT</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((record, idx) => (
              <tr key={`${record.employeeId}-${record.date}-${idx}`}>
                <td>{record.fullName}</td>
                <td>{record.employeeCode}</td>
                <td>{record.date}</td>
                <td>
                  {record.check_in
                    ? formatLocalTime(record.check_in)
                    : "-"}
                </td>
                <td>
                  {record.check_out
                    ? formatLocalTime(record.check_out)
                    : "-"}
                </td>
                <td>
                  {record.work_hours
                    ? record.work_hours.toFixed(2)
                    : "0.00"}
                </td>
                <td>{record.status}</td>
                <td>{cleanDisplay(record.lateBy, 'mins')}</td>
                <td>{cleanDisplay(record.overtimeHours, 'hr')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length > recordsPerPage && (
        <div className="pagination-controls">
          <button
            onClick={() =>
              setCurrentPage((p) => Math.max(1, p - 1))
            }
            className="pagination-button"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
            className="pagination-button"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
