import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

// roles: which roles can see this item. Omit = visible to all authenticated users.
// mobile: true = show in mobile bottom nav
const NAV = [
  { section: 'Overview', items: [
    { to: '/app',         icon: '◈', label: 'Dashboard',  roles: ['employee', 'consultant', 'manager'], mobile: true },
    { to: '/app/profile', icon: '◉', label: 'My Profile', roles: ['employee', 'consultant', 'manager'], mobile: true },
  ]},
  { section: 'Work', items: [
    { to: '/app/timesheet', icon: '⏱', label: 'Timesheet', roles: ['consultant', 'manager'] },
    { to: '/app/tasks',     icon: '✓', label: 'Tasks',     roles: ['employee', 'consultant', 'manager'], badge: 3, mobile: true },
    { to: '/app/leave',     icon: '📅', label: 'Leave',    roles: ['employee', 'consultant', 'manager'] },
    { to: '/app/expenses',  icon: '£', label: 'Expenses',  roles: ['employee', 'consultant', 'manager'] },
  ]},
  { section: 'Company', items: [
    { to: '/app/news', icon: '📢', label: 'News Feed', roles: ['employee', 'consultant', 'manager', 'ittech', 'hr'], badge: 2 },
  ]},
  { section: 'Support', items: [
    { to: '/app/it', icon: '🖥', label: 'IT Support',  roles: ['employee', 'consultant', 'manager'] },
    { to: '/app/hr', icon: '📋', label: 'HR Reports',  roles: ['employee', 'consultant', 'manager'] },
  ]},
  { section: 'Management', items: [
    { to: '/app/leave-approval', icon: '📋', label: 'Leave Approvals', roles: ['manager'] },
    { to: '/app/set-task',       icon: '✎',  label: 'Set Task',        roles: ['manager'] },
    { to: '/app/posting',        icon: '📝', label: 'Create Posting',  roles: ['manager'] },
  ]},
  { section: 'IT Operations', items: [
    { to: '/app/it-management', icon: '🖥', label: 'Ticket Management', roles: ['ittech'] },
  ]},
  { section: 'HR Operations', items: [
    { to: '/app/hr-management', icon: '📋', label: 'Report Management', roles: ['hr'] },
  ]},
  { section: 'Admin', items: [
    { to: '/app/admin',                icon: '⚙', label: 'Admin Dashboard',  roles: ['admin'] },
    { to: '/app/admin/employees',      icon: '👥', label: 'Manage Employees', roles: ['admin'] },
    { to: '/app/admin/add-employee',   icon: '➕', label: 'Add Employee',     roles: ['admin'] },
    { to: '/app/admin/client-codes',   icon: '🏢', label: 'Client Codes',     roles: ['admin'] },

  ]},
];

const ROLE_TAGS = {
  employee:   'EMPLOYEE',
  consultant: 'CONSULTANT · DEPLOYED',
  manager:    'MANAGER',
  ittech:     'IT TECHNICIAN',
  hr:         'HR REPRESENTATIVE',
  admin:      'ADMINISTRATOR',
};

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  const mobileItems = NAV
    .flatMap(s => s.items)
    .filter(item => item.mobile && (!item.roles || item.roles.includes(currentUser.role)));

  return (
    <>
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>WorkGate</div>
        <div className={styles.logoSub}>Employee Portal</div>
      </div>

      {/* User badge */}
      <div className={styles.userBadge}>
        <div className={styles.avatar}>{currentUser.initials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{currentUser.name}</div>
          <span className={styles.roleTag}>{ROLE_TAGS[currentUser.role] ?? currentUser.role.toUpperCase()}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV.map(({ section, items }) => {
          const visible = items.filter(item => !item.roles || item.roles.includes(currentUser.role));
          if (visible.length === 0) return null;
          return (
            <div key={section}>
              <div className={styles.sectionLabel}>{section}</div>
              {visible.map(({ to, icon, label, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/app' || to === '/app/admin'}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.navIcon}>{icon}</span>
                  {label}
                  {badge != null && (
                    <span className={styles.navBadge}>{badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.settingsWidget}>
          <div className={styles.settingsLabel}>Appearance</div>
          <div className={styles.themeButtons}>
            <button
              className={`${styles.themeBtn} ${theme === 'light' ? styles.themeBtnActive : ''}`}
              onClick={() => setTheme('light')}
            >
              ◑ Light
            </button>
            <button
              className={`${styles.themeBtn} ${theme === 'dark' ? styles.themeBtnActive : ''}`}
              onClick={() => setTheme('dark')}
            >
              ● Dark
            </button>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
    </aside>

    {/* Mobile Bottom Nav — employee / consultant / manager only */}
    {mobileItems.length > 0 && <nav className={styles.mobileNav}>
      {mobileItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/app'}
          className={({ isActive }) =>
            `${styles.mobileNavItem} ${isActive ? styles.mobileNavActive : ''}`
          }
        >
          <span className={styles.mobileNavIcon}>{icon}</span>
          <span className={styles.mobileNavLabel}>{label === 'My Profile' ? 'Profile' : label}</span>
        </NavLink>
      ))}
    </nav>}
    </>
  );
}
