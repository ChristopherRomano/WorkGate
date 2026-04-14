import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Topbar.module.css';
import fdmLogo from '../assets/fdm-logo.png';
import '../styles/components.css';

const PAGE_META = {
  '/app':                      { title: 'Dashboard',          sub: (name) => `Welcome back, ${name}` },
  '/app/profile':              { title: 'My Profile',         sub: () => 'Manage your personal details and skills' },
  '/app/timesheet':            { title: 'Timesheet',          sub: () => 'Log and submit your working hours' },
  '/app/tasks':                { title: 'Tasks',              sub: () => 'Your assigned and upskilling tasks' },
  '/app/leave':                { title: 'Annual Leave',       sub: () => 'Request and track your leave' },
  '/app/expenses':             { title: 'Expense Claims',     sub: () => 'Submit and monitor expense claims' },
  '/app/news':                 { title: 'News Feed',          sub: () => 'Company announcements and updates' },
  '/app/it':                   { title: 'IT Support',         sub: () => 'Raise tickets and browse the knowledge base' },
  '/app/hr':                   { title: 'HR Reports',         sub: () => 'Submit feedback and reports to HR' },
  '/app/posting':              { title: 'Create Posting',     sub: () => 'Publish news and announcements' },
  '/app/leave-approval':       { title: 'Leave Approvals',    sub: () => 'Review and action employee leave requests' },
  '/app/set-task':             { title: 'Set Task',           sub: () => 'Assign tasks to employees on your team' },
  '/app/it-management':        { title: 'IT Ticket Management', sub: () => 'View, claim and resolve IT support tickets' },
  '/app/hr-management':        { title: 'HR Report Management', sub: () => 'Review and action employee HR reports' },
  '/app/admin':                { title: 'Admin Dashboard',    sub: () => 'System overview and quick actions' },
  '/app/admin/employees':      { title: 'Manage Employees',   sub: () => 'Edit permissions, tags, and account status' },
  '/app/admin/add-employee':   { title: 'Add Employee',       sub: () => 'Create a new user account' },
  '/app/admin/client-codes':   { title: 'Client Codes',       sub: () => 'Add and remove client project codes' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const meta = PAGE_META[pathname] ?? { title: 'WorkGate', sub: () => '' };
  const firstName = currentUser?.name?.split(' ')[0] ?? '';

  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{meta.title}</div>
        <div className={styles.subtitle}>{meta.sub(firstName)}</div>
      </div>
      <div className={styles.actions}>
        <img className={styles.logo} src={fdmLogo} alt="FDM logo" />
      </div>
    </header>
  );
}
