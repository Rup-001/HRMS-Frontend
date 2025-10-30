import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu } from 'lucide-react';
import '../styles/Header.css'; // New CSS file for header

const Header = ({ toggleSidebar, isDesktop, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  const headerClass = isDesktop
    ? isSidebarOpen
      ? 'header-shifted'
      : 'header-collapsed'
    : '';

  return (
    <nav className={`header ${headerClass}`}>
      <div className="header-content">
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <Menu className="nav-icon" />
        </button>
        <div className="header-logo">
          <Link to="/dashboard">
            <img src="/Kloud_Technologies_Logo.svg" alt="Kloud Technologies Logo" className="nav-logo" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
