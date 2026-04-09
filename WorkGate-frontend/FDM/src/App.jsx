import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Profile     from './pages/Profile';
import Timesheet   from './pages/Timesheet';
import Tasks       from './pages/Tasks';
import Leave       from './pages/Leave';
import Expenses    from './pages/Expenses';
import News        from './pages/News';
import IT          from './pages/IT';
import HR             from './pages/HR';
import Posting         from './pages/Posting';
import LeaveApproval   from './pages/LeaveApproval';
import SetTask         from './pages/SetTask';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Layout />}>
            <Route index        element={<Dashboard />} />
            <Route path="profile"     element={<Profile />} />
            <Route path="timesheet"   element={<Timesheet />} />
            <Route path="tasks"       element={<Tasks />} />
            <Route path="leave"       element={<Leave />} />
            <Route path="expenses"    element={<Expenses />} />
            <Route path="news"        element={<News />} />
            <Route path="it"          element={<IT />} />
            <Route path="hr"              element={<HR />} />
            <Route path="posting"         element={<Posting />} />
            <Route path="leave-approval"  element={<LeaveApproval />} />
            <Route path="set-task"        element={<SetTask />} />

          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
