// // import { useContext } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { AuthContext } from '../context/AuthContext';
// // import { Home, Users, Calendar, Lock, LogOut } from 'lucide-react';
// // import '../styles/Navbar.css';

// // const Navbar = () => {
// //   const { user, logout } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     navigate('/login');
// //   };

// //   return (
// //     <nav className="navbar">
// //       <div className="navbar-content">
// //         <div className="navbar-logo">
// //           <img src="/logo-al.svg" alt="Alawaf HRMS Logo" className="nav-logo" />
// //         </div>
// //         <ul className="nav-links">
// //           <li>
// //             <Link to="/dashboard" className="nav-link">
// //               <Home className="nav-icon" />
// //               Dashboard
// //             </Link>
// //           </li>
// //           {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
// //             <li>
// //               <Link to="/employees" className="nav-link">
// //                 <Users className="nav-icon" />
// //                 Employees
// //               </Link>
// //             </li>
// //           )}
// //           <li>
// //             <Link to="/attendance" className="nav-link">
// //               <Calendar className="nav-icon" />
// //               Attendance
// //             </Link>
// //           </li>
// //           <li>
// //             <Link to="/change-password" className="nav-link">
// //               <Lock className="nav-icon" />
// //               Change Password
// //             </Link>
// //           </li>
// //           <li>
// //             <button onClick={handleLogout} className="nav-link nav-button">
// //               <LogOut className="nav-icon" />
// //               Logout
// //             </button>
// //           </li>
// //         </ul>
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;



// import { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { Home, Users, Calendar, Lock, LogOut, Briefcase } from 'lucide-react';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-content">
//         <div className="navbar-logo">
//           <img src="/logo-al.svg" alt="Alawaf HRMS Logo" className="nav-logo" />
//         </div>
//         <ul className="nav-links">
//           <li>
//             <Link to="/dashboard" className="nav-link">
//               <Home className="nav-icon" />
//               Dashboard
//             </Link>
//           </li>
//           {(user?.role === 'Super Admin' || user?.role === 'HR Manager') && (
//             <li>
//               <Link to="/employees" className="nav-link">
//                 <Users className="nav-icon" />
//                 Employees
//               </Link>
//             </li>
//           )}
//           <li>
//             <Link to="/attendance" className="nav-link">
//               <Calendar className="nav-icon" />
//               Attendance
//             </Link>
//           </li>
//           <li>
//             <Link to="/leave" className="nav-link">
//               <Briefcase className="nav-icon" />
//               Leave
//             </Link>
//           </li>
//           <li>
//             <Link to="/change-password" className="nav-link">
//               <Lock className="nav-icon" />
//               Change Password
//             </Link>
//           </li>
//           <li>
//             <button onClick={handleLogout} className="nav-link nav-button">
//               <LogOut className="nav-icon" />
//               Logout
//             </button>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Users, Calendar, Briefcase, Lock, LogOut, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

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

  const defaultAvatar = 'https://via.placeholder.com/40?text=User';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">
          <img src="/logo-al.svg" alt="Alawaf HRMS Logo" className="nav-logo" />
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
          {(user?.role === 'Super Admin' || user?.role === 'HR Manager' || user?.role === 'Company Admin') && (
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
          <li className="user-dropdown">
            <div className="user-profile" onClick={toggleDropdown}>
              <img
                src={user?.profileImage || defaultAvatar}
                alt="User Profile"
                className="user-image"
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