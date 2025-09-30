import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Mock data for different roles
  const mockData = {
    'Super Admin': {
      users: 1000,
      companies: 50,
      activeSessions: 200,
    },
    'C-Level Executive': {
      revenue: '$1.2M',
      projects: 15,
      growth: '12%',
    },
    'Company Admin': {
      employees: 200,
      departments: 10,
      activeTasks: 45,
    },
    'HR Manager': {
      newHires: 12,
      pendingReviews: 8,
      attendanceRate: '95%',
    },
    'Manager': {
      teamMembers: 10,
      tasksCompleted: 30,
      pendingTasks: 5,
    },
    'Employee': {
      tasksAssigned: 8,
      hoursWorked: 32,
      leaveBalance: 10,
    },
  };

  const data = mockData[user.role] || {};

  return (
    <div className="dashboard-container">
      <h2>{user.role} Dashboard</h2>
      <div className="dashboard-stats">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="stat-card">
            <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;