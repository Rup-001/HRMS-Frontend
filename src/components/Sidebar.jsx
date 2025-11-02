import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Calendar, FileText, Lock, LogOut, Menu, X, Briefcase, LayoutDashboard } from 'lucide-react';
import '../styles/Sidebar.css';

const defaultAvatar = '/default-avatar.png';

const Sidebar = ({ isSidebarOpen, toggleSidebar, isDesktop }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (!isDesktop && isSidebarOpen) {
      toggleSidebar(); // Close sidebar on link click for mobile
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const profileImage = user?.profileImage || defaultAvatar;

  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" onClick={handleLinkClick}>
          <img src="/Kloud_Technologies_Logo.svg" alt="Kloud Technologies Logo" className="sidebar-logo" />
        </Link>
        {!isDesktop && (
          <button className="close-sidebar" onClick={toggleSidebar}>
            <X className="nav-icon" />
          </button>
        )}
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/dashboard" className="sidebar-link" onClick={handleLinkClick}>
            <LayoutDashboard className="nav-icon" />
            Dashboard
          </Link>
        </li>
        {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
          <li>
            <Link to="/employees" className="sidebar-link" onClick={handleLinkClick}>
              <Users className="nav-icon" />
              Employees
            </Link>
          </li>
        )}
        <li>
          <Link to="/attendance" className="sidebar-link" onClick={handleLinkClick}>
            <Calendar className="nav-icon" />
            Attendance
          </Link>
        </li>
        {(user?.role === 'Employee' || user?.role === 'Manager' || user?.role === 'HR Manager' || user?.role === 'Super Admin' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
          <li>
            <Link to="/attendance/adjustments" className="sidebar-link" onClick={handleLinkClick}>
              <Calendar className="nav-icon" />
              Adjustments
            </Link>
          </li>
        )}
        {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
          <li>
            <Link to="/company" className="sidebar-link" onClick={handleLinkClick}>
              <Briefcase className="nav-icon" />
              Company
            </Link>
          </li>
        )}
        {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin') && (
          <li className="dropdown">
            <div className="sidebar-link dropdown-toggle" onClick={() => toggleDropdown('admin')}>
              <Briefcase className="nav-icon" />
              Admin Tools
            </div>
            {openDropdown === 'admin' && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/departments/create" className="dropdown-item" onClick={handleLinkClick}>
                    Create Department
                  </Link>
                </li>
                <li>
                  <Link to="/designations/create" className="dropdown-item" onClick={handleLinkClick}>
                    Create Designation
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}
        <li className="dropdown">
          <div className="sidebar-link dropdown-toggle" onClick={() => toggleDropdown('requests')}>
            <Briefcase className="nav-icon" />
            Requests
          </div>
          {openDropdown === 'requests' && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/leave" className="dropdown-item" onClick={handleLinkClick}>
                  Leave Requests
                </Link>
              </li>
              <li>
                <Link to="/remote" className="dropdown-item" onClick={handleLinkClick}>
                  Remote Requests
                </Link>
              </li>
              <li>
                <Link to="/leave/summary" className="dropdown-item" onClick={handleLinkClick}>
                  Leave Summary
                </Link>
              </li>
              {(user?.role === 'Super Admin' || user?.role === 'Company Admin' || user?.role === 'HR Manager' || user?.role === 'C-Level Executive') && (
                <>
                  <li>
                    <Link to="/leave/policy" className="dropdown-item" onClick={handleLinkClick}>
                      Leave Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/leave/entitlements" className="dropdown-item" onClick={handleLinkClick}>
                      Leave Entitlements
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </li>
        {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin' || user?.role === 'C-Level Executive') && (
          <li>
            <Link to="/documents" className="sidebar-link" onClick={handleLinkClick}>
              <FileText className="nav-icon" />
              Documents
            </Link>
          </li>
        )}
      </ul>
      {/* <div className="sidebar-footer">
        <li className="user-dropdown">
          <div className="user-profile" onClick={() => toggleDropdown('user')}>
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
          {openDropdown === 'user' && (
            <ul className="dropdown-menu">
              <li>
                <Link to="/profile" className="dropdown-item" onClick={handleLinkClick}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/change-password" className="dropdown-item" onClick={handleLinkClick}>
                  Change Password
                </Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => { handleLogout(); handleLinkClick(); }}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </li>
      </div> */}
    </div>
  );
};

export default Sidebar;
