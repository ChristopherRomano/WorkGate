import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../permissions';
import styles from './Sidebar.module.css';

/**
 * Each nav item declares a `permission` key.
 * Visibility is determined by hasPermission(role, permission) — which reflects
 * the Java class hierarchy (Consultant ⊃ Employee, Manager ⊃ Employee, etc.).
 */
const NAV = [
  { section: 'Overview', items: [
    { to: '/app',         icon: '◈', label: 'Dashboard',  permission: 'dashboard',  mobile: true },
    { to: '/app/profile', icon: '◉', label: 'My Profile', permission: 'profile',    mobile: true },
  ]},
  { section: 'Work', items: [
    { to: '/app/timesheet', icon: '⏱', label: 'Timesheet', permission: 'timesheet' },
    { to: '/app/tasks',     icon: '✓', label: 'Tasks',     permission: 'tasks',     mobile: true },
    { to: '/app/leave',     icon: '📅', label: 'Leave',    permission: 'leave' },
    { to: '/app/expenses',  icon: '£', label: 'Expenses',  permission: 'expenses' },
  ]},
  { section: 'Management', roleSection: 'manager', items: [
    { to: '/app/leave-approval',   icon: '📋', label: 'Leave Approvals',  permission: 'leave-approval' },
    { to: '/app/expense-approval', icon: '💸', label: 'Expense Approval', permission: 'expense-approval' },
    { to: '/app/set-task',         icon: '✎',  label: 'Set Task',         permission: 'set-task' },
    { to: '/app/posting',          icon: '📝', label: 'Create Posting',   permission: 'posting' },
  ]},
  { section: 'IT Operations', roleSection: 'ittech', items: [
    { to: '/app/it-management', icon: '🖥', label: 'Ticket Management', permission: 'it-management' },
  ]},
  { section: 'HR Operations', roleSection: 'hr', items: [
    { to: '/app/hr-management', icon: '📋', label: 'Report Management', permission: 'hr-management' },
  ]},
  { section: 'Admin', roleSection: 'admin', items: [
    { to: '/app/admin',                icon: '⚙', label: 'Admin Dashboard',  permission: 'admin-dashboard' },
    { to: '/app/admin/employees',      icon: '👥', label: 'Manage Employees', permission: 'manage-employees' },
    { to: '/app/admin/add-employee',   icon: '➕', label: 'Add Employee',     permission: 'add-employee' },
    { to: '/app/admin/client-codes',   icon: '🏢', label: 'Client Codes',     permission: 'client-codes' },
  ]},
  { section: 'Company', items: [
    { to: '/app/news', icon: '📢', label: 'News Feed', permission: 'news', badge: 2 },
  ]},
  { section: 'Support', items: [
    { to: '/app/it', icon: '🖥', label: 'IT Support', permission: 'it-support' },
    { to: '/app/hr', icon: '📋', label: 'HR Reports', permission: 'hr-support' },
  ]},
];

const ROLE_TAGS = {
  employee:   'EMPLOYEE',
  consultant: 'CONSULTANT',
  manager:    'MANAGER',
  ittech:     'IT TECHNICIAN',
  hr:         'HR REPRESENTATIVE',
  admin:      'ADMINISTRATOR',
};

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!currentUser) return null;

  const can = (permission) => hasPermission(currentUser.role, permission);

  const mobileItems = NAV
    .flatMap(s => s.items)
    .filter(item => item.mobile && can(item.permission));

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>WorkGate</div>
          <div className={styles.logoSub}>Employee Portal</div>
        </div>

        <div className={styles.userBadge}>
          <div className={styles.avatar}>{currentUser.initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{currentUser.name}</div>
            <span className={styles.roleTag}>{ROLE_TAGS[currentUser.role] ?? currentUser.role.toUpperCase()}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ section, roleSection, items }) => {
            const visible = items.filter(item => can(item.permission));
            if (visible.length === 0) return null;

            const sectionLabelClass = roleSection
              ? `${styles.sectionLabel} ${styles[`sectionLabel${roleSection}`]}`
              : styles.sectionLabel;
            const sectionWrapperClass = roleSection && roleSection === currentUser.role
              ? `${styles.sectionWrapper} ${styles[`sectionWrapper${roleSection}`]}`
              : styles.sectionWrapper;

            return (
              <div key={section} className={sectionWrapperClass}>
                <div className={sectionLabelClass}>{section}</div>
                {visible.map(({ to, icon, label, badge }) => {
                  const itemClass = roleSection && roleSection === currentUser.role
                    ? `${styles.navItem} ${styles[`navItem${roleSection}`]}`
                    : styles.navItem;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === '/app' || to === '/app/admin'}
                      className={({ isActive }) => `${itemClass} ${isActive ? styles.active : ''}`}
                    >
                      <span className={styles.navIcon}>{icon}</span>
                      {label}
                      {badge != null && <span className={styles.navBadge}>{badge}</span>}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className={styles.bottom}>
          <NavLink
            to="/app/settings"
            className={({ isActive }) => `${styles.settingsShortcut} ${isActive ? styles.settingsShortcutActive : ''}`}
          >
            Settings
          </NavLink>
          <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {mobileItems.length > 0 && (
        <nav className={styles.mobileNav}>
          {mobileItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/app'}
              className={({ isActive }) => `${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`}
            >
              <span className={styles.mobileNavIcon}>{icon}</span>
              <span className={styles.mobileNavLabel}>{label === 'My Profile' ? 'Profile' : label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </>
  );
}
