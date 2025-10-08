// import { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Dashboard.css';

// const Dashboard = () => {
//   const { user, loading } = useContext(AuthContext);

//   // Enhanced demo data for different roles
//   const mockData = {
//     'Super Admin': {
//       totalUsers: 1200,
//       activeCompanies: 60,
//       activeSessions: 250,
//       totalLeaveRequests: 150,
//       complianceRate: '98%',
//     },
//     'C-Level Executive': {
//       annualRevenue: '$1.5M',
//       activeProjects: 20,
//       growthRate: '15%',
//       employeeRetention: '90%',
//       pendingApprovals: 5,
//     },
//     'Company Admin': {
//       totalEmployees: 250,
//       departments: 12,
//       activeTasks: 60,
//       pendingLeaveRequests: 10,
//       attendanceRate: '94%',
//     },
//     'HR Manager': {
//       newHiresThisMonth: 15,
//       pendingPerformanceReviews: 10,
//       attendanceRate: '95%',
//       openPositions: 5,
//       leaveApprovalsPending: 8,
//     },
//     'Manager': {
//       teamMembers: 12,
//       tasksCompleted: 40,
//       pendingTasks: 7,
//       teamAttendanceRate: '93%',
//       pendingLeaveApprovals: 3,
//     },
//     'Employee': {
//       tasksAssigned: 10,
//       hoursWorkedThisWeek: 35,
//       leaveBalanceDays: 12,
//       pendingLeaveRequests: 2,
//       lastCheckIn: '2025-10-01 09:00 AM',
//     },
//   };

//   if (loading) return <div className="dashboard-message">Loading...</div>;
//   if (!user) return <Navigate to="/login" />;

//   const data = mockData[user.role] || {};

//   return (
//     <div className="dashboard-container">
//       <h2 className="dashboard-title">Welcome, {user.fullName || 'User'}!</h2>
//       <h3 className="dashboard-subtitle">{user.role} Dashboard</h3>
//       <div className="dashboard-stats">
//         {Object.entries(data).map(([key, value]) => (
//           <div key={key} className="stat-card">
//             <h4 className="card-title">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
//             <p className="card-value">{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [employeeData, setEmployeeData] = useState(null);
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // fetch both APIs in parallel
        const [empRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/dashboard-stats`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        const empData = await empRes.json();
        const statsData = await statsRes.json();

        if (empData.success) setEmployeeData(empData.data);
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setFetching(false);
      }
    };

    if (user) fetchDashboard();
  }, [user]);

  if (loading || fetching) return <div className="dashboard-message">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {employeeData?.personalInfo.fullName || "User"}!</h2>
      <h3 className="dashboard-subtitle">{user.role} Dashboard</h3>

      {/* 🔹 Summary Stats Section */}
      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h4>Total Employees</h4>
            <p>{stats.totalEmployees}</p>
          </div>
          <div className="stat-card">
            <h4>Absent Today</h4>
            <p>{stats.absentToday}</p>
          </div>
          <div className="stat-card">
            <h4>Remote Today</h4>
            <p>{stats.remoteToday}</p>
          </div>
          <div className="stat-card">
            <h4>On Leave Today</h4>
            <p>{stats.leaveToday}</p>
          </div>
        </div>
      )}

      {/* 🔹 Personal Info */}
      {employeeData && (
        <div className="employee-section">
          <h3>Personal Info</h3>
          <ul>
            <li><b>Employee Code:</b> {employeeData.personalInfo.employeeCode}</li>
            <li><b>Designation:</b> {employeeData.personalInfo.designation}</li>
            <li><b>Department:</b> {employeeData.personalInfo.department}</li>
            <li><b>Joining Date:</b> {employeeData.personalInfo.joiningDate}</li>
            <li><b>Email:</b> {employeeData.personalInfo.email}</li>
            <li><b>Phone:</b> {employeeData.personalInfo.phone}</li>
          </ul>
        </div>
      )}

      {/* 🔹 Attendance */}
      {employeeData?.attendance?.length > 0 && (
        <div className="employee-section">
          <h3>Attendance (Last 7 Days)</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Work Hours</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.attendance.map((a, i) => (
                <tr key={i}>
                  <td>{a.date}</td>
                  <td>{a.check_in || "-"}</td>
                  <td>{a.check_out || "-"}</td>
                  <td>{a.status}</td>
                  <td>{a.work_hours || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Payslips */}
      {employeeData?.payslips?.length > 0 && (
        <div className="employee-section">
          <h3>Recent Payslips</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Generated</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.payslips.map((p, i) => (
                <tr key={i}>
                  <td>{p.month}</td>
                  <td>{p.netPay}</td>
                  <td>{p.status}</td>
                  <td>{p.generatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔹 Holidays */}
      {employeeData?.holidays?.length > 0 && (
        <div className="employee-section">
          <h3>Upcoming Holidays</h3>
          <ul>
            {employeeData.holidays.map((h, i) => (
              <li key={i}>
                {h.date} - {h.name} {h.isNational ? "(National)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
