import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index             element={<Dashboard />} />
        <Route path="profile"        element={<Profile />} />
        <Route path="timesheet"      element={<Timesheet />} />
        <Route path="tasks"          element={<Tasks />} />
        <Route path="leave"          element={<Leave />} />
        <Route path="expenses"       element={<Expenses />} />
        <Route path="news"           element={<News />} />
        <Route path="it"             element={<IT />} />
        <Route path="hr"             element={<HR />} />
        <Route path="posting"        element={<Posting />} />
        <Route path="leave-approval" element={<LeaveApproval />} />
        <Route path="set-task"       element={<SetTask />} />
        <Route path="it-management"  element={<ITManagement />} />
        <Route path="hr-management"  element={<HRManagement />} />
        <Route path="admin"              element={<AdminDashboard />} />
        <Route path="admin/employees"    element={<ManageEmployees />} />
        <Route path="admin/add-employee" element={<AddEmployee />} />
        <Route path="admin/client-codes" element={<ClientCodes />} />
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
