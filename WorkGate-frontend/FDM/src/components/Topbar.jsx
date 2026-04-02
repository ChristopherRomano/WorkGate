import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from './Modal';
import styles from './Topbar.module.css';
import '../styles/components.css';

const TITLES = {
  '/':            ['Dashboard', 'Welcome back, Jamie · Thursday 2 April 2026'],
  '/profile':     ['My Profile', 'Manage your personal details and skills'],
  '/timesheet':   ['Timesheet', 'Log and submit your working hours'],
  '/tasks':       ['Tasks', 'Your assigned and upskilling tasks'],
  '/leave':       ['Annual Leave', 'Request and track your leave'],
  '/expenses':    ['Expense Claims', 'Submit and monitor expense claims'],
  '/news':        ['News Feed', 'Company announcements and updates'],
  '/leaderboard': ['Leaderboard', 'Top consultants by skill score'],
  '/it':          ['IT Support', 'Raise tickets and browse the knowledge base'],
  '/hr':          ['HR Reports', 'Submit feedback and reports to HR'],
};

export default function Topbar({ onNewLeave, onNewIT }) {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] ?? ['WorkGate', ''];

  return (
    <header className={styles.topbar}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
      <div className={styles.actions}>
        <button className="btn btn-ghost btn-sm" onClick={onNewIT}>🖥 New IT Ticket</button>
        <button className="btn btn-primary btn-sm" onClick={onNewLeave}>+ Request Leave</button>
      </div>
    </header>
  );
}
