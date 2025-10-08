import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, Calendar, Briefcase, Laptop, Lock, LogOut, Menu, X, FileText } from 'lucide-react';
import '../styles/Navbar.css';

// Use a local default avatar image (place this in your public folder or src/assets)
const defaultAvatar = '/default-avatar.png';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Determine the profile image to use
  const profileImage = user?.profileImage || defaultAvatar;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src="Kloud_Technologies_Logo.svg" alt="Alawaf HRMS Logo" className="nav-logo" />
        </div>
        <button className="hamburger-menu" onClick={toggleMenu}>
          {isMenuOpen ? <X className="nav-icon" /> : <Menu className="nav-icon" />}
        </button>
        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <li>
            <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>
              <Home className="nav-icon" />
              Dashboard
            </Link>
          </li>
          {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
            <li>
              <Link to="/employees" className="nav-link" onClick={toggleMenu}>
                <Users className="nav-icon" />
                Employees
              </Link>
            </li>
          )}
          <li>
            <Link to="/attendance" className="nav-link" onClick={toggleMenu}>
              <Calendar className="nav-icon" />
              Attendance
            </Link>
          </li>
          <li>
            <Link to="/leave" className="nav-link" onClick={toggleMenu}>
              <Briefcase className="nav-icon" />
              Leave
            </Link>
          </li>
          <li>
            <Link to="/remote" className="nav-link" onClick={toggleMenu}>
              <Laptop className="nav-icon" />
              Remote
            </Link>
          </li>
          {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
            <li>
              <Link to="/documents" className="nav-link" onClick={toggleMenu}>
                <FileText className="nav-icon" />
                Documents
              </Link>
            </li>
          )}
          <li className="user-dropdown">
            <div className="user-profile" onClick={toggleDropdown}>
              <img
                src={profileImage}
                alt="User Profile"
                className="user-image"
                onError={(e) => {
                  if (e.target.src !== defaultAvatar) {
                    e.target.src = defaultAvatar;
                  }
                }}
              />
              <span className="user-name">{user?.fullName || 'User'}</span>
            </div>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profile" className="dropdown-item" onClick={toggleMenu}>
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/change-password" className="dropdown-item" onClick={toggleMenu}>
                    Change Password
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => { handleLogout(); toggleMenu(); }}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;