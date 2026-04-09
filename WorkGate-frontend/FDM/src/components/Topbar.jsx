import { useLocation } from 'react-router-dom';
import styles from './Topbar.module.css';
import '../styles/components.css';

const TITLES = {
  '/app':              ['Dashboard', 'Welcome back, Jamie · Thursday 2 April 2026'],
  '/app/profile':      ['My Profile', 'Manage your personal details and skills'],
  '/app/timesheet':    ['Timesheet', 'Log and submit your working hours'],
  '/app/tasks':        ['Tasks', 'Your assigned and upskilling tasks'],
  '/app/leave':        ['Annual Leave', 'Request and track your leave'],
  '/app/expenses':     ['Expense Claims', 'Submit and monitor expense claims'],
  '/app/news':         ['News Feed', 'Company announcements and updates'],
  '/app/it':           ['IT Support', 'Raise tickets and browse the knowledge base'],
  '/app/hr':             ['HR Reports', 'Submit feedback and reports to HR'],
  '/app/leave-approval': ['Leave Approvals', 'Review and action employee leave requests'],
  '/app/set-task':       ['Set Task', 'Assign tasks to employees on your team'],
};

export default function Topbar() {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] ?? ['WorkGate', ''];

  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>

    </header>
  );
}
