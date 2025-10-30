import InitialSetupPage from './pages/InitialSetupPage';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeCreatePage from './pages/EmployeeCreatePage';
import EmployeeUpdatePage from './pages/EmployeeUpdatePage';
import CompanyCreatePage from './pages/CompanyCreatePage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AttendanceListPage from './pages/AttendanceListPage';
import AttendanceAdjustmentRequestPage from './pages/AttendanceAdjustmentRequestPage';
import LeavePolicyPage from './pages/LeavePolicyPage';
import LeaveEntitlementPage from './pages/LeaveEntitlementPage';
import CreateDepartmentPage from './pages/CreateDepartmentPage';
import CreateDesignationPage from './pages/CreateDesignationPage';
import LeaveList from './components/LeaveList';
import LeaveSummaryPage from './pages/LeaveSummaryPage';
import RemoteList from './components/RemoteList';
import ProfilePage from './pages/ProfilePage';
import DocumentListPage from './pages/DocumentListPage';
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

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        // element: <PublicRoute><HomePage /></PublicRoute>,
      },
      {
        path: '/login',
        element: <PublicRoute><LoginPage /></PublicRoute>,
      },
      {
        path: '/initial-setup',
        element: <PublicRoute><InitialSetupPage /></PublicRoute>,
      },
      {
        path: '/accept-invitation',
        element: <PublicRoute><AcceptInvitationPage /></PublicRoute>,
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
        path: '/companies/create',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin']}>
            <CompanyCreatePage />
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
        path: '/attendance/adjustments',
        element: (
          <ProtectedRoute allowedRoles={['Employee', 'Manager', 'HR Manager', 'Super Admin', 'Company Admin', 'C-Level Executive']}>
            <AttendanceAdjustmentRequestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/company',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager', 'C-Level Executive']}>
            <CompanyCreatePage />
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
      {
        path: '/leave',
        element: (
          <ProtectedRoute>
            <LeaveList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leave/policy',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager', 'C-Level Executive']}>
            <LeavePolicyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leave/entitlements',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager', 'C-Level Executive']}>
            <LeaveEntitlementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leave/summary',
        element: (
          <ProtectedRoute>
            <LeaveSummaryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/departments/create',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager']}>
            <CreateDepartmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/designations/create',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager']}>
            <CreateDesignationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/remote',
        element: (
          <ProtectedRoute>
            <RemoteList />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/documents',
        element: (
          <ProtectedRoute allowedRoles={['Super Admin', 'Company Admin', 'HR Manager', 'C-Level Executive']}>
            <DocumentListPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;