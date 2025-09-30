import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeCreatePage from './pages/EmployeeCreatePage';
import EmployeeUpdatePage from './pages/EmployeeUpdatePage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AttendanceListPage from './pages/AttendanceListPage';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user && allowedRoles) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/accept-invitation',
        element: <AcceptInvitationPage />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager']}>
            <EmployeeListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/create',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager']}>
            <EmployeeCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/employees/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager']}>
            <EmployeeUpdatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/attendance',
        element: (
          <ProtectedRoute>
            <AttendanceListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/change-password',
        element: (
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;