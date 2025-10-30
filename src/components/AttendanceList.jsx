import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEmployeeAttendance } from '../api/attendance';
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

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;
        const params = {
          startDate: startDate || defaultStart,
          endDate: endDate || defaultEnd,
          employeeId,
        };

        const data = await getEmployeeAttendance(params.startDate, params.endDate, params.employeeId, token);
        if (data.success) {
          setAttendanceData(data.data);
          setEmployees(data.data);
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

  const handleFilter = () => {
    setCurrentPage(1);
    setLoading(true);
    setError('');
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const employeeId = allowedRoles.includes(user.role) ? selectedEmployee : user.employeeId;
        const data = await getEmployeeAttendance(startDate, endDate, employeeId, token);
        if (data.success) {
          setAttendanceData(data.data);
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
  };

  const exportToExcel = () => {
    const exportData = attendanceData.flatMap(employee =>
      employee.attendance.map(record => ({
        'Employee Name': employee.fullName,
        'Device User ID': employee.deviceUserId,
        'Date': record.date,
        'Check In': record.check_in,
        'Check Out': record.check_out,
        'Work Hours': record.work_hours,
        'Status': record.status,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, `attendance_${startDate || 'start'}_to_${endDate || 'end'}.xlsx`);
  };

  // Pagination logic
  const flatAttendance = attendanceData.flatMap(employee =>
    employee.attendance.map(record => ({
      ...record,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      deviceUserId: employee.deviceUserId,
    }))
  );
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = flatAttendance.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(flatAttendance.length / recordsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
            placeholder="Select start date"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="employee-input"
            placeholder="Select end date"
          />
        </div>
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
                <option key={employee.employeeId} value={employee.employeeId}>
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
      {flatAttendance.length === 0 ? (
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
                  <th>Leave Type</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr key={`${record.employeeId}-${record.date}-${index}`}>
                    <td>{record.fullName}</td>
                    <td>{record.deviceUserId}</td>
                    <td>{record.date}</td>
                    <td>{record.check_in || '-'}</td>
                    <td>{record.check_out || '-'}</td>
                    <td>{record.work_hours.toFixed(2)}</td>
                    <td>{record.status}</td>
                    <td>{record.leave_type || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {flatAttendance.length > recordsPerPage && (
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

export default AttendanceList;