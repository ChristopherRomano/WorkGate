import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hasPermission } from './permissions';
import Layout from './components/Layout';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import Profile        from './pages/Profile';
import Timesheet      from './pages/Timesheet';
import Tasks          from './pages/Tasks';
import Leave          from './pages/Leave';
import Expenses       from './pages/Expenses';
import News           from './pages/News';
import IT             from './pages/IT';
import HR             from './pages/HR';
import Posting        from './pages/Posting';
import LeaveApproval  from './pages/LeaveApproval';
import SetTask        from './pages/SetTask';
import AdminDashboard  from './pages/AdminDashboard';
import ManageEmployees from './pages/ManageEmployees';
import AddEmployee     from './pages/AddEmployee';
import ClientCodes     from './pages/ClientCodes';
import ITManagement    from './pages/ITManagement';
import HRManagement    from './pages/HRManagement';
import ExpenseApproval from './pages/ExpenseApproval';
import Settings from './pages/Settings';

function getDefaultAppRoute(role) {
  if (role === 'admin') return '/app/admin';
  if (role === 'ittech') return '/app/it-management';
  if (role === 'hr') return '/app/hr-management';
  return '/app';
}

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ permission, children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!hasPermission(currentUser.role, permission)) {
    return <Navigate to={getDefaultAppRoute(currentUser.role)} replace />;
  }
  return children;
}

function AppHome() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(currentUser.role, 'dashboard')) {
    return <Navigate to={getDefaultAppRoute(currentUser.role)} replace />;
  }

  return <Dashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Universally accessible once logged in */}
        <Route index           element={<AppHome />} />
        <Route path="profile"  element={<RoleRoute permission="profile"><Profile /></RoleRoute>} />
        <Route path="settings" element={<RoleRoute permission="settings"><Settings /></RoleRoute>} />
        <Route path="news"     element={<RoleRoute permission="news"><News /></RoleRoute>} />

        {/* Employee base permissions */}
        <Route path="tasks"    element={<RoleRoute permission="tasks"><Tasks /></RoleRoute>} />
        <Route path="leave"    element={<RoleRoute permission="leave"><Leave /></RoleRoute>} />
        <Route path="expenses" element={<RoleRoute permission="expenses"><Expenses /></RoleRoute>} />
        <Route path="it"       element={<RoleRoute permission="it-support"><IT /></RoleRoute>} />
        <Route path="hr"       element={<RoleRoute permission="hr-support"><HR /></RoleRoute>} />

        {/* Consultant + Manager (extends Employee) */}
        <Route path="timesheet" element={<RoleRoute permission="timesheet"><Timesheet /></RoleRoute>} />

        {/* Manager only (extends Employee) */}
        <Route path="leave-approval"    element={<RoleRoute permission="leave-approval"><LeaveApproval /></RoleRoute>} />
        <Route path="expense-approval"  element={<RoleRoute permission="expense-approval"><ExpenseApproval /></RoleRoute>} />
        <Route path="set-task"          element={<RoleRoute permission="set-task"><SetTask /></RoleRoute>} />
        <Route path="posting"           element={<RoleRoute permission="posting"><Posting /></RoleRoute>} />

        {/* ItTechnician only (extends Employee) */}
        <Route path="it-management" element={<RoleRoute permission="it-management"><ITManagement /></RoleRoute>} />

        {/* HrRep only (extends Employee) */}
        <Route path="hr-management" element={<RoleRoute permission="hr-management"><HRManagement /></RoleRoute>} />

        {/* Administrator only (separate User branch) */}
        <Route path="admin"                element={<RoleRoute permission="admin-dashboard"><AdminDashboard /></RoleRoute>} />
        <Route path="admin/employees"      element={<RoleRoute permission="manage-employees"><ManageEmployees /></RoleRoute>} />
        <Route path="admin/add-employee"   element={<RoleRoute permission="add-employee"><AddEmployee /></RoleRoute>} />
        <Route path="admin/client-codes"   element={<RoleRoute permission="client-codes"><ClientCodes /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
