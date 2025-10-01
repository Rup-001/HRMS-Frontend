// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Dashboard.css';

// const Dashboard = () => {
//   const { user } = useContext(AuthContext);

//   // Mock data for different roles
//   const mockData = {
//     'Super Admin': {
//       users: 1000,
//       companies: 50,
//       activeSessions: 200,
//     },
//     'C-Level Executive': {
//       revenue: '$1.2M',
//       projects: 15,
//       growth: '12%',
//     },
//     'Company Admin': {
//       employees: 200,
//       departments: 10,
//       activeTasks: 45,
//     },
//     'HR Manager': {
//       newHires: 12,
//       pendingReviews: 8,
//       attendanceRate: '95%',
//     },
//     'Manager': {
//       teamMembers: 10,
//       tasksCompleted: 30,
//       pendingTasks: 5,
//     },
//     'Employee': {
//       tasksAssigned: 8,
//       hoursWorked: 32,
//       leaveBalance: 10,
//     },
//   };

//   const data = mockData[user.role] || {};

//   return (
//     <div className="dashboard-container">
//       <h2>{user.role} Dashboard</h2>
//       <div className="dashboard-stats">
//         {Object.entries(data).map(([key, value]) => (
//           <div key={key} className="stat-card">
//             <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
//             <p>{value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Enhanced demo data for different roles
  const mockData = {
    'Super Admin': {
      totalUsers: 1200,
      activeCompanies: 60,
      activeSessions: 250,
      totalLeaveRequests: 150,
      complianceRate: '98%',
    },
    'C-Level Executive': {
      annualRevenue: '$1.5M',
      activeProjects: 20,
      growthRate: '15%',
      employeeRetention: '90%',
      pendingApprovals: 5,
    },
    'Company Admin': {
      totalEmployees: 250,
      departments: 12,
      activeTasks: 60,
      pendingLeaveRequests: 10,
      attendanceRate: '94%',
    },
    'HR Manager': {
      newHiresThisMonth: 15,
      pendingPerformanceReviews: 10,
      attendanceRate: '95%',
      openPositions: 5,
      leaveApprovalsPending: 8,
    },
    'Manager': {
      teamMembers: 12,
      tasksCompleted: 40,
      pendingTasks: 7,
      teamAttendanceRate: '93%',
      pendingLeaveApprovals: 3,
    },
    'Employee': {
      tasksAssigned: 10,
      hoursWorkedThisWeek: 35,
      leaveBalanceDays: 12,
      pendingLeaveRequests: 2,
      lastCheckIn: '2025-10-01 09:00 AM',
    },
  };

  const data = mockData[user.role] || {};

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome, {user.fullName || 'User'}!</h2>
      <h3 className="dashboard-subtitle">{user.role} Dashboard</h3>
      <div className="dashboard-stats">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="stat-card">
            <h4 className="card-title">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <p className="card-value">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;