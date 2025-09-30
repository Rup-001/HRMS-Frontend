import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLinks = {
    'Super Admin': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/employees', label: 'Employees' },
      { path: '/employees/create', label: 'Create Employee' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/companies', label: 'Manage Companies' },
      { path: '/change-password', label: 'Change Password' },
    ],
    'C-Level Executive': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/reports', label: 'Reports' },
      { path: '/change-password', label: 'Change Password' },
    ],
    'Company Admin': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/employees', label: 'Employees' },
      { path: '/employees/create', label: 'Create Employee' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/change-password', label: 'Change Password' },
    ],
    'HR Manager': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/employees', label: 'Employees' },
      { path: '/employees/create', label: 'Create Employee' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/change-password', label: 'Change Password' },
    ],
    'Manager': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/team', label: 'Team' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/change-password', label: 'Change Password' },
    ],
    'Employee': [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/profile', label: 'Profile' },
      { path: '/attendance', label: 'Attendance' },
      { path: '/change-password', label: 'Change Password' },
    ],
  };

  const links = roleLinks[user.role] || [];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo.svg" alt="Company Logo" className="navbar-logo" />
      </div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-user">
        <span>{user.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;